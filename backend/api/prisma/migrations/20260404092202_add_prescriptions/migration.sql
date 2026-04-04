-- CreateTable
CREATE TABLE "prescriptions" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "doctorProfileId" TEXT NOT NULL,
    "patientProfileId" TEXT NOT NULL,
    "medications" JSONB NOT NULL,
    "diagnosis" TEXT,
    "notes" TEXT,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_appointmentId_key" ON "prescriptions"("appointmentId");

-- CreateIndex
CREATE INDEX "prescriptions_doctorProfileId_idx" ON "prescriptions"("doctorProfileId");

-- CreateIndex
CREATE INDEX "prescriptions_patientProfileId_idx" ON "prescriptions"("patientProfileId");

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorProfileId_fkey" FOREIGN KEY ("doctorProfileId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientProfileId_fkey" FOREIGN KEY ("patientProfileId") REFERENCES "patient_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
