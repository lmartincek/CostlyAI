import { Product, ProductAIResponse, ProductUser } from '../types/products'
import { FailedResponse } from '../types/responseStatus'
import { returnError } from '../utils/responseErrorHandler'
import { supabase } from '../utils/supabaseClient'

export const fetchProducts = async (
  countryId: number | null,
  cityId: number | null,
): Promise<Product[] | FailedResponse> => {
  try {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })

    if (countryId !== null) {
      query = query.eq('country_id', countryId)
    }

    if (countryId !== null) {
      if (cityId !== null) {
        query = query.eq('city_id', cityId)
      } else {
        query = query.is('city_id', null)
      }
    }

    const { data, error } = await query

    if (error) {
      return returnError(`Failed to fetch products: ${error.message}`, 400)
    }

    if (!data?.length) {
      return returnError(
        `No products found for country ID: ${countryId} ${cityId ? 'and city ID: ' + cityId : ''}`,
        404,
      )
    }

    return data
  } catch (error: any) {
    return returnError(`Unexpected error in fetchProducts: ${error.message}`)
  }
}

export const addProducts = async (
  products: ProductAIResponse[],
): Promise<FailedResponse | null> => {
  try {
    const { data, error } = await supabase.from('products').insert(products)

    if (error) {
      return returnError(`Failed to insert products: ${error.message}`, 400)
    }

    return data
  } catch (error: any) {
    return returnError(`Unexpected error in addProducts: ${error.message}`)
  }
}

export const fetchUserProducts = async (
  userId: string,
  searchId: number,
): Promise<ProductUser[] | FailedResponse> => {
  try {
    const { data, error } = await supabase
      .from('user_products')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('user_search_id', searchId)
      .eq('user_id', userId)

    if (error) {
      return returnError(`Failed to fetch products: ${error.message}`, 400)
    }

    if (!data?.length) {
      return returnError(`No products found for user ID: ${userId} in search ID: ${searchId}`, 404)
    }

    return data
  } catch (error: any) {
    return returnError(`Unexpected error in fetchUserProducts: ${error.message}`)
  }
}

export const addUserProducts = async (products: ProductUser[]) => {
  try {
    const { error } = await supabase.from('user_products').insert(products)

    if (error)
      return returnError(
        `Failed to insert user products: ${error.message}, hint: ${error.hint}`,
        400,
      )
  } catch (error: any) {
    return returnError(`Unexpected error in addUserProducts: ${error.message}`)
  }
}
