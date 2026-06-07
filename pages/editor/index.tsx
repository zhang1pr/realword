import Header from '../../components/Header'

export default function EditorPage() {
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <Header />
      <main className='mx-auto max-w-3xl p-8'>
        <h1 className='text-3xl font-semibold'>New Article</h1>
        <p className='mt-2 text-slate-600'>Write a headline, article body, and tags.</p>
        <AuthGuard />
        <form className='mt-8 space-y-4'>
          <input className='w-full rounded border border-slate-300 px-4 py-3' placeholder='Article title' />
          <input className='w-full rounded border border-slate-300 px-4 py-3' placeholder="What's this article about?" />
          <textarea className='w-full rounded border border-slate-300 px-4 py-3' rows={10} placeholder='Write your article (in markdown)'></textarea>
          <input className='w-full rounded border border-slate-300 px-4 py-3' placeholder='Enter tags' />
          <button className='rounded bg-slate-900 px-4 py-3 text-white hover:bg-slate-800'>Publish Article</button>
        </form>
      </main>
    </div>
  )
}

function AuthGuard() {
  if (typeof window === 'undefined') return null
  const token = window.localStorage.getItem('realworld:token')
  if (!token) {
    if (typeof window !== 'undefined') window.location.href = '/login'
    return null
  }
  return null
}
