import type { User } from './users'

export interface Tutorial {
  id: number
  user_id: string
  machine_type: []
  customer: string
  type: string
  title: string
  content: string
  link: string
  users: User
  created_at: string
}

export interface TutorialResponse {
  success: boolean
  data: {
    current_page: number
    data: Tutorial[]
    total: number
  }
}

export interface TurorialGetResponse {
  success: boolean
  data: Tutorial
}
