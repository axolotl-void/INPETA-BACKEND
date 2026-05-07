/**
 * seedKecamatan.js — Seed 289 Kecamatan Aceh ke tabel Wilayah
 *
 * Membaca GeoJSON kecamatan dari frontend, mengekstrak nama unik,
 * lalu meng-insert ke database sebagai Wilayah level KECAMATAN.
 *
 * Duplikat nama (misal "Kuala" di 2 kabupaten berbeda) di-disambiguasi
 * dengan menambahkan nama kabupaten: "Kuala (Aceh Barat)".
 *
 * Jalankan:
 *   node seedKecamatan.js
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================================
// 1. KONFIGURASI
// =====================================================================

// Path ke file GeoJSON kecamatan di project frontend
const GEOJSON_PATH = path.resolve(
  __dirname,
  "../INPETA/src/data/geomap/kecamatan.json"
);

// Warna default untuk semua kecamatan (slate-200)
const DEFAULT_COLOR = "#e2e8f0";

// =====================================================================
// 2. HELPER: Title Case
// =====================================================================
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// =====================================================================
// 3. MAIN SEED FUNCTION
// =====================================================================
async function main() {
  console.log("📂 Membaca file GeoJSON...");

  // Baca & parse GeoJSON
  if (!fs.existsSync(GEOJSON_PATH)) {
    console.error(`❌ File tidak ditemukan: ${GEOJSON_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(GEOJSON_PATH, "utf-8");
  const geojson = JSON.parse(raw);
  const features = geojson.features || [];

  console.log(`   Total features di GeoJSON: ${features.length}`);

  // ── Ekstrak semua nama kecamatan + kabupaten induknya ──
  const entries = features.map((f) => ({
    kecamatan: (f.properties.KECAMATAN || f.properties.WADMKC || f.properties.NAMOBJ || "").trim(),
    kabupaten: (f.properties.Kabupaten || f.properties.WADMKK || "").trim(),
  }));

  // ── Deteksi nama duplikat (nama kecamatan yg sama di kabupaten berbeda) ──
  const nameCount = {};
  entries.forEach(({ kecamatan }) => {
    nameCount[kecamatan] = (nameCount[kecamatan] || 0) + 1;
  });
  const duplicateNames = new Set(
    Object.keys(nameCount).filter((n) => nameCount[n] > 1)
  );

  if (duplicateNames.size > 0) {
    console.log(`   ⚠️  Nama duplikat ditemukan: ${[...duplicateNames].join(", ")}`);
    console.log(`      → Akan disambiguasi dengan nama kabupaten`);
  }

  // ── Buat set nama unik, disambiguasi jika perlu ──
  const uniqueNames = new Set();
  const kecamatanList = [];

  entries.forEach(({ kecamatan, kabupaten }) => {
    if (!kecamatan) return;

    let finalName = toTitleCase(kecamatan);

    // Jika nama duplikat, tambahkan kabupaten untuk disambiguasi
    if (duplicateNames.has(kecamatan)) {
      finalName = `${toTitleCase(kecamatan)} (${toTitleCase(kabupaten)})`;
    }

    // Skip jika sudah ada (misal polygon split jadi 2 feature)
    if (uniqueNames.has(finalName)) return;
    uniqueNames.add(finalName);

    kecamatanList.push({
      nama_wilayah: finalName,
      level: "KECAMATAN",
      warna_area: DEFAULT_COLOR,
    });
  });

  console.log(`   Kecamatan unik siap di-seed: ${kecamatanList.length}`);

  // ── Cek data yang sudah ada di DB ──
  const existing = await prisma.wilayah.findMany({
    where: { level: "KECAMATAN" },
    select: { nama_wilayah: true },
  });
  const existingNames = new Set(existing.map((w) => w.nama_wilayah));

  // Filter hanya yang belum ada
  const toInsert = kecamatanList.filter(
    (k) => !existingNames.has(k.nama_wilayah)
  );

  if (toInsert.length === 0) {
    console.log("\n✅ Semua kecamatan sudah ada di database. Tidak ada yang perlu di-insert.");
    return;
  }

  console.log(`   Sudah ada di DB: ${existingNames.size}`);
  console.log(`   Akan di-insert:  ${toInsert.length}`);

  // ── Insert ke database ──
  console.log("\n🚀 Mulai insert ke database...");

  const result = await prisma.wilayah.createMany({
    data: toInsert,
    skipDuplicates: true,
  });

  console.log(`✅ Berhasil insert ${result.count} kecamatan ke tabel Wilayah!`);

  // ── Verifikasi ──
  const total = await prisma.wilayah.count();
  const totalKab = await prisma.wilayah.count({ where: { level: "KABUPATEN" } });
  const totalKec = await prisma.wilayah.count({ where: { level: "KECAMATAN" } });

  console.log(`\n📊 Ringkasan tabel Wilayah:`);
  console.log(`   Total    : ${total}`);
  console.log(`   Kabupaten: ${totalKab}`);
  console.log(`   Kecamatan: ${totalKec}`);
}

// =====================================================================
// 4. RUN
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
