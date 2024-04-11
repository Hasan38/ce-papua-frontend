import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { type Customer } from '/@src/models/customer'

interface Response {
  data: Customer[]
}

export const useCustomer = async () => {
  const $fetch = useLaravelFetch()

  const data = await $fetch<Response>(`/api/customer-list`)
  return data.data.map(function (item) {
    return {
      value: item.id,
      label: item.name,
    }
  })
}
