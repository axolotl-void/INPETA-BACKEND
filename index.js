import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

dotenv.config();
const app = express();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// --- 📍 KONFIGURASI UPLOAD LOGO ---
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const prefix = req.path.includes("fitur") ? "fitur" : "logo";
    cb(null, prefix + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static(uploadDir));

// --- 📍 API AUTH & WILAYAH ---
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Gagal login" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      user: { nama: user.nama_lengkap, email: user.email, role: user.role, avatar_url: user.avatar_url, dark_mode: user.dark_mode },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/setup-admin", async (req, res) => {
  try {
    const { email, password, nama_lengkap } = req.body;
    const cekAdmin = await prisma.user.findUnique({ where: { email } });
    if (cekAdmin)
      return res.status(400).json({ error: "Email sudah terdaftar!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminBaru = await prisma.user.create({
      data: { email, password: hashedPassword, nama_lengkap, role: "ADMIN" },
    });
    res.json({ pesan: "Akun Admin berhasil dibuat!", data: adminBaru });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/wilayah", async (req, res) => {
  try {
    res.json({
      data: await prisma.wilayah.findMany({ orderBy: { id: "asc" } }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CREATE WILAYAH ---
app.post("/api/admin/wilayah", async (req, res) => {
  try {
    const { nama_wilayah, level, warna_area } = req.body;
    if (!nama_wilayah) return res.status(400).json({ error: "Nama wilayah wajib diisi!" });

    const newWilayah = await prisma.wilayah.create({
      data: {
        nama_wilayah,
        level: level || "KABUPATEN",
        warna_area: warna_area || null,
      },
    });
    res.json({ message: "Wilayah berhasil ditambahkan", data: newWilayah });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- UPDATE WILAYAH ---
app.put("/api/admin/wilayah/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nama_wilayah, level, warna_area } = req.body;
    if (!nama_wilayah) return res.status(400).json({ error: "Nama wilayah wajib diisi!" });

    const updated = await prisma.wilayah.update({
      where: { id },
      data: { nama_wilayah, level, warna_area },
    });
    res.json({ message: "Wilayah berhasil diperbarui", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DELETE WILAYAH ---
app.delete("/api/admin/wilayah/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Hapus relasi anak terlebih dahulu (populasi & fasilitas)
    await prisma.populasi.deleteMany({ where: { wilayah_id: id } });
    await prisma.fasilitas.deleteMany({ where: { wilayah_id: id } });
    const deleted = await prisma.wilayah.delete({ where: { id } });
    res.json({ message: "Wilayah berhasil dihapus", data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/populasi/:id", async (req, res) => {
  try {
    const { jml_sapi, jml_kambing, jml_ayam, tahun } = req.body;
    const tahunData = parseInt(tahun, 10) || 2024;
    const wilayahId = parseInt(req.params.id, 10);

    const data = await prisma.populasi.upsert({
      where: { wilayah_id_tahun: { wilayah_id: wilayahId, tahun: tahunData } },
      update: {
        jml_sapi: parseInt(jml_sapi, 10),
        jml_kambing: parseInt(jml_kambing, 10),
        jml_ayam: parseInt(jml_ayam, 10),
      },
      create: {
        wilayah_id: wilayahId,
        tahun: tahunData,
        jml_sapi: parseInt(jml_sapi, 10),
        jml_kambing: parseInt(jml_kambing, 10),
        jml_ayam: parseInt(jml_ayam, 10),
        jml_kerbau: 0,
      },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================================
// 📍 API CMS ADMIN (LOGIKA CRUD DENGAN ROBUST DELETE)
// ==========================================================

// --- 1. HERO CONTENT ---
app.get("/api/admin/hero", async (req, res) => {
  try {
    res.json(await prisma.heroContent.findMany({ orderBy: { id: "desc" } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/hero", async (req, res) => {
  try {
    if (req.body.is_active)
      await prisma.heroContent.updateMany({ data: { is_active: false } });
    res.json(
      await prisma.heroContent.create({
        data: {
          main_title: req.body.main_title,
          description: req.body.description,
          is_active: req.body.is_active || false,
        },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/hero/:id", async (req, res) => {
  try {
    res.json(
      await prisma.heroContent.update({
        where: { id: parseInt(req.params.id, 10) },
        data: {
          main_title: req.body.main_title,
          description: req.body.description,
        },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/hero/:id/activate", async (req, res) => {
  try {
    await prisma.heroContent.updateMany({ data: { is_active: false } });
    res.json(
      await prisma.heroContent.update({
        where: { id: parseInt(req.params.id, 10) },
        data: { is_active: true },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE HERO
app.delete("/api/admin/hero/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.heroContent.delete({ where: { id } });
    res.json({ message: "Hero deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 2. LOGO ---
app.get("/api/admin/logo", async (req, res) => {
  try {
    res.json(await prisma.logo.findMany({ orderBy: { id: "desc" } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/logo", upload.single("logo"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "File logo belum diunggah!" });
    const imageUrl = `http://127.0.0.1:5000/uploads/${req.file.filename}`;
    await prisma.logo.updateMany({ data: { is_active: false } });
    res.json(
      await prisma.logo.create({
        data: {
          image_url: imageUrl,
          name: req.file.originalname,
          is_active: true,
        },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/logo/:id/activate", async (req, res) => {
  try {
    await prisma.logo.updateMany({ data: { is_active: false } });
    res.json(
      await prisma.logo.update({
        where: { id: parseInt(req.params.id, 10) },
        data: { is_active: true },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE LOGO
app.delete("/api/admin/logo/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.logo.delete({ where: { id } });
    res.json({ message: "Logo deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 3. STATISTIK ---
app.get("/api/admin/stats", async (req, res) => {
  try {
    res.json(await prisma.heroStat.findMany({ orderBy: { id: "asc" } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/stats", async (req, res) => {
  try {
    res.json(
      await prisma.heroStat.create({
        data: {
          stat_value: req.body.stat_value,
          stat_label: req.body.stat_label,
        },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/stats/:id", async (req, res) => {
  try {
    res.json(
      await prisma.heroStat.update({
        where: { id: parseInt(req.params.id, 10) },
        data: {
          stat_value: req.body.stat_value,
          stat_label: req.body.stat_label,
        },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE STATS
app.delete("/api/admin/stats/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.heroStat.delete({ where: { id } });
    res.json({ message: "Stat deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 4. MENU NAVBAR ---
app.get("/api/admin/menus", async (req, res) => {
  try {
    res.json(
      await prisma.navbarMenu.findMany({
        where: { parent_id: null },
        include: { children: true },
        orderBy: { id: "asc" },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/menus", async (req, res) => {
  try {
    const parentId = req.body.parent_id
      ? parseInt(req.body.parent_id, 10)
      : null;
    res.json(
      await prisma.navbarMenu.create({
        data: { title: req.body.title, url: req.body.url, parent_id: parentId },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/menus/:id", async (req, res) => {
  try {
    const parentId = req.body.parent_id
      ? parseInt(req.body.parent_id, 10)
      : null;
    res.json(
      await prisma.navbarMenu.update({
        where: { id: parseInt(req.params.id, 10) },
        data: { title: req.body.title, url: req.body.url, parent_id: parentId },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE MENUS (Handle Sub-menus / Foreign Keys)
app.delete("/api/admin/menus/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.navbarMenu.deleteMany({ where: { parent_id: id } }); // Delete children first
    const deleted = await prisma.navbarMenu.delete({ where: { id } });
    res.json({ message: "Menu deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 5. TENTANG CONTENT ---
app.get("/api/admin/tentang", async (req, res) => {
  try {
    res.json(await prisma.tentangContent.findMany({ orderBy: { id: "desc" } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/tentang", async (req, res) => {
  try {
    if (req.body.is_active)
      await prisma.tentangContent.updateMany({ data: { is_active: false } });
    res.json(
      await prisma.tentangContent.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          image_url: req.body.image_url || null,
          is_active: req.body.is_active || false,
        },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/tentang/:id", async (req, res) => {
  try {
    res.json(
      await prisma.tentangContent.update({
        where: { id: parseInt(req.params.id, 10) },
        data: {
          title: req.body.title,
          description: req.body.description,
          image_url: req.body.image_url || null,
        },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/tentang/:id/activate", async (req, res) => {
  try {
    await prisma.tentangContent.updateMany({ data: { is_active: false } });
    res.json(
      await prisma.tentangContent.update({
        where: { id: parseInt(req.params.id, 10) },
        data: { is_active: true },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/tentang/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.tentangContent.delete({ where: { id } });
    res.json({ message: "Tentang content deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 6. TENTANG POINTS ---
app.get("/api/admin/tentang-points", async (req, res) => {
  try {
    res.json(await prisma.tentangPoint.findMany({ orderBy: { id: "asc" } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/tentang-points", async (req, res) => {
  try {
    res.json(
      await prisma.tentangPoint.create({
        data: { text: req.body.text, url: req.body.url || null },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/tentang-points/:id", async (req, res) => {
  try {
    res.json(
      await prisma.tentangPoint.update({
        where: { id: parseInt(req.params.id, 10) },
        data: { text: req.body.text, url: req.body.url || null },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/tentang-points/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.tentangPoint.delete({ where: { id } });
    res.json({ message: "Tentang point deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 7. FITUR UNGGULAN ---
app.get("/api/admin/fitur-unggulan", async (req, res) => {
  try {
    res.json(await prisma.fiturUnggulan.findMany({ orderBy: { id: "asc" } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/api/admin/fitur-unggulan",
  upload.single("icon"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "File ikon belum diunggah!" });
      const iconUrl = `http://127.0.0.1:5000/uploads/${req.file.filename}`;
      res.json(
        await prisma.fiturUnggulan.create({
          data: {
            title: req.body.title,
            description: req.body.description,
            icon_url: iconUrl,
            url: req.body.url || null,
          },
        }),
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
);

app.put(
  "/api/admin/fitur-unggulan/:id",
  upload.single("icon"),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updateData = {
        title: req.body.title,
        description: req.body.description,
        url: req.body.url || null,
      };
      if (req.file) {
        updateData.icon_url = `http://127.0.0.1:5000/uploads/${req.file.filename}`;
      }
      res.json(
        await prisma.fiturUnggulan.update({ where: { id }, data: updateData }),
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

app.delete("/api/admin/fitur-unggulan/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.fiturUnggulan.delete({ where: { id } });
    res.json({ message: "Fitur deleted", data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 📍 API TAMPILAN DEPAN ---
app.get("/api/landing", async (req, res) => {
  try {
    const [
      logo,
      heroContent,
      heroStats,
      menus,
      tentangContent,
      tentangPoints,
      fiturUnggulan,
      faqs,
      berita,
      footerConfig,
    ] = await Promise.all([
      prisma.logo.findFirst({ where: { is_active: true } }),
      prisma.heroContent.findFirst({ where: { is_active: true } }),
      prisma.heroStat.findMany({ orderBy: { id: "asc" } }),
      prisma.navbarMenu.findMany({
        where: { parent_id: null },
        include: { children: true },
        orderBy: { id: "asc" },
      }),
      prisma.tentangContent.findFirst({ where: { is_active: true } }),
      prisma.tentangPoint.findMany({ orderBy: { id: "asc" } }),
      prisma.fiturUnggulan.findMany({ orderBy: { id: "asc" } }),
      prisma.faq.findMany({ where: { is_active: true }, orderBy: { id: "asc" } }),
      prisma.berita.findMany({ where: { is_active: true }, orderBy: { published_at: "desc" }, take: 3 }),
      prisma.footerConfig.findFirst({ where: { is_active: true } }),
    ]);
    res.json({
      data: {
        logo,
        heroContent,
        heroStats,
        menus,
        tentangContent,
        tentangPoints,
        fiturUnggulan,
        faqs,
        berita,
        footerConfig,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/berita", async (req, res) => {
  try {
    const berita = await prisma.berita.findMany({
      where: { is_active: true },
      orderBy: { published_at: "desc" },
    });
    res.json({ data: berita });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 8. FAQ ---
app.get("/api/admin/faq", async (req, res) => {
  try {
    res.json(await prisma.faq.findMany({ orderBy: { id: "asc" } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/faq", async (req, res) => {
  try {
    const { question, answer } = req.body;
    res.json(await prisma.faq.create({ data: { question, answer } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/faq/:id", async (req, res) => {
  try {
    const { question, answer } = req.body;
    res.json(
      await prisma.faq.update({
        where: { id: parseInt(req.params.id, 10) },
        data: { question, answer },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/faq/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.faq.delete({ where: { id } });
    res.json({ message: "FAQ dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 9. BERITA & PUBLIKASI ---
app.get("/api/admin/berita", async (req, res) => {
  try {
    res.json(await prisma.berita.findMany({ orderBy: { published_at: "desc" } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/berita", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file
      ? `http://127.0.0.1:5000/uploads/${req.file.filename}`
      : req.body.image_url;
    if (!imageUrl) return res.status(400).json({ error: "Gambar wajib diunggah!" });
    res.json(
      await prisma.berita.create({
        data: {
          title: req.body.title,
          summary: req.body.summary,
          image_url: imageUrl,
          source_url: req.body.source_url,
        },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/berita/:id", upload.single("image"), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updateData = {
      title: req.body.title,
      summary: req.body.summary,
      source_url: req.body.source_url,
    };
    if (req.file) {
      updateData.image_url = `http://127.0.0.1:5000/uploads/${req.file.filename}`;
    }
    res.json(await prisma.berita.update({ where: { id }, data: updateData }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/berita/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.berita.delete({ where: { id } });
    res.json({ message: "Berita dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 10. FOOTER CONFIG ---
app.get("/api/admin/footer", async (req, res) => {
  try {
    res.json(await prisma.footerConfig.findMany({ orderBy: { id: "desc" } }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/footer", upload.single("logo"), async (req, res) => {
  try {
    const logoUrl = req.file
      ? `http://127.0.0.1:5000/uploads/${req.file.filename}`
      : req.body.logo_url;
    if (!logoUrl) return res.status(400).json({ error: "Logo wajib diunggah!" });
    res.json(
      await prisma.footerConfig.create({
        data: {
          logo_url: logoUrl,
          description: req.body.description,
          alamat: req.body.alamat,
          email: req.body.email,
          telepon: req.body.telepon,
          copyright: req.body.copyright,
          facebook_url: req.body.facebook_url || null,
          instagram_url: req.body.instagram_url || null,
          twitter_url: req.body.twitter_url || null,
          youtube_url: req.body.youtube_url || null,
        },
      }),
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/footer/:id", upload.single("logo"), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updateData = {
      description: req.body.description,
      alamat: req.body.alamat,
      email: req.body.email,
      telepon: req.body.telepon,
      copyright: req.body.copyright,
      facebook_url: req.body.facebook_url || null,
      instagram_url: req.body.instagram_url || null,
      twitter_url: req.body.twitter_url || null,
      youtube_url: req.body.youtube_url || null,
    };
    if (req.file) {
      updateData.logo_url = `http://127.0.0.1:5000/uploads/${req.file.filename}`;
    }
    res.json(await prisma.footerConfig.update({ where: { id }, data: updateData }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/footer/:id/activate", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.footerConfig.updateMany({ data: { is_active: false } });
    const activated = await prisma.footerConfig.update({ where: { id }, data: { is_active: true } });
    res.json(activated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/footer/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.footerConfig.delete({ where: { id } });
    res.json({ message: "Footer dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================================
// 📍 API FASILITAS & LOKASI (CRUD)
// ==========================================================

// --- GET ALL FASILITAS (with Wilayah relation) ---
app.get("/api/admin/fasilitas", async (req, res) => {
  try {
    const data = await prisma.fasilitas.findMany({
      include: { wilayah: { select: { id: true, nama_wilayah: true } } },
      orderBy: { created_at: "desc" },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CREATE FASILITAS ---
app.post("/api/admin/fasilitas", async (req, res) => {
  try {
    const { nama_lokasi, kategori, latitude, longitude, alamat, wilayah_id } = req.body;
    if (!nama_lokasi || !kategori || latitude == null || longitude == null || !wilayah_id) {
      return res.status(400).json({ error: "Lengkapi semua field wajib!" });
    }
    const data = await prisma.fasilitas.create({
      data: {
        nama_lokasi,
        kategori,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        alamat: alamat || null,
        wilayah_id: parseInt(wilayah_id, 10),
      },
      include: { wilayah: { select: { id: true, nama_wilayah: true } } },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- UPDATE FASILITAS ---
app.put("/api/admin/fasilitas/:id", async (req, res) => {
  try {
    const { nama_lokasi, kategori, latitude, longitude, alamat, wilayah_id } = req.body;
    const data = await prisma.fasilitas.update({
      where: { id: req.params.id },
      data: {
        nama_lokasi,
        kategori,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        alamat: alamat || null,
        wilayah_id: parseInt(wilayah_id, 10),
      },
      include: { wilayah: { select: { id: true, nama_wilayah: true } } },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DELETE FASILITAS ---
app.delete("/api/admin/fasilitas/:id", async (req, res) => {
  try {
    const deleted = await prisma.fasilitas.delete({ where: { id: req.params.id } });
    res.json({ message: "Fasilitas dihapus", data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- PUBLIC API: GET ALL FASILITAS (for map markers) ---
app.get("/api/fasilitas", async (req, res) => {
  try {
    const data = await prisma.fasilitas.findMany({
      include: { wilayah: { select: { id: true, nama_wilayah: true } } },
      orderBy: { created_at: "desc" },
    });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================================
// 📍 MIDDLEWARE: AUTENTIKASI JWT
// ==========================================================
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "Token tidak ditemukan" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token tidak valid atau sudah kedaluwarsa" });
  }
};

// ==========================================================
// 📍 API PENGATURAN AKUN (Account Settings)
// ==========================================================

// --- GET PROFIL USER ---
app.get("/api/admin/account", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        nama_lengkap: true,
        role: true,
        avatar_url: true,
        is_active: true,
        dark_mode: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- UPDATE PROFIL USER (nama, email) ---
app.put("/api/admin/account/profile", authenticate, async (req, res) => {
  try {
    const { nama_lengkap, email } = req.body;
    if (!nama_lengkap || !email)
      return res.status(400).json({ error: "Nama dan email wajib diisi!" });

    // Cek apakah email sudah dipakai user lain
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail && existingEmail.id !== req.userId) {
      return res.status(400).json({ error: "Email sudah digunakan oleh akun lain!" });
    }

    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { nama_lengkap, email },
      select: {
        id: true,
        email: true,
        nama_lengkap: true,
        role: true,
        avatar_url: true,
        is_active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json({ message: "Profil berhasil diperbarui!", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- UPDATE AVATAR USER ---
app.put("/api/admin/account/avatar", authenticate, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File avatar belum diunggah!" });
    const avatarUrl = `http://127.0.0.1:5000/uploads/${req.file.filename}`;
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { avatar_url: avatarUrl },
      select: {
        id: true,
        email: true,
        nama_lengkap: true,
        role: true,
        avatar_url: true,
        is_active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json({ message: "Avatar berhasil diperbarui!", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- UBAH PASSWORD ---
app.put("/api/admin/account/password", authenticate, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password)
      return res.status(400).json({ error: "Password lama dan baru wajib diisi!" });
    if (new_password.length < 6)
      return res.status(400).json({ error: "Password baru minimal 6 karakter!" });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Password lama salah!" });

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });
    res.json({ message: "Password berhasil diubah!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================================
// 📍 API DARK MODE SETTINGS
// ==========================================================

app.get("/api/admin/settings", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { dark_mode: true },
    });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json({ data: { dark_mode: user.dark_mode } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/settings", authenticate, async (req, res) => {
  try {
    const { dark_mode } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { dark_mode: !!dark_mode },
      select: { dark_mode: true },
    });
    res.json({ message: "Pengaturan berhasil disimpan!", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================================
// 📍 API MANAJEMEN ADMIN (User Management - Super Admin Only)
// ==========================================================

// --- GET ALL USERS (exclude password) ---
app.get("/api/admin/users", authenticate, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        nama_lengkap: true,
        role: true,
        avatar_url: true,
        is_active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CREATE NEW ADMIN/STAFF ---
app.post("/api/admin/users", authenticate, async (req, res) => {
  try {
    const { nama_lengkap, email, password, role } = req.body;
    if (!nama_lengkap || !email || !password)
      return res.status(400).json({ error: "Nama, email, dan password wajib diisi!" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password minimal 6 karakter!" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ error: "Email sudah terdaftar!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        nama_lengkap,
        email,
        password: hashedPassword,
        role: role || "STAFF",
      },
      select: {
        id: true,
        email: true,
        nama_lengkap: true,
        role: true,
        avatar_url: true,
        is_active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json({ message: "Admin baru berhasil ditambahkan!", data: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- UPDATE USER (role, name, email, status) ---
app.put("/api/admin/users/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_lengkap, email, role, is_active } = req.body;

    // Check duplicate email
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== id)
        return res.status(400).json({ error: "Email sudah digunakan oleh akun lain!" });
    }

    const updateData = {};
    if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        nama_lengkap: true,
        role: true,
        avatar_url: true,
        is_active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json({ message: "Data admin berhasil diperbarui!", data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DELETE USER ---
app.delete("/api/admin/users/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent self-deletion
    if (id === req.userId)
      return res.status(400).json({ error: "Anda tidak bisa menghapus akun sendiri!" });

    await prisma.user.delete({ where: { id } });
    res.json({ message: "Akun admin berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log("🚀 Server Ready at Port 5000!"));