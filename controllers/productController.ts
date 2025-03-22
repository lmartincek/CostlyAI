import { Request, Response } from 'express'
import {
  addProducts,
  addUserProducts,
  fetchProducts,
  fetchUserProducts,
} from '../services/productService'
import { ProductAIResponse, Product, ProductUser } from '../types/products'
import { FailedResponse } from '../types/responseStatus'
import { returnError } from '../utils/responseErrorHandler'
import { hasInvalidProducts } from '../utils/validationHelpers'

export const getProducts = async (req: Request, res: Response) => {
  const { countryId, cityId } = req.query

  if (!countryId) {
    return res.status(400).json(returnError('countryId is required', 400))
  }

  const parsedCountryId = countryId ? Number(countryId) : null
  const parsedCityId = cityId ? Number(cityId) : null

  const products = await fetchProducts(parsedCountryId, parsedCityId)

  if ('error' in products) {
    const { error, statusCode } = products as FailedResponse
    return res.status(statusCode ?? 500).json(returnError(error, statusCode))
  }

  return res.status(200).json(products)
}

export const saveProducts = async (req: Request, res: Response) => {
  const { countryId, cityId, products } = req.body

  if (hasInvalidProducts(products)) {
    return res.status(400).json(returnError('Missing required fields in one or more products', 400))
  }

  const mappedProducts = products.map((product: ProductAIResponse): Product => {
    return {
      ...product,
      country_id: countryId,
      city_id: cityId ?? null,
    }
  })

  const message = await addProducts(mappedProducts)

  if (message && 'error' in message) {
    const { error, statusCode } = message as FailedResponse
    return res.status(statusCode ?? 500).json(returnError(error, statusCode))
  }

  //TODO - when supabase accepts data it returns null, thus the message is null = rewrite later
  return res.status(201).json({ message: 'Products saved successfully!' })
}

export const getUserProducts = async (req: Request, res: Response) => {
  const { userId, searchId } = req.query

  if (!userId || !searchId) {
    return res.status(400).json(returnError('userId and searchId is required', 400))
  }

  const products = await fetchUserProducts(String(userId), Number(searchId))

  if ('error' in products) {
    const { error, statusCode } = products as FailedResponse
    return res.status(statusCode ?? 500).json(returnError(error, statusCode))
  }

  return res.status(200).json(products)
}

export const saveUserProducts = async (req: Request, res: Response) => {
  const { userId, userSearchId, products } = req.body

  if (!userId || !userSearchId) {
    return res
      .status(400)
      .json(
        returnError(`Missing required userId: ${userId}, or userSearchId: ${userSearchId}`, 400),
      )
  }

  if (hasInvalidProducts(products)) {
    return res.status(400).json(returnError('Missing required fields in one or more products', 400))
  }

  const mappedProducts = products.map((product: ProductAIResponse): ProductUser => {
    return {
      ...product,
      user_id: userId,
      user_search_id: userSearchId,
    }
  })

  const message = await addUserProducts(mappedProducts)

  if (message && 'error' in message) {
    const { error, statusCode } = message as FailedResponse
    return res.status(statusCode ?? 500).json(returnError(error, statusCode))
  }

  return res.status(201).json({ message: 'User products saved successfully!' })
}
