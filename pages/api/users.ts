import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma'
import { signToken } from '../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { user } = req.body as { user?: { username?: string; email?: string; password?: string } }
  if (!user?.username || !user.email || !user.password) {
    return res.status(400).json({ error: 'username, email, and password are required' })
  }

  const hashedPassword = await bcrypt.hash(user.password, 10)
  const created = await prisma.user.create({
    data: {
      username: user.username,
      email: user.email,
      password: hashedPassword
    }
  })

  return res.status(201).json({
    user: {
      email: created.email,
      token: signToken({ id: created.id, email: created.email, username: created.username }),
      username: created.username,
      bio: created.bio,
      image: created.image
    }
  })
}
