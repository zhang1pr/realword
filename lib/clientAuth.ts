export function saveToken(token: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('realworld:token', token)
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('realworld:token')
}

export function clearToken() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem('realworld:token')
}
