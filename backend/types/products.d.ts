enum ProductType {
    GROCERIES = "GROCERIES",
    OTHERS = "OTHERS",
}
interface ProductParsedAI {
    name: string,
    price: string,
}

interface ProductsParsedAIResponse {
    [ProductType.GROCERIES]: ProductParsedAI[],
    [ProductType.OTHERS]: ProductParsedAI[]
}

interface Product extends ProductParsedAI {
    id: number,
    category: [ProductType.OTHERS] | [ProductType.GROCERIES],
    country_id: number,
    city_id: number | null
}

export interface ProductsResponse {
    [ProductType.GROCERIES]: Product[],
    [ProductType.OTHERS]: Product[]
}