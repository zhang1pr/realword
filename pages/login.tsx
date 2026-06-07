import React from 'react'
import Header from '../components/Header'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { apiFetch } from '../lib/apiClient'
import { saveToken } from '../lib/clientAuth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const data = await apiFetch('/api/users/login', { method: 'POST', body: JSON.stringify({ user: { email, password } }) })
      saveToken(data.user.token)
      router.push('/')
    } catch (err: any) {
      setError(err?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-md p-8">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-slate-600">Use your email and password to sign in.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <div className="rounded bg-rose-100 p-3 text-rose-700">{error}</div>}
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border border-slate-300 px-4 py-3" placeholder="Email" type="email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border border-slate-300 px-4 py-3" placeholder="Password" type="password" />
          <button type="submit" className="w-full rounded bg-slate-900 px-4 py-3 text-white hover:bg-slate-800">Sign in</button>
        </form>
      </main>
    </div>
  )
}
