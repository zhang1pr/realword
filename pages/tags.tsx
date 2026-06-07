import Header from '../components/Header'

export default function TagsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-semibold">Popular tags</h1>
        <p className="mt-2 text-slate-600">Tag browsing and filtering will be implemented here.</p>
      </main>
    </div>
  )
}
