import { Slot } from "@prisma/client";

export interface DoctorData {
  id: string;
  name: string;
  imageUrl: string;
  phone: string;
  signatureUrl: string;
  role: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  password: string;
}

export type CustomSlot = Omit<Slot, "id">;
