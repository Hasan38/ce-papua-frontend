import { type Role } from './role'
import type { Regional } from '/@src/models/regional'

export interface UserPopover {
  id: number
  avatar?: string
  badge?: string
  username: string
  fullName: string
  location: string
  position: string
  bio: string
  color?: string
  initials?: string
}

export interface User {
  id: string
  name: string
  email: string
  nip: string
  address: string
  phone: string
  token: string
  area_id: number
  area_name: string
  avatar: string
  status: number
  area_groups: {
    id: number
    regional_id: number
    name: string
    regionals: Regional
  }
  roles: Role[]
}
