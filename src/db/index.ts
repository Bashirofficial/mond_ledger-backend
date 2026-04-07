import "dotenv/config";
import { PrismaClient } from "../generated/client/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  await prisma.$connect();
  console.log("✅ Database connected");
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log("🛑 Database disconnected");
};

export default prisma;
