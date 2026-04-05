-- CreateTable
CREATE TABLE "availability_templates" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_template_slots" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startHour" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL DEFAULT 0,
    "endHour" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL DEFAULT 0,
    "slotMinutes" INTEGER NOT NULL DEFAULT 60,
    "breakMinutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "availability_template_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "availability_templates_doctorId_idx" ON "availability_templates"("doctorId");

-- CreateIndex
CREATE INDEX "availability_template_slots_templateId_idx" ON "availability_template_slots"("templateId");

-- AddForeignKey
ALTER TABLE "availability_templates" ADD CONSTRAINT "availability_templates_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability_template_slots" ADD CONSTRAINT "availability_template_slots_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "availability_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
