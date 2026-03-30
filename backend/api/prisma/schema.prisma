generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────────────────────────────────

enum UserRole {
  ADMIN
  DOCTOR
  PATIENT
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

// ─── Tenant ──────────────────────────────────────────────────────────────────

model Tenant {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users User[]

  @@map("tenants")
}

// ─── User ─────────────────────────────────────────────────────────────────────

model User {
  id           String   @id @default(uuid())
  tenantId     String
  email        String
  passwordHash String
  fullName     String
  role         UserRole @default(PATIENT)
  isActive     Boolean  @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  tenant         Tenant          @relation(fields: [tenantId], references: [id])
  doctorProfile  DoctorProfile?
  patientProfile PatientProfile?

  @@unique([tenantId, email])
  @@index([tenantId])
  @@map("users")
}

// ─── Doctor Profile ───────────────────────────────────────────────────────────

model DoctorProfile {
  id                String   @id @default(uuid())
  userId            String   @unique
  specialty         String?
  bio               String?
  licenseNumber     String?
  yearsOfExperience Int?
  consultationFee   Decimal? @db.Decimal(10, 2)
  isVerified        Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user              User               @relation(fields: [userId], references: [id])
  availabilitySlots AvailabilitySlot[]

  @@map("doctor_profiles")
}

// ─── Patient Profile ──────────────────────────────────────────────────────────

model PatientProfile {
  id          String    @id @default(uuid())
  userId      String    @unique
  dateOfBirth DateTime?
  gender      Gender?
  phone       String?
  address     String?
  bloodGroup  String?
  allergies   String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user         User          @relation(fields: [userId], references: [id])
  appointments Appointment[]

  @@map("patient_profiles")
}

// ─── Availability Slot ────────────────────────────────────────────────────────

model AvailabilitySlot {
  id          String   @id @default(uuid())
  doctorId    String
  startTime   DateTime
  endTime     DateTime
  isAvailable Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  doctor      DoctorProfile @relation(fields: [doctorId], references: [id])
  appointment Appointment?

  @@index([doctorId])
  @@index([startTime])
  @@map("availability_slots")
}

// ─── Appointment ──────────────────────────────────────────────────────────────

model Appointment {
  id         String            @id @default(uuid())
  patientId  String
  slotId     String            @unique
  status     AppointmentStatus @default(PENDING)
  reason     String?
  notes      String?
  cancelledAt DateTime?
  cancelReason String?
  createdAt  DateTime          @default(now())
  updatedAt  DateTime          @updatedAt

  patient          PatientProfile   @relation(fields: [patientId], references: [id])
  availabilitySlot AvailabilitySlot @relation(fields: [slotId], references: [id])

  @@index([patientId])
  @@index([slotId])
  @@map("appointments")
}