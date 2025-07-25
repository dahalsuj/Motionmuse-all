import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users:", users);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
