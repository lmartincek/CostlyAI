import { Router } from 'express'
import { getChatResponse, getChatStreamResponse } from '../controllers/chatCompletionController'
import {
  getCountries,
  getCities,
  getRecentlySearchedPlaces,
  saveUserSearch,
  getUserSearch,
} from '../controllers/generalController'
import {
  loginWithProvider,
  logout,
  loginWithCredentials,
  register,
  refreshToken,
  getUserSession,
  setUserSession,
  resetPassword,
} from '../controllers/authController'
import {
  getProducts,
  getUserProducts,
  saveProducts,
  saveUserProducts,
} from '../controllers/productController'
import { getCommunities } from '../controllers/communitiesController'

const router = Router()

//TODO fix the typing problem
// @ts-ignore
router.post('/chat', getChatResponse)
// @ts-ignore
router.post('/chatStream', getChatStreamResponse)

// @ts-ignore
router.get('/products', getProducts)
// @ts-ignore
router.post('/products', saveProducts)
// @ts-ignore
router.get('/products/user', getUserProducts)
// @ts-ignore
router.post('/products/user', saveUserProducts)

// @ts-ignore
router.get('/countries', getCountries)
// @ts-ignore
router.get('/cities', getCities)
// @ts-ignore
router.get('/communities', getCommunities)

// @ts-ignore
router.get('/recently-searched-places', getRecentlySearchedPlaces)
// @ts-ignore
router.post('/recently-searched-places/user', saveUserSearch)
// @ts-ignore
router.get('/recently-searched-places/user', getUserSearch)

// @ts-ignore
router.post('/login-with-credentials', loginWithCredentials)
// @ts-ignore
router.post('/login-with-provider', loginWithProvider)
// @ts-ignore
router.post('/register', register)
// @ts-ignore
router.post('/logout', logout)

// @ts-ignore
router.get('/refresh-token', refreshToken)
// @ts-ignore
router.get('/get-user', getUserSession)
// @ts-ignore
router.post('/set-user', setUserSession)
// @ts-ignore
router.post('/reset-password', resetPassword)
export default router
