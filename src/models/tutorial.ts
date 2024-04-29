import type { User } from './users'

export interface Tutorial {
  id: number
  user_id: number
  machine_type: string
  customer: string
  type: string
  title: string
  content: string
  link: string
  users: User
}
