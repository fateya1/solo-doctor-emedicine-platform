/*
  Warnings:

  - You are about to drop the `waitlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'INTAKE_FORM_SUBMITTED';
ALTER TYPE "AuditAction" ADD VALUE 'INTAKE_FORM_UPDATED';

-- DropForeignKey
ALTER TABLE "waitlist" DROP CONSTRAINT "waitlist_doctorProfileId_fkey";

-- DropForeignKey
ALTER TABLE "waitlist" DROP CONSTRAINT "waitlist_patientId_fkey";

-- DropTable
DROP TABLE "waitlist";

-- DropEnum
DROP TYPE "WaitlistStatus";

-- CreateTable
CREATE TABLE "intake_forms" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "symptoms" TEXT[],
    "symptomNotes" TEXT,
    "symptomDuration" TEXT,
    "allergies" TEXT[],
    "allergyNotes" TEXT,
    "medications" JSONB NOT NULL DEFAULT '[]',
    "bloodPressure" TEXT,
    "weight" TEXT,
    "additionalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intake_forms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "intake_forms_appointmentId_key" ON "intake_forms"("appointmentId");

-- CreateIndex
CREATE INDEX "intake_forms_patientId_idx" ON "intake_forms"("patientId");

-- AddForeignKey
ALTER TABLE "intake_forms" ADD CONSTRAINT "intake_forms_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intake_forms" ADD CONSTRAINT "intake_forms_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
