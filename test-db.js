const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Testing database connection...");

    // Test connection by creating a test message
    const testMessage = await prisma.message.create({
      data: {
        alias: "TestUser",
        message: "Hello, database connection test!",
      },
    });

    console.log("✅ Database connection successful!");
    console.log("Created test message:", testMessage);

    // Retrieve all messages
    const messages = await prisma.message.findMany();
    console.log("All messages:", messages);

    // // Clean up test message
    // await prisma.message.delete({
    //   where: { id: testMessage.id }
    // })

    console.log("✅ Test message cleaned up");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

