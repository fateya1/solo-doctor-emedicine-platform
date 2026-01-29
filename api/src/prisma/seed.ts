@'
import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.SEED_PASSWORD ?? "Password123!",
    10
  );

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      fullName: "System Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log("✅ Seeded admin user");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
'@ | Set-Content -Encoding UTF8 prisma\seed.ts
