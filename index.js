import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const { Pool } = pg;

dotenv.config();
const app = express();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// === 1. ROUTE TEST ===
app.get("/", (req, res) => {
  res.json({ pesan: "Halo Gi! Backend InPETA Berjalan Mulus! 🚀" });
});

// === 2. API SETUP ADMIN (Bikin Akun) ===
app.post("/api/setup-admin", async (req, res) => {
  try {
    const { email, password, nama_lengkap } = req.body;
    const cekAdmin = await prisma.user.findUnique({ where: { email } });
    if (cekAdmin) return res.status(400).json({ error: "Email sudah terdaftar!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const adminBaru = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        nama_lengkap: nama_lengkap,
        role: "ADMIN"
      }
    });

    res.json({ pesan: "Akun Admin berhasil dibuat!", data: { email: adminBaru.email, nama: adminBaru.nama_lengkap } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// === 3. API LOGIN ===
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "Email tidak ditemukan!" });

    const passwordCocok = await bcrypt.compare(password, user.password);
    if (!passwordCocok) return res.status(401).json({ error: "Password salah!" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } 
    );

    res.json({
      pesan: "Login sukses!",
      token: token,
      user: { nama: user.nama_lengkap, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// === 4. API PETA & POPULASI ===
// =================================================================
// 📍 API UPDATE POPULASI TERNAK (KHUSUS ADMIN)
// =================================================================
app.put('/api/populasi/:wilayahId', async (req, res) => {
  const wilayahId = parseInt(req.params.wilayahId);
  const { jml_sapi, jml_kambing, jml_ayam, tahun } = req.body;

  // Tahun default kalau dari frontend nggak dikirim
  const tahunData = tahun || 2024; 

  try {
    // 1. Cek dulu, apakah data populasi untuk wilayah ini di tahun tersebut sudah ada?
    let cekPopulasi = await prisma.populasi.findFirst({
      where: { 
        wilayah_id: wilayahId, 
        tahun: tahunData 
      }
    });

    let hasil;

    if (cekPopulasi) {
      // 2a. Kalau datanya SUDAH ADA, kita lakukan UPDATE
      hasil = await prisma.populasi.update({
        where: { id: cekPopulasi.id },
        data: { 
          jml_sapi: Number(jml_sapi), 
          jml_kambing: Number(jml_kambing), 
          jml_ayam: Number(jml_ayam) 
        }
      });
    } else {
      // 2b. Kalau datanya BELUM ADA, kita BIKIN BARU (Create)
      hasil = await prisma.populasi.create({
        data: { 
          wilayah_id: wilayahId, 
          tahun: tahunData, 
          jml_sapi: Number(jml_sapi), 
          jml_kambing: Number(jml_kambing), 
          jml_ayam: Number(jml_ayam),
          // Set default 0 untuk hewan lain agar tidak error constraint
          jml_kerbau: 0, 
          jml_babi: 0 
        }
      });
    }

    res.status(200).json({ 
      message: "Data populasi berhasil disimpan!", 
      data: hasil 
    });

  } catch (error) {
    console.error("Error Update Populasi:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server saat menyimpan data." });
  }
});

app.get("/api/populasi/:wilayah_id", async (req, res) => {
  try {
    const id = parseInt(req.params.wilayah_id); 
    const dataPopulasi = await prisma.populasi.findFirst({ where: { wilayah_id: id, tahun: 2026 } });

    if (!dataPopulasi) {
      return res.status(404).json({ error: "Data populasi tidak ditemukan untuk wilayah ini" });
    }
    res.json({ pesan: "Berhasil mengambil data populasi", data: dataPopulasi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// === JALANKAN SERVER ===
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Server InPETA nyala di port ${PORT}`);
  console.log(`🔗 Cek di: http://127.0.0.1:${PORT}`);
  console.log(`=================================`);
});