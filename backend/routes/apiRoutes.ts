import { Router } from 'express';
import { getChatResponse } from '../controllers/externalApiController';
import {getCountries, getProducts, getCities} from "../controllers/myApiController";

const router = Router();

// @ts-ignore
router.post('/chat', getChatResponse);
router.get('/products', getProducts);

router.get('/countries', getCountries);

// todo how to register this one dynamic endpoint
router.get('/countries/:countryId/cities', getCities);
export default router;
