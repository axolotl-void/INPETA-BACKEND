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
    const w = await prisma.wilayah.findMany({ orderBy: { id: "asc" } });
    console.log("Success:", w.length);
  } catch (e) {
    console.error("Error:", e);
  }
  await prisma.$disconnect();
}
main();
