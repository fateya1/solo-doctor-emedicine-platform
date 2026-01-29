/*
  Warnings:

  - You are about to drop the column `createdAt` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `DoctorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PatientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PatientProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DoctorProfile" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "PatientProfile" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
