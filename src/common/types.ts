export interface DoctorData {
    id: string;
    name: string;
    imageUrl: string;
    phone: string;
    signatureUrl: string;
    signatureFilename: string;
    role: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
    password: string;
}