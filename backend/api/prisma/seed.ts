import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash(process.env.SEED_PASSWORD ?? "Admin@123!", 12);
  const tenant = await prisma.tenant.upsert({
    where: { slug: "default" },
    update: { name: "Solo Doctor Clinic", isActive: true },
    create: { name: "Solo Doctor Clinic", slug: "default", isActive: true },
  });
  console.log("Tenant ready:", tenant.slug, "| ID:", tenant.id);
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: "admin@clinic.com" } },
    update: {},
    create: { tenantId: tenant.id, email: "admin@clinic.com", passwordHash, fullName: "System Administrator", role: UserRole.ADMIN },
  });
  console.log("Admin ready");
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: "doctor@clinic.com" } },
    update: {},
    create: {
      tenantId: tenant.id, email: "doctor@clinic.com", passwordHash, fullName: "Dr. Jane Smith", role: UserRole.DOCTOR,
      doctorProfile: { create: { specialty: "General Practice", bio: "Experienced GP", licenseNumber: "GP-001", yearsOfExperience: 10, consultationFee: 50, isVerified: true } },
    },
  });
  console.log("Doctor ready");
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: "patient@clinic.com" } },
    update: {},
    create: { tenantId: tenant.id, email: "patient@clinic.com", passwordHash, fullName: "John Patient", role: UserRole.PATIENT, patientProfile: { create: {} } },
  });
  console.log("Patient ready");
  console.log("\nDone! Password: Admin@123! | DEFAULT_TENANT_ID=" + tenant.id);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });