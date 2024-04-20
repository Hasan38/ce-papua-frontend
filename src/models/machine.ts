import { type AreaGroup } from './area_group'
import { type Customer } from './customer'

export interface Machine {
  id: number
  customer_id: number
  customer_type: string
  area_id: number
  branch: string
  terminal_id: string
  sn: string
  machine_type: string
  address: string
  zona: number
  service_status: string
  pengelola: string
  lat: string
  long: string
  created_at: string
  area_groups: AreaGroup
  customers: Customer
}
