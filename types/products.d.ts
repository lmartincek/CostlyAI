declare type ProductCategoryType = 'groceries' | 'services' | 'others'

export interface ProductAIResponse {
  name: string
  price: number
  category: ProductCategoryType
}

export interface Product extends ProductAIResponse {
  country_id: number
  city_id: number | null
}

export interface ProductUser extends ProductAIResponse {
  user_id: string
  user_search_id: number
}
