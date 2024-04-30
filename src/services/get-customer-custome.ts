import { useLaravelFetch } from '/@src/composable/useLaravelFetch'
import { type Customer } from '/@src/models/customer'

interface Response {
  data: Customer[]
}

export const useCustomer = async () => {
  const $fetch = useLaravelFetch()
  const all = [
    { value: 0, label: 'None' },

  ]
  const data = await $fetch<Response>(`/api/customer-list`)
  const dt = data.data.map(function (item) {
    return {
      value: item.id,
      label: item.name,
    }
  })
  return [...all, ...dt]
}
