import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // Nonaktifkan hero content yang lama
    await prisma.heroContent.updateMany({ data: { is_active: false } });
    
    // Tambahkan hero content baru
    const hero = await prisma.heroContent.create({
      data: {
        main_title: "Modernisasi Informasi Peternakan Aceh",
        description: "Platform digital terintegrasi untuk mengakses data statistik, peta sebaran, dan informasi fasilitas peternakan di seluruh Provinsi Aceh.",
        is_active: true,
      },
    });
    
    console.log("✅ Hero Content berhasil ditambahkan:", hero);
  } catch (e) {
    console.error("❌ Error:", e.message);
  }
  await prisma.$disconnect();
}

main();
