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
  filename: (req, file, cb) => {
    const prefix = req.path.includes('fitur') ? 'fitur' : 'logo';
    cb(null, prefix + '-' + Date.now() + path.extname(file.originalname));
  }
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

// DELETE HERO
app.delete("/api/admin/hero/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.heroContent.delete({ where: { id } });
    res.json({ message: "Hero deleted", data: deleted });
  } catch (error) { res.status(500).json({ error: error.message }); }
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

// DELETE LOGO
app.delete("/api/admin/logo/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.logo.delete({ where: { id } });
    res.json({ message: "Logo deleted", data: deleted });
  } catch (error) { res.status(500).json({ error: error.message }); }
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

// DELETE STATS
app.delete("/api/admin/stats/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.heroStat.delete({ where: { id } });
    res.json({ message: "Stat deleted", data: deleted });
  } catch (error) { res.status(500).json({ error: error.message }); }
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

// DELETE MENUS (Handle Sub-menus / Foreign Keys)
app.delete("/api/admin/menus/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.navbarMenu.deleteMany({ where: { parent_id: id } }); // Delete children first
    const deleted = await prisma.navbarMenu.delete({ where: { id } });
    res.json({ message: "Menu deleted", data: deleted });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- 5. TENTANG CONTENT ---
app.get("/api/admin/tentang", async (req, res) => {
  try { res.json(await prisma.tentangContent.findMany({ orderBy: { id: 'desc' } })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post("/api/admin/tentang", async (req, res) => {
  try {
    if (req.body.is_active) await prisma.tentangContent.updateMany({ data: { is_active: false } });
    res.json(await prisma.tentangContent.create({ data: { title: req.body.title, description: req.body.description, image_url: req.body.image_url || null, is_active: req.body.is_active || false } }));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put("/api/admin/tentang/:id", async (req, res) => {
  try { res.json(await prisma.tentangContent.update({ where: { id: parseInt(req.params.id, 10) }, data: { title: req.body.title, description: req.body.description, image_url: req.body.image_url || null } })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.put("/api/admin/tentang/:id/activate", async (req, res) => {
  try {
    await prisma.tentangContent.updateMany({ data: { is_active: false } });
    res.json(await prisma.tentangContent.update({ where: { id: parseInt(req.params.id, 10) }, data: { is_active: true } }));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete("/api/admin/tentang/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.tentangContent.delete({ where: { id } });
    res.json({ message: "Tentang content deleted", data: deleted });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- 6. TENTANG POINTS ---
app.get("/api/admin/tentang-points", async (req, res) => {
  try { res.json(await prisma.tentangPoint.findMany({ orderBy: { id: 'asc' } })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post("/api/admin/tentang-points", async (req, res) => {
  try { res.json(await prisma.tentangPoint.create({ data: { text: req.body.text, url: req.body.url || null } })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.put("/api/admin/tentang-points/:id", async (req, res) => {
  try { res.json(await prisma.tentangPoint.update({ where: { id: parseInt(req.params.id, 10) }, data: { text: req.body.text, url: req.body.url || null } })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete("/api/admin/tentang-points/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.tentangPoint.delete({ where: { id } });
    res.json({ message: "Tentang point deleted", data: deleted });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- 7. FITUR UNGGULAN ---
app.get("/api/admin/fitur-unggulan", async (req, res) => {
  try { res.json(await prisma.fiturUnggulan.findMany({ orderBy: { id: 'asc' } })); }
  catch (error) { res.status(500).json({ error: error.message }); }
});

app.post("/api/admin/fitur-unggulan", upload.single("icon"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File ikon belum diunggah!" });
    const iconUrl = `http://127.0.0.1:5000/uploads/${req.file.filename}`;
    res.json(await prisma.fiturUnggulan.create({ data: { title: req.body.title, description: req.body.description, icon_url: iconUrl, url: req.body.url || null } }));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put("/api/admin/fitur-unggulan/:id", upload.single("icon"), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const updateData = { title: req.body.title, description: req.body.description, url: req.body.url || null };
    if (req.file) {
      updateData.icon_url = `http://127.0.0.1:5000/uploads/${req.file.filename}`;
    }
    res.json(await prisma.fiturUnggulan.update({ where: { id }, data: updateData }));
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete("/api/admin/fitur-unggulan/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await prisma.fiturUnggulan.delete({ where: { id } });
    res.json({ message: "Fitur deleted", data: deleted });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- 📍 API TAMPILAN DEPAN ---
app.get("/api/landing", async (req, res) => {
  try {
    const [logo, heroContent, heroStats, menus, tentangContent, tentangPoints, fiturUnggulan] = await Promise.all([
      prisma.logo.findFirst({ where: { is_active: true } }),
      prisma.heroContent.findFirst({ where: { is_active: true } }),
      prisma.heroStat.findMany({ orderBy: { id: 'asc' } }),
      prisma.navbarMenu.findMany({ where: { parent_id: null }, include: { children: true }, orderBy: { id: 'asc' } }),
      prisma.tentangContent.findFirst({ where: { is_active: true } }),
      prisma.tentangPoint.findMany({ orderBy: { id: 'asc' } }),
      prisma.fiturUnggulan.findMany({ orderBy: { id: 'asc' } })
    ]);
    res.json({ data: { logo, heroContent, heroStats, menus, tentangContent, tentangPoints, fiturUnggulan } });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.listen(5000, () => console.log("🚀 Server Ready at Port 5000!"));