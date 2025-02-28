// TODO - this is the same as in backend folder, how to unite it
enum ProductCategory {
    GROCERIES = "groceries",
    SERVICES = "services",
    OTHERS = "others",
}

type ProductCategoryType = ProductCategory.GROCERIES | ProductCategory.SERVICES | ProductCategory.OTHERS
interface ProductAIResponse {
    name: string,
    price: number,
    category: ProductCategoryType,
}

interface Product extends ProductAIResponse {
    id: number,
    country_id: number,
    city_id: number | null
}

type ProductGroups = Record<ProductCategoryType, Product[]>;