import { BackupCode, TwoFactorAuth } from "@prisma/client"

export type NewTwoFactorAuth = Omit<TwoFactorAuth, 'id' | 'createdAt' | 'updatedAt'>

export interface CreateTwoFactorResponse {
    success: boolean,
    qrCode: string,
    backupCodes: string[]
}