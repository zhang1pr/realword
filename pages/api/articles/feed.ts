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
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const currentUser = await getUserFromRequest(req)
  if (!currentUser) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const limit = Number(req.query.limit ?? 20)
  const offset = Number(req.query.offset ?? 0)
  const followings = await prisma.follow.findMany({
    where: { followerId: currentUser.id },
    select: { followingId: true }
  })

  const articles = await prisma.article.findMany({
    where: { authorId: { in: followings.map((item) => item.followingId) } },
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
    include: { author: true, tags: { include: { tag: true } }, favorites: true }
  })

  const articlesCount = await prisma.article.count({ where: { authorId: { in: followings.map((item) => item.followingId) } } })
  return res.status(200).json({ articles: articles.map((article) => formatArticle(article, currentUser.id)), articlesCount })
}
