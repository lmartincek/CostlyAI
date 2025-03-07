enum ProductCategory {
    GROCERIES = "groceries",
    SERVICES = "services",
    OTHERS = "others",
}
export interface ProductAIResponse {
    name: string,
    price: number,
    category: [ProductCategory.GROCERIES] | [ProductCategory.SERVICES] | [ProductCategory.OTHERS],
}

export interface Product extends ProductAIResponse {
    country_id: number,
    city_id: number | null
}