declare type ProductCategoryType = "groceries" | "services" | "others";

export interface ProductAIResponse {
    name: string,
    price: number,
    category: ProductCategoryType,
}

export interface Product extends ProductAIResponse {
    country_id: number,
    city_id: number | null
}