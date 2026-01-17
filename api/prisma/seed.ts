import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create 3 users (doctor/patient/admin) if they don't exist
  const password = 'TestPassword123!'; // change if you want
  const passwordHash = await bcrypt.hash(password, 10);

  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@test.com' },
    update: {},
    create: {
      email: 'doctor@test.com',
      fullName: 'Test Doctor',
      passwordHash,
      role: UserRole.doctor,
      doctorProfile: {
        create: { specialty: 'General Medicine', bio: 'Seeded doctor profile' },
      },
    },
  });

  const patient = await prisma.user.upsert({
    where: { email: 'patient@test.com' },
    update: {},
    create: {
      email: 'patient@test.com',
      fullName: 'Test Patient',
      passwordHash,
      role: UserRole.patient,
      patientProfile: {
        create: { age: 25, gender: 'Female', allergies: 'None' },
      },
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      fullName: 'Test Admin',
      passwordHash,
      role: UserRole.admin,
    },
  });

  console.log('Seeded users:', {
    doctor: doctor.email,
    patient: patient.email,
    admin: admin.email,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
