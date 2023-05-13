import { BackupCode } from "@prisma/client"

export type NewBackupCode = Omit<BackupCode, 'id' | 'createdAt' | 'updatedAt'>