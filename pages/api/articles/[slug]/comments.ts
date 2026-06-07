import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { getUserFromRequest } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug as string

  if (req.method === 'GET') {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { comments: { include: { author: true } } }
    })
    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    return res.status(200).json({
      comments: article.comments.map((comment) => ({
        id: comment.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        body: comment.body,
        author: { username: comment.author.username, bio: comment.author.bio, image: comment.author.image, following: false }
      }))
    })
  }

  if (req.method === 'POST') {
    const currentUser = await getUserFromRequest(req)
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const body = req.body.comment as { body?: string }
    if (!body?.body) {
      return res.status(400).json({ error: 'Comment body is required' })
    }

    const comment = await prisma.comment.create({
      data: {
        body: body.body,
        article: { connect: { slug } },
        author: { connect: { id: currentUser.id } }
      },
      include: { author: true }
    })

    return res.status(201).json({
      comment: {
        id: comment.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        body: comment.body,
        author: { username: comment.author.username, bio: comment.author.bio, image: comment.author.image, following: false }
      }
    })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: 'Method not allowed' })
}
