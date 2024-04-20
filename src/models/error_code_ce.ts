import { type Rating } from '/@src/models/rating'
import { type User } from '/@src/models/users'

export interface ErrorCodeCe {

  id: number
  user_id: string
  machine_type: string
  error_code: []
  problem_info: string
  action_taken: string
  created_at: string
  updated_at: string
  ratings_count: number
  ratings_avg_nilai: number
  users: User
  ratings: Rating[]

}

export interface ErrorCodeCeResponse {
  success: boolean
  data: {
    current_page: number
    data: ErrorCodeCe[]
    total: number
  }
}
