import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.SEED_PASSWORD ?? "Admin@123!",
    12,
  );

  const tenant = await prisma.tenant.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      name: "Solo Doctor Clinic",
      slug: "default",
      isActive: true,
    },
  });

  console.log("Tenant seeded:", tenant.slug);

  const admin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: "admin@clinic.com" } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "admin@clinic.com",
      passwordHash,
      fullName: "System Administrator",
      role: UserRole.ADMIN,
    },
  });

  console.log("Admin seeded:", admin.email);
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });