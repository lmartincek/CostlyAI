import { Product, ProductAIResponse } from '../types/products'

export const hasInvalidProducts = (products: Product[]): boolean => {
  return !!products.find(
    (product: ProductAIResponse) => !product.name || !product.price || !product.category,
  )
}
