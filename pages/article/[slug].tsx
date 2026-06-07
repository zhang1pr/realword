import Header from '../../components/Header'
import { useRouter } from 'next/router'

export default function ArticlePage() {
  const router = useRouter()
  const { slug } = router.query

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-semibold">{slug || 'Article'}</h1>
        <p className="mt-2 text-slate-600">Article details and comments will render here.</p>
      </main>
    </div>
  )
}
