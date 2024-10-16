/*
  Warnings:

  - You are about to drop the `_DoctorToSlot` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `slotId` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `doctorId` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "slotId",
ADD COLUMN     "slotId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "doctorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_DoctorToSlot";

-- CreateIndex
CREATE INDEX "Appointment_slotId_idx" ON "Appointment"("slotId");

-- CreateIndex
CREATE INDEX "Slot_doctorId_idx" ON "Slot"("doctorId");
