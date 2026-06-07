import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'
import { signToken } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { user } = req.body as { user?: { email?: string; password?: string } }
  if (!user?.email || !user.password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const existing = await prisma.user.findUnique({ where: { email: user.email } })
  if (!existing || !(await bcrypt.compare(user.password, existing.password))) {
    return res.status(400).json({ error: 'Invalid credentials' })
  }

  return res.status(200).json({
    user: {
      email: existing.email,
      token: signToken({ id: existing.id, email: existing.email, username: existing.username }),
      username: existing.username,
      bio: existing.bio,
      image: existing.image
    }
  })
}
