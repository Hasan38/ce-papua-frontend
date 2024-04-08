import { ofetch } from 'ofetch'

import { useUserSession } from '/@src/stores/userSession'

export function useLaravelFetch() {
  const userSession = useUserSession()

  return ofetch.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    // We set an interceptor for each request to
    // include Bearer token to the request if user is logged in
    onRequest: ({ options }) => {
      if (userSession.isLoggedIn) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${userSession.token}`,
        }
      }
    },
  })
}
