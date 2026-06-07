# How it works

This repository is a single-repo RealWorld implementation built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

- Frontend: Next.js pages with route structure for Home, Login, Register, Settings, Editor, Article, Profile, and Tags.
- Backend: Next.js API routes under `pages/api` implementing RealWorld endpoints for auth, users, profiles, articles, comments, favorites, and tags.
- Database: PostgreSQL with Prisma ORM and intended support for full RealWorld data models.

# Getting started

1. Copy `.env.example` to `.env` and configure `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Run database migration once your Postgres database is available:

```bash
npx prisma migrate dev --name init
```

5. Start the app locally:

```bash
npm run dev
```

# Testing

Run the unit test suite with:

```bash
npm test
```

