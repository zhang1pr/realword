import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../lib/prisma'
import { getUserFromRequest } from '../../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const currentUser = await getUserFromRequest(req)
  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const id = Number(req.query.id)
  const comment = await prisma.comment.findUnique({ where: { id }, include: { article: true } })
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' })
  }
  if (comment.authorId !== currentUser.id) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  await prisma.comment.delete({ where: { id } })
  return res.status(204).end()
}
