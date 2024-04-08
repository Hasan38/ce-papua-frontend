import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { type AreaGroup } from '/@src/models/area_group'

interface Response {
  data: AreaGroup[]
}

export const useAreaGroup = async () => {
  const $fetch = useLaravelFetch()

  const data = await $fetch<Response>(`/api/area-group-list`)
  return data.data.map(function (item) {
    return {
      value: item.id,
      label: item.name,
    }
  })
}
