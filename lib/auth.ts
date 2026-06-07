import jwt from 'jsonwebtoken'
import type { NextApiRequest } from 'next'
import { prisma } from './prisma'

const secret = process.env.JWT_SECRET || 'change-this-secret'
const expiresIn = '7d'

export interface UserJwtPayload {
  id: number
  email: string
  username: string
}

export function signToken(payload: UserJwtPayload) {
  return jwt.sign(payload, secret, { expiresIn })
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret) as UserJwtPayload
}

export function getTokenFromRequest(req: NextApiRequest) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Token ')) return null
  return auth.slice(6)
}

export async function getUserFromRequest(req: NextApiRequest) {
  const token = getTokenFromRequest(req)
  if (!token) return null

  try {
    const payload = verifyToken(token)
    return await prisma.user.findUnique({ where: { id: payload.id } })
  } catch {
    return null
  }
}
