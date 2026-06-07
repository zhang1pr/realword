import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromRequest } from '../../lib/auth'
import { prisma } from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  if (req.method === 'GET') {
    return res.status(200).json({ user: { email: user.email, token: '', username: user.username, bio: user.bio, image: user.image } })
  }

  if (req.method === 'PUT') {
    const data = req.body.user as { email?: string; username?: string; bio?: string; image?: string; password?: string }
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: data.email ?? user.email,
        username: data.username ?? user.username,
        bio: data.bio ?? user.bio,
        image: data.image ?? user.image
      }
    })

    return res.status(200).json({ user: { email: updated.email, token: '', username: updated.username, bio: updated.bio, image: updated.image } })
  }

  res.setHeader('Allow', ['GET', 'PUT'])
  return res.status(405).json({ error: 'Method not allowed' })
}
