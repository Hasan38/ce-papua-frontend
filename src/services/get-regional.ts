import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { type Regional } from '/@src/models/regional'

interface Response {
  data: Regional[]
}

export const useRegional = async () => {
  const $fetch = useLaravelFetch()

  const data = await $fetch<Response>(`/api/regional-list`)
  return data.data.map(function (item) {
    return {
      value: item.id,
      label: item.name,
    }
  })
}
