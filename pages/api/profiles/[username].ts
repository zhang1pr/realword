import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromRequest } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const username = req.query.username as string
  const profile = await prisma.user.findUnique({ where: { username } })
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' })
  }

  const currentUser = await getUserFromRequest(req)
  const following = currentUser
    ? await prisma.follow.findUnique({ where: { followerId_followingId: { followerId: currentUser.id, followingId: profile.id } } })
    : null

  return res.status(200).json({
    profile: {
      username: profile.username,
      bio: profile.bio,
      image: profile.image,
      following: Boolean(following)
    }
  })
}
