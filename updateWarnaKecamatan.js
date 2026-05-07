import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Fungsi untuk meng-generate warna HEX acak yang cerah/pastel.
 * Menggunakan format HSL untuk memastikan warna tidak terlalu gelap 
 * agar teks/label pada peta tetap mudah dibaca.
 */
function generateRandomColor() {
  // Hue antara 0-360 derajat
  const hue = Math.floor(Math.random() * 360);
  // Saturation antara 60-100% (agar warna cukup keluar/vivid)
  const saturation = Math.floor(Math.random() * 40) + 60;
  // Lightness antara 50-80% (hindari warna hitam/terlalu gelap)
  const lightness = Math.floor(Math.random() * 30) + 50;

  return hslToHex(hue, saturation, lightness);
}

/**
 * Helper untuk konversi HSL ke HEX
 */
function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0'); // Konversi ke Hex
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

async function main() {
  console.log('🚀 Memulai proses generate warna acak untuk Kecamatan...');

  try {
    // 1. Ambil semua data kecamatan
    const kecamatanList = await prisma.wilayah.findMany({
      where: {
        level: 'KECAMATAN'
      },
      select: {
        id: true,
        nama_wilayah: true
      }
    });

    if (kecamatanList.length === 0) {
      console.log('⚠️ Tidak ada data dengan level KECAMATAN yang ditemukan.');
      return;
    }

    console.log(`📊 Ditemukan ${kecamatanList.length} data Kecamatan. Memulai update...\n`);

    let successCount = 0;
    let failedCount = 0;

    // 2. Loop menggunakan for...of agar proses update antri dan tidak membebani koneksi DB (Too Many Connections)
    for (const [index, kecamatan] of kecamatanList.entries()) {
      try {
        const randomHex = generateRandomColor();
        
        await prisma.wilayah.update({
          where: { id: kecamatan.id },
          data: { warna_area: randomHex }
        });
        
        successCount++;
        
        // Log individual tiap kecamatan bisa spam terminal, kita log tiap kelipatan 50 atau di awal/akhir saja
        if (successCount % 50 === 0 || successCount === kecamatanList.length) {
            console.log(`✅ Progress: ${successCount} dari ${kecamatanList.length} kecamatan berhasil di-update.`);
        }
      } catch (error) {
        console.error(`❌ Gagal update Kecamatan ${kecamatan.nama_wilayah} (ID: ${kecamatan.id}):`, error.message);
        failedCount++;
      }
    }

    console.log('\n🎉 --- PROSES SELESAI ---');
    console.log(`✅ Total Berhasil : ${successCount}`);
    console.log(`❌ Total Gagal    : ${failedCount}`);

  } catch (error) {
    console.error('💥 Terjadi kesalahan fatal saat query database:', error);
  } finally {
    // Pastikan koneksi ke database ditutup
    await prisma.$disconnect();
    await pool.end();
    console.log('🔌 Koneksi database diputus.');
  }
}

// Jalankan skrip
main();
