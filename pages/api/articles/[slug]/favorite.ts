import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { getUserFromRequest } from '../../../../lib/auth'

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
  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: true, tags: { include: { tag: true } }, favorites: true }
  })

  if (!article) {
    return res.status(404).json({ error: 'Article not found' })
  }

  if (req.method === 'POST') {
    await prisma.favorite.create({ data: { articleId: article.id, userId: currentUser.id } })
  } else if (req.method === 'DELETE') {
    await prisma.favorite.deleteMany({ where: { articleId: article.id, userId: currentUser.id } })
  } else {
    res.setHeader('Allow', ['POST', 'DELETE'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const updated = await prisma.article.findUnique({
    where: { slug },
    include: { author: true, tags: { include: { tag: true } }, favorites: true }
  })

  return res.status(200).json({ article: formatArticle(updated, currentUser.id) })
}
