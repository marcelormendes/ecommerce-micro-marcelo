import { User, UserDetails } from "@prisma/client"

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>

export type NewUserDetails = Omit<UserDetails, 'id' | 'createdAt' | 'updatedAt'>

export interface UserLogin {
    email: string;
    password: string;
    token: string;
}