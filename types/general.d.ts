import { City } from './cities'
import { Country } from './countries'

export interface Place {
  country: Country
  city: City | null
}

export interface UserSearch extends Place {
  id: number
  categories: string[]
  created_at: string
}

export interface UserSearchPayload {
  userId: string
  categories: string[]
  countryId: number
  cityId: number
}
