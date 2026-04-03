const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.appointment.updateMany({
    where: { videoRoomName: { not: null } },
    data: { videoRoomName: null, videoRoomUrl: null },
  });
  console.log("Cleared", result.count, "stale video rooms");
  await prisma.$disconnect();
}
main();
