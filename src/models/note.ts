import { type User } from '/@src/models/users'

export interface Note {
  id: number
  machine_id: number
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  users: User
}
