/*
  Warnings:

  - You are about to drop the column `audio` on the `Consultation` table. All the data in the column will be lost.
  - You are about to drop the column `prescriptionFilename` on the `Consultation` table. All the data in the column will be lost.
  - Added the required column `doctorId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prescriptionContent` to the `Consultation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "doctorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Consultation" DROP COLUMN "audio",
DROP COLUMN "prescriptionFilename",
ADD COLUMN     "prescriptionContent" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "Appointment"("doctorId");
