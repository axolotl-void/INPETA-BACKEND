/**
 * seedFasilitas.js — Seed data Fasilitas (Puskeswan & Klinik Hewan) Provinsi Aceh
 *
 * Membaca array JSON fasilitas yang di-hardcode di script ini,
 * mencocokkan field `wilayah` (string) ke tabel Wilayah (level KABUPATEN),
 * lalu meng-insert ke tabel Fasilitas.
 *
 * Jalankan:
 *   node seedFasilitas.js
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// =====================================================================
// 1. DATA FASILITAS 
// =====================================================================

const dataFasilitas = [
  {
    nama_lokasi: "Puskeswan Ulee Kareng",
    kategori: "PUSKESWAN",
    wilayah: "Banda Aceh",
    alamat: "Jl. Teuku Ie Lubeue, Kec. Ulee Kareng",
    latitude: 5.5414,
    longitude: 95.3432,
  },
  {
    nama_lokasi: "Puskeswan Keudah",
    kategori: "PUSKESWAN",
    wilayah: "Banda Aceh",
    alamat: "Gampong Keudah, Kec. Kuta Raja",
    latitude: 5.5598,
    longitude: 95.3181,
  },
  {
    nama_lokasi: "Klinik Hewan Dinas Peternakan Aceh",
    kategori: "KLINIK HEWAN",
    wilayah: "Banda Aceh",
    alamat: "Jl. Mr. Muhammad Hasan No.147, Lhong Raya",
    latitude: 5.5255,
    longitude: 95.3262,
  },
  {
    nama_lokasi: "Royal Petcare Petshop & Clinic",
    kategori: "KLINIK HEWAN",
    wilayah: "Banda Aceh",
    alamat: "Jl. Teuku Nyak Arief, Lamgugob, Syiah Kuala",
    latitude: 5.5762,
    longitude: 95.3524,
  },
  {
    nama_lokasi: "Our's Petshop & Clinic",
    kategori: "KLINIK HEWAN",
    wilayah: "Banda Aceh",
    alamat: "Jl. Seulawah No.72, Seutui, Baiturrahman",
    latitude: 5.5432,
    longitude: 95.3115,
  },
  {
    nama_lokasi: "Al Petshop & Clinic",
    kategori: "KLINIK HEWAN",
    wilayah: "Banda Aceh",
    alamat: "Beurawe, Kec. Kuta Alam",
    latitude: 5.5621,
    longitude: 95.3354,
  },
  {
    nama_lokasi: "Atjeh Petshop & Clinic",
    kategori: "KLINIK HEWAN",
    wilayah: "Banda Aceh",
    alamat: "Lam Lagang, Kec. Banda Raya",
    latitude: 5.5324,
    longitude: 95.3089,
  },
  {
    nama_lokasi: "Puskeswan Saree",
    kategori: "PUSKESWAN",
    wilayah: "Aceh Besar",
    alamat: "Jl. Banda Aceh-Medan, Saree, Lembah Seulawah",
    latitude: 5.4452,
    longitude: 95.7175,
  },
  {
    nama_lokasi: "Puskeswan Jantho",
    kategori: "PUSKESWAN",
    wilayah: "Aceh Besar",
    alamat: "Kota Jantho, Kec. Jantho",
    latitude: 5.2981,
    longitude: 95.6124,
  },
  {
    nama_lokasi: "Puskeswan Lhoknga",
    kategori: "PUSKESWAN",
    wilayah: "Aceh Besar",
    alamat: "Kec. Lhoknga",
    latitude: 5.4795,
    longitude: 95.2412,
  },
  {
    nama_lokasi: "Puskeswan Samalanga",
    kategori: "PUSKESWAN",
    wilayah: "Bireuen",
    alamat: "Jl. Banta Ahmad, Geulanggang Baro, Kota Juang",
    latitude: 5.2125,
    longitude: 96.3542,
  },
  {
    nama_lokasi: "Puskeswan Juli",
    kategori: "PUSKESWAN",
    wilayah: "Bireuen",
    alamat: "Kec. Juli",
    latitude: 5.1524,
    longitude: 96.7122,
  },
  {
    nama_lokasi: "Puskeswan Gandapura",
    kategori: "PUSKESWAN",
    wilayah: "Bireuen",
    alamat: "Kec. Gandapura",
    latitude: 5.2341,
    longitude: 96.9125,
  },
  {
    nama_lokasi: "Puskeswan Idi Rayeuk",
    kategori: "PUSKESWAN",
    wilayah: "Aceh Timur",
    alamat: "Kec. Idi Rayeuk",
    latitude: 4.9082,
    longitude: 97.5124,
  },
  {
    nama_lokasi: "Puskeswan Meureudu",
    kategori: "PUSKESWAN",
    wilayah: "Pidie Jaya",
    alamat: "Kec. Meureudu",
    latitude: 5.2452,
    longitude: 96.2241,
  },
  {
    nama_lokasi: "Puskeswan Bandar Baru",
    kategori: "PUSKESWAN",
    wilayah: "Pidie Jaya",
    alamat: "Paru Cot, Bandar Baru",
    latitude: 5.2921,
    longitude: 96.0245,
  },
  {
    nama_lokasi: "Puskeswan Mutiara",
    kategori: "PUSKESWAN",
    wilayah: "Pidie",
    alamat: "Baro Yaman, Kec. Mutiara",
    latitude: 5.3124,
    longitude: 95.9452,
  },
  {
    nama_lokasi: "Lab Veteriner Sigli",
    kategori: "PUSKESWAN",
    wilayah: "Pidie",
    alamat: "Jl. Prof. A. Majid Ibrahim, Sigli",
    latitude: 5.3821,
    longitude: 95.9542,
  },
  {
    nama_lokasi: "Puskeswan Muara Satu",
    kategori: "PUSKESWAN",
    wilayah: "Lhokseumawe",
    alamat: "Batu Phat Timur, Muara Satu",
    latitude: 5.2124,
    longitude: 97.0542,
  },
  {
    nama_lokasi: "Puskeswan Blang Mangat",
    kategori: "PUSKESWAN",
    wilayah: "Lhokseumawe",
    alamat: "Mesjid Punteut, Blang Mangat",
    latitude: 5.1425,
    longitude: 97.1821,
  },
  {
    nama_lokasi: "Puskeswan Lhoksukon",
    kategori: "PUSKESWAN",
    wilayah: "Aceh Utara",
    alamat: "Kec. Lhoksukon",
    latitude: 5.0421,
    longitude: 97.3241,
  },
  {
    nama_lokasi: "Puskeswan Dewantara",
    kategori: "PUSKESWAN",
    wilayah: "Aceh Utara",
    alamat: "Paloh Lada, Dewantara",
    latitude: 5.2214,
    longitude: 97.0125,
  },
  {
    nama_lokasi: "Puskeswan Meukek",
    kategori: "PUSKESWAN",
    wilayah: "Aceh Selatan",
    alamat: "Tanjung Harapan, Meukek",
    latitude: 3.4241,
    longitude: 97.0821,
  },
  {
    nama_lokasi: "Puskeswan Blang Pidie",
    kategori: "PUSKESWAN",
    wilayah: "Aceh Barat Daya",
    alamat: "Lhung Asan, Blang Pidie",
    latitude: 3.7421,
    longitude: 96.8452,
  },
  {
    nama_lokasi: "Puskeswan Meureubo",
    kategori: "PUSKESWAN",
    wilayah: "Aceh Barat",
    alamat: "Paya Peunaga, Meureubo",
    latitude: 4.1245,
    longitude: 96.1821,
  },
  {
    nama_lokasi: "Puskeswan Darul Makmur",
    kategori: "PUSKESWAN",
    wilayah: "Nagan Raya",
    alamat: "Alue Bilie, Darul Makmur",
    latitude: 3.8842,
    longitude: 96.5241,
  },
  {
    nama_lokasi: "Puskeswan Lampahan",
    kategori: "PUSKESWAN",
    wilayah: "Bener Meriah",
    alamat: "Kec. Timang Gajah",
    latitude: 4.7421,
    longitude: 96.7821,
  },
  {
    nama_lokasi: "Puskeswan Pondok Baru",
    kategori: "PUSKESWAN",
    wilayah: "Bener Meriah",
    alamat: "Musara, Kec. Bandar",
    latitude: 4.8124,
    longitude: 96.9124,
  },
  {
    nama_lokasi: "Puskeswan Langsa Timur",
    kategori: "PUSKESWAN",
    wilayah: "Kota Langsa",
    alamat: "Kec. Langsa Timur",
    latitude: 4.4721,
    longitude: 98.0241,
  },
  {
    nama_lokasi: "Puskeswan Kota Sabang",
    kategori: "PUSKESWAN",
    wilayah: "Sabang",
    alamat: "Kec. Suka Jaya",
    latitude: 5.8321,
    longitude: 95.3412,
  },
];

// =====================================================================
// 2. MAIN SEED FUNCTION
// =====================================================================

async function main() {
  console.log("🏥 Memulai seed data Fasilitas...");
  console.log(`   Total data: ${dataFasilitas.length}\n`);

  if (dataFasilitas.length === 0) {
    console.log("⚠️  Array dataFasilitas masih kosong. Silakan paste data JSON Anda terlebih dahulu.");
    return;
  }

  let berhasil = 0;
  let gagal = 0;

  for (const item of dataFasilitas) {
    // ── Cari wilayah yang cocok di tabel Wilayah (level KABUPATEN) ──
    const wilayah = await prisma.wilayah.findFirst({
      where: {
        nama_wilayah: {
          contains: item.wilayah,
          mode: "insensitive",
        },
        level: "KABUPATEN",
      },
    });

    // ── Jika wilayah tidak ditemukan, skip dan lanjutkan ──
    if (!wilayah) {
      console.log(`   ⚠️  Wilayah "${item.wilayah}" tidak ditemukan di database. Skipping: ${item.nama_lokasi}`);
      gagal++;
      continue;
    }

    // ── Insert fasilitas ke database ──
    await prisma.fasilitas.create({
      data: {
        nama_lokasi: item.nama_lokasi,
        kategori: item.kategori,
        latitude: item.latitude,
        longitude: item.longitude,
        alamat: item.alamat || null,
        wilayah_id: wilayah.id,
      },
    });

    console.log(`   ✅ ${item.nama_lokasi} → Wilayah: ${wilayah.nama_wilayah} (ID: ${wilayah.id})`);
    berhasil++;
  }

  // ── Ringkasan ──
  console.log("\n" + "=".repeat(50));
  console.log("📊 Ringkasan Seed Fasilitas:");
  console.log(`   Total data    : ${dataFasilitas.length}`);
  console.log(`   Berhasil      : ${berhasil}`);
  console.log(`   Gagal/Skipped : ${gagal}`);
  console.log("=".repeat(50));

  // ── Verifikasi total di database ──
  const totalFasilitas = await prisma.fasilitas.count();
  console.log(`\n🗃️  Total fasilitas di database sekarang: ${totalFasilitas}`);
  console.log("✅ Seed fasilitas selesai!");
}

// =====================================================================
// 3. RUN
// =====================================================================

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
