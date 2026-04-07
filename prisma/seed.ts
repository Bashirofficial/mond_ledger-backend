// prisma/seed.ts
import { PrismaClient } from "../src/generated/client/client.js";
import { Role, TransactionType } from "../src/generated/client/enums.js";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  console.log("🌱 Seeding...");

  // 1. Categories
  const salaryCat = await prisma.category.upsert({
    where: { name: "Salary" },
    update: {},
    create: { name: "Salary", description: "Income" },
  });

  const foodCat = await prisma.category.upsert({
    where: { name: "Food" },
    update: {},
    create: { name: "Food", description: "Expenses" },
  });

  // 2. Users
  const password = await bcrypt.hash("Password@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      firstName: "Admin",
      lastName: "User",
      password,
      role: Role.ADMIN,
    },
  });

  // 3. Transactions
  await prisma.transaction.create({
    data: {
      amount: 50000,
      type: TransactionType.INCOME,
      categoryId: salaryCat.id,
      userId: admin.id,
      date: new Date(),
      description: "Initial Salary",
    },
  });

  await prisma.transaction.create({
    data: {
      amount: 1500,
      type: TransactionType.EXPENSE,
      categoryId: foodCat.id,
      userId: admin.id,
      date: new Date(),
      description: "Groceries",
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
