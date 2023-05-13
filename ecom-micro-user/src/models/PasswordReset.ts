import { PasswordReset } from "@prisma/client"

export type NewPasswordReset = Omit<PasswordReset, 'id' | 'createdAt' | 'updatedAt'>

export interface UpdatePassword {
    token: string,
    newPassword: string
}