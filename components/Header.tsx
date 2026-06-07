import Link from 'next/link'

export default function Header() {
  // client-only token check
  const hasWindow = typeof window !== 'undefined'
  const token = hasWindow ? window.localStorage.getItem('realworld:token') : null

  function handleLogout() {
    if (!hasWindow) return
    window.localStorage.removeItem('realworld:token')
    window.location.href = '/'
  }

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-slate-900">
          RealWorld
        </Link>
        <nav className="flex gap-4 text-slate-600">
          {!token && (
            <>
              <Link href="/login" className="hover:text-slate-900">
                Sign in
              </Link>
              <Link href="/register" className="hover:text-slate-900">
                Sign up
              </Link>
            </>
          )}
          <Link href="/editor" className="hover:text-slate-900">
            New Article
          </Link>
          {token && (
            <button onClick={handleLogout} className="text-rose-600 hover:underline">
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
