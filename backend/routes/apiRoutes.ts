import { Router } from 'express';
import { getChatResponse } from '../controllers/externalApiController';
import {getCountries, getProducts, getCities, saveProducts} from "../controllers/myApiController";

const router = Router();

// @ts-ignore
router.post('/chat', getChatResponse);

router.get('/products', getProducts);
router.get('/countries', getCountries);
router.get('/cities', getCities);

router.post('/products', saveProducts)
export default router;
