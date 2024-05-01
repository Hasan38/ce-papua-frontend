import { type AreaGroup } from './area_group'

export interface Info {
  id: number
  area_id: number
  type: number
  title: string
  link: string
  area_groups: AreaGroup
}

export interface InfoResponse {
  success: boolean
  data: {
    current_page: number
    data: Info[]
    total: number
  }
}
