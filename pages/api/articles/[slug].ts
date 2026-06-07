import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getUserFromRequest } from '../../../lib/auth'

function formatArticle(article: any, currentUserId: number | null) {
  const tags = article.tags?.map((relation: any) => relation.tag.name) || []
  const favorited = currentUserId ? article.favorites.some((fav: any) => fav.userId === currentUserId) : false

  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: tags,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favorited,
    favoritesCount: article.favorites.length,
    author: {
      username: article.author.username,
      bio: article.author.bio,
      image: article.author.image,
      following: false
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug as string
  const currentUser = await getUserFromRequest(req)
  const currentUserId = currentUser?.id ?? null

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: true, tags: { include: { tag: true } }, favorites: true }
  })

  if (!article) {
    return res.status(404).json({ error: 'Article not found' })
  }

  if (req.method === 'GET') {
    return res.status(200).json({ article: formatArticle(article, currentUserId) })
  }

  if (req.method === 'PUT') {
    if (!currentUser || currentUser.id !== article.authorId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const { article: body } = req.body as { article?: { title?: string; description?: string; body?: string } }
    const updated = await prisma.article.update({
      where: { slug },
      data: {
        title: body?.title ?? article.title,
        description: body?.description ?? article.description,
        body: body?.body ?? article.body
      },
      include: { author: true, tags: { include: { tag: true } }, favorites: true }
    })

    return res.status(200).json({ article: formatArticle(updated, currentUserId) })
  }

  if (req.method === 'DELETE') {
    if (!currentUser || currentUser.id !== article.authorId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    await prisma.article.delete({ where: { slug } })
    return res.status(204).end()
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  return res.status(405).json({ error: 'Method not allowed' })
}
