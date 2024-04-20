import { type User } from '/@src/models/users'

export interface Rating {
  id: number
  error_code_ce_id: number
  user_id: string
  nilai: number
  comment: string
  created_at: string
  updated_at: string
  users: User
}
