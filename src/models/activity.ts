import { type AreaGroup } from './area_group'

export interface Activity {
  id: number
  area_id: number
  title: string
  start_date: string
  end_date: string
  remarks: string
  area_groups: AreaGroup
}

export interface ActivityResponse {
  success: boolean
  data: {
    current_page: number
    data: Activity[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    total: number
  }
}
