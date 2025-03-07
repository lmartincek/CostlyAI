import { Router } from 'express';
import {getChatResponse, getChatStreamResponse} from '../controllers/chatCompletionController';
import {getCountries, getProducts, getCities, saveProducts} from "../controllers/generalController";

const router = Router();

//TODO fix the typing problem
// @ts-ignore
router.post('/chat', getChatResponse);
// @ts-ignore
router.post('/chatStream', getChatStreamResponse);

// @ts-ignore
router.get('/products', getProducts);
// @ts-ignore
router.get('/countries', getCountries);
// @ts-ignore
router.get('/cities', getCities);

// @ts-ignore
router.post('/products', saveProducts);
export default router;
