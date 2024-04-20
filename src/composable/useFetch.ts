import { ofetch } from 'ofetch'

import { useUserSession } from '/@src/stores/userSession'

export function useFetch() {
  const userSession = useUserSession()

  return ofetch.create({
    baseURL: import.meta.env.VITE_API_BASE_URL_ERROR ?? 'http://localhost:8000',
    headers: {

    },
    mode: 'no-cors',
    // We set an interceptor for each request to
    // include Bearer token to the request if user is logged in
    onRequest: ({ options }) => {
      if (userSession.isLoggedIn) {
        options.headers = {
          ...options.headers,
        }
      }
    },
  })
}
