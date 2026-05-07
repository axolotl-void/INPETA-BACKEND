import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.wilayah.create({
    data: {
      nama_wilayah: "Bener Meriah",
      level: "KABUPATEN"
    }
  });
  console.log("Seeded Wilayah");
}
main().finally(() => prisma.$disconnect());
