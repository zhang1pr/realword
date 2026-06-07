export async function apiFetch(path: string, opts: any = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  try {
    // attach token when running in the browser
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('realworld:token')
      if (token) headers.Authorization = `Token ${token}`
    }
  } catch (e) {
    // ignore
  }

  const res = await fetch(path, {
    headers,
    ...opts
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw { status: res.status, data }
  return data
}
