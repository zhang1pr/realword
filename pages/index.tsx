import Link from 'next/link'
import Header from '../components/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-4xl font-semibold">RealWorld Starter Kit</h1>
        <p className="mt-4 text-lg text-slate-700">
          Single-repo Next.js app with Postgres, Prisma, JWT auth, and API routes.
        </p>
        <div className="mt-6 space-x-4">
          <Link className="text-blue-600 hover:underline" href="/login">
            Login
          </Link>
          <Link className="text-blue-600 hover:underline" href="/register">
            Register
          </Link>
          <Link className="text-blue-600 hover:underline" href="/editor">
            Editor
          </Link>
        </div>
      </main>
    </div>
  )
}
