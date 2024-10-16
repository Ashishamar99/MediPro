/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Appointment` table. All the data in the column will be lost.
  - The primary key for the `Slot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Slot` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Slot` table. All the data in the column will be lost.
  - The `id` column on the `Slot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[availabilityId,startTime]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availabilityId` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_doctorId_idx";

-- DropIndex
DROP INDEX "Slot_doctorId_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "doctorId",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_pkey",
DROP COLUMN "date",
DROP COLUMN "doctorId",
DROP COLUMN "status",
ADD COLUMN     "availabilityId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Slot_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Availability" (
    "id" SERIAL NOT NULL,
    "doctorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DoctorToSlot" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AvailabilityToSlot" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Availability_doctorId_date_key" ON "Availability"("doctorId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "_DoctorToSlot_AB_unique" ON "_DoctorToSlot"("A", "B");

-- CreateIndex
CREATE INDEX "_DoctorToSlot_B_index" ON "_DoctorToSlot"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AvailabilityToSlot_AB_unique" ON "_AvailabilityToSlot"("A", "B");

-- CreateIndex
CREATE INDEX "_AvailabilityToSlot_B_index" ON "_AvailabilityToSlot"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Slot_availabilityId_startTime_key" ON "Slot"("availabilityId", "startTime");
