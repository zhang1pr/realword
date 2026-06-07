import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromRequest } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await getUserFromRequest(req)
  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const username = req.query.username as string
  const targetUser = await prisma.user.findUnique({ where: { username } })
  if (!targetUser) {
    return res.status(404).json({ error: 'Profile not found' })
  }

  if (req.method === 'POST') {
    await prisma.follow.create({ data: { followerId: currentUser.id, followingId: targetUser.id } })
    return res.status(200).json({ profile: { username: targetUser.username, bio: targetUser.bio, image: targetUser.image, following: true } })
  }

  if (req.method === 'DELETE') {
    await prisma.follow.deleteMany({ where: { followerId: currentUser.id, followingId: targetUser.id } })
    return res.status(200).json({ profile: { username: targetUser.username, bio: targetUser.bio, image: targetUser.image, following: false } })
  }

  res.setHeader('Allow', ['POST', 'DELETE'])
  return res.status(405).json({ error: 'Method not allowed' })
}
