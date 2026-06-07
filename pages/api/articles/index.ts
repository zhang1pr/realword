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
  if (req.method === 'GET') {
    const currentUser = await getUserFromRequest(req)
    const currentUserId = currentUser?.id ?? null
    const limit = Number(req.query.limit ?? 20)
    const offset = Number(req.query.offset ?? 0)
    const tag = req.query.tag as string | undefined
    const author = req.query.author as string | undefined
    const favorited = req.query.favorited as string | undefined

    const where: any = {}
    if (tag) {
      where.tags = { some: { tag: { name: tag } } }
    }
    if (author) {
      const authorUser = await prisma.user.findUnique({ where: { username: author } })
      where.authorId = authorUser ? authorUser.id : -1
    }
    if (favorited) {
      const favoritedUser = await prisma.user.findUnique({ where: { username: favorited } })
      where.favorites = favoritedUser ? { some: { userId: favoritedUser.id } } : { some: { userId: -1 } }
    }

    const articles = await prisma.article.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: { author: true, tags: { include: { tag: true } }, favorites: true }
    })
    const articlesCount = await prisma.article.count({ where })
    return res.status(200).json({ articles: articles.map((article) => formatArticle(article, currentUserId)), articlesCount })
  }

  if (req.method === 'POST') {
    const currentUser = await getUserFromRequest(req)
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const { article } = req.body as { article?: { title: string; description: string; body: string; tagList?: string[] } }
    if (!article?.title || !article.description || !article.body) {
      return res.status(400).json({ error: 'title, description and body are required' })
    }

    const created = await prisma.article.create({
      data: {
        title: article.title,
        description: article.description,
        body: article.body,
        slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now()}`,
        authorId: currentUser.id,
        tags: {
          create: (article.tagList || []).map((name) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name }
              }
            }
          }))
        }
      },
      include: { author: true, tags: { include: { tag: true } }, favorites: true }
    })

    return res.status(201).json({ article: formatArticle(created, currentUser.id) })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).json({ error: 'Method not allowed' })
}
