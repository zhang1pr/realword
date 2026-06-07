import Header from '../components/Header'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-xl p-8">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-2 text-slate-600">Update your profile settings and preferences.</p>
        <AuthGuard />
        <div className="mt-8 space-y-4 rounded border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-700">Settings routes are ready for implementation.</p>
        </div>
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
