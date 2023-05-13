import { UserJWT } from '@interfaces'

declare global {
  namespace Express {
    interface Request {
      user: UserJWT
    }
  }
}