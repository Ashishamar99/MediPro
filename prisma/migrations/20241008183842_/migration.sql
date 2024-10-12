/*
  Warnings:

  - You are about to drop the column `doctor_id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `doctor_id` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `Slot` table. All the data in the column will be lost.
  - Added the required column `doctorId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctorId` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotNumber` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_doctor_id_idx";

-- DropIndex
DROP INDEX "Appointment_patient_id_idx";

-- DropIndex
DROP INDEX "Slot_doctor_id_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "doctor_id",
DROP COLUMN "end_time",
DROP COLUMN "patient_id",
DROP COLUMN "reason",
DROP COLUMN "start_time",
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "slotId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "isAvailable",
ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "signatureUrl" DROP NOT NULL,
ALTER COLUMN "signatureFilename" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "doctor_id",
DROP COLUMN "end_time",
DROP COLUMN "start_time",
ADD COLUMN     "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "slotNumber" INTEGER NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "prescriptionUrl" TEXT NOT NULL,
    "prescriptionFilename" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Consultation_doctorId_idx" ON "Consultation"("doctorId");

-- CreateIndex
CREATE INDEX "Consultation_patientId_idx" ON "Consultation"("patientId");

-- CreateIndex
CREATE INDEX "Consultation_appointmentId_idx" ON "Consultation"("appointmentId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "Appointment"("doctorId");

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_slotId_idx" ON "Appointment"("slotId");

-- CreateIndex
CREATE INDEX "Slot_doctorId_idx" ON "Slot"("doctorId");
