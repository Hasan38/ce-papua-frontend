import { type AreaGroup } from './area_group'
import { type Customer } from './customer'
import { type Note } from './note'

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
  notes_count: number
  notes: Note[]
}

export interface MachineResponse {
  success: boolean
  data: {
    current_page: number
    data: Machine[]
    total: number
    next_page_url: string
  }
}
