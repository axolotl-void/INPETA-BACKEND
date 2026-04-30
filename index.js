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
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, 'logo-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
app.use('/uploads', express.static(uploadDir));

// --- 📍 API AUTH & WILAYAH ---
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: "Gagal login" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { nama: user.nama_lengkap, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post("/api/setup-admin", async (req, res) => {
  try {
    const { email, password, nama_lengkap } = req.body;
    const cekAdmin = await prisma.user.findUnique({ where: { email } });
    if (cekAdmin) return res.status(400).json({ error: "Email sudah terdaftar!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminBaru = await prisma.user.create({
      data: { email, password: hashedPassword, nama_lengkap, role: "ADMIN" }
    });
    res.json({ pesan: "Akun Admin berhasil dibuat!", data: adminBaru });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
});

app.get("/api/wilayah", async (req, res) => {
  try { res.json({ data: await prisma.wilayah.findMany({ orderBy: { id: 'asc' } }) }); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/populasi/:id', async (req, res) => {
  try {
    const { jml_sapi, jml_kambing, jml_ayam, tahun } = req.body;
    const tahunData = parseInt(tahun, 10) || 2024;
    const wilayahId = parseInt(req.params.id, 10);

    const data = await prisma.populasi.upsert({
      where: { wilayah_id_tahun: { wilayah_id: wilayahId, tahun: tahunData } },
      update: { jml_sapi: parseInt(jml_sapi, 10), jml_kambing: parseInt(jml_kambing, 10), jml_ayam: parseInt(jml_ayam, 10) },
      create: { wilayah_id: wilayahId, tahun: tahunData, jml_sapi: parseInt(jml_sapi, 10), jml_kambing: parseInt(jml_kambing, 10), jml_ayam: parseInt(jml_ayam, 10), jml_kerbau: 0 }
    });
    res.json(data);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ==========================================================
// 📍 API CMS ADMIN (LOGIKA CRUD DENGAN ROBUST DELETE)
// ==========================================================

// --- 1. HERO CONTENT ---
app.get("/api/admin/hero", async (req, res) => {
  try { res.json(await prisma.heroContent.findMany({ orderBy: { id: 'desc' } })); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post("/api/admin/hero", async (req, res) => {
  try {
    if (req.body.is_active) await prisma.heroContent.updateMany({ data: { is_active: false } });
    res.json(await prisma.heroContent.create({ data: { main_title: req.body.main_title, description: req.body.description, is_active: req.body.is_active || false } }));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put("/api/admin/hero/:id", async (req, res) => {
  try { res.json(await prisma.heroContent.update({ where: { id: parseInt(req.params.id, 10) }, data: { main_title: req.body.main_title, description: req.body.description } })); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.put("/api/admin/hero/:id/activate", async (req, res) => {
  try {
    await prisma.heroContent.updateMany({ data: { is_active: false } });
    res.json(await prisma.heroContent.update({ where: { id: parseInt(req.params.id, 10) }, data: { is_active: true } }));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// 🔥 PERBAIKAN DELETE HERO
app.delete("/api/admin/hero/:id", async (req, res) => {
  console.log(`[DELETE] Request hapus Hero ID: ${req.params.id}`);
  try { 
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Format ID Hero tidak valid" });
    const deleted = await prisma.heroContent.delete({ where: { id } });
    res.json({ pesan: "Berhasil dihapus", data: deleted });
  } catch (error) { 
    console.error("[ERROR DELETE HERO]:", error);
    res.status(500).json({ error: "Gagal menghapus Hero: " + error.message }); 
  }
});

// --- 2. LOGO ---
app.get("/api/admin/logo", async (req, res) => {
  try { res.json(await prisma.logo.findMany({ orderBy: { id: 'desc' } })); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post("/api/admin/logo", upload.single("logo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File logo belum diunggah!" });
    const imageUrl = `http://127.0.0.1:5000/uploads/${req.file.filename}`;
    await prisma.logo.updateMany({ data: { is_active: false } });
    res.json(await prisma.logo.create({ data: { image_url: imageUrl, name: req.file.originalname, is_active: true } }));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put("/api/admin/logo/:id/activate", async (req, res) => {
  try {
    await prisma.logo.updateMany({ data: { is_active: false } });
    res.json(await prisma.logo.update({ where: { id: parseInt(req.params.id, 10) }, data: { is_active: true } }));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// 🔥 PERBAIKAN DELETE LOGO
app.delete("/api/admin/logo/:id", async (req, res) => {
  console.log(`[DELETE] Request hapus Logo ID: ${req.params.id}`);
  try { 
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Format ID Logo tidak valid" });
    const deleted = await prisma.logo.delete({ where: { id } });
    res.json({ pesan: "Berhasil dihapus", data: deleted });
  } catch (error) { 
    console.error("[ERROR DELETE LOGO]:", error);
    res.status(500).json({ error: "Gagal menghapus Logo: " + error.message }); 
  }
});

// --- 3. STATISTIK ---
app.get("/api/admin/stats", async (req, res) => {
  try { res.json(await prisma.heroStat.findMany({ orderBy: { id: 'asc' } })); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post("/api/admin/stats", async (req, res) => {
  try { res.json(await prisma.heroStat.create({ data: { stat_value: req.body.stat_value, stat_label: req.body.stat_label } })); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.put("/api/admin/stats/:id", async (req, res) => {
  try { res.json(await prisma.heroStat.update({ where: { id: parseInt(req.params.id, 10) }, data: { stat_value: req.body.stat_value, stat_label: req.body.stat_label } })); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

// 🔥 PERBAIKAN DELETE STATISTIK
app.delete("/api/admin/stats/:id", async (req, res) => {
  console.log(`[DELETE] Request hapus Statistik ID: ${req.params.id}`);
  try { 
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Format ID Statistik tidak valid" });
    const deleted = await prisma.heroStat.delete({ where: { id } });
    res.json({ pesan: "Berhasil dihapus", data: deleted });
  } catch (error) { 
    console.error("[ERROR DELETE STATISTIK]:", error);
    res.status(500).json({ error: "Gagal menghapus Statistik: " + error.message }); 
  }
});

// --- 4. MENU NAVBAR ---
app.get("/api/admin/menus", async (req, res) => {
  try { res.json(await prisma.navbarMenu.findMany({ where: { parent_id: null }, include: { children: true }, orderBy: { id: 'asc' } })); } 
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post("/api/admin/menus", async (req, res) => {
  try { 
    const parentId = req.body.parent_id ? parseInt(req.body.parent_id, 10) : null;
    res.json(await prisma.navbarMenu.create({ data: { title: req.body.title, url: req.body.url, parent_id: parentId } })); 
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put("/api/admin/menus/:id", async (req, res) => {
  try { 
    const parentId = req.body.parent_id ? parseInt(req.body.parent_id, 10) : null;
    res.json(await prisma.navbarMenu.update({ where: { id: parseInt(req.params.id, 10) }, data: { title: req.body.title, url: req.body.url, parent_id: parentId } })); 
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// 🔥 PERBAIKAN DELETE MENU (Terintegrasi Hapus Sub-menu otomatis)
app.delete("/api/admin/menus/:id", async (req, res) => {
  console.log(`[DELETE] Request hapus Menu ID: ${req.params.id}`);
  try { 
    const menuId = parseInt(req.params.id, 10);
    if (isNaN(menuId)) return res.status(400).json({ error: "Format ID Menu tidak valid" });
    
    // Hapus anak-anaknya dulu (sub-menu) biar nggak bentrok foreign key
    await prisma.navbarMenu.deleteMany({ where: { parent_id: menuId } });
    
    // Baru hapus menu utamanya
    const deleted = await prisma.navbarMenu.delete({ where: { id: menuId } }); 
    res.json({ pesan: "Berhasil dihapus", data: deleted });
  } catch (error) { 
    console.error("[ERROR DELETE MENU]:", error);
    res.status(500).json({ error: "Gagal menghapus Menu: " + error.message }); 
  }
});

// --- 📍 API TAMPILAN DEPAN ---
app.get("/api/landing", async (req, res) => {
  try {
    const [logo, heroContent, heroStats, menus] = await Promise.all([
      prisma.logo.findFirst({ where: { is_active: true } }),
      prisma.heroContent.findFirst({ where: { is_active: true } }),
      prisma.heroStat.findMany({ orderBy: { id: 'asc' } }),
      prisma.navbarMenu.findMany({ where: { parent_id: null }, include: { children: true }, orderBy: { id: 'asc' } })
    ]);
    res.json({ data: { logo, heroContent, heroStats, menus } });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.listen(5000, () => console.log("🚀 Server Ready at Port 5000!"));