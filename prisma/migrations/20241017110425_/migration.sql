/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,appointmentId]` on the table `Consultation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Consultation_doctorId_appointmentId_key" ON "Consultation"("doctorId", "appointmentId");
