import { Router } from 'express';
import {getChatResponse, getChatStreamResponse} from '../controllers/chatCompletionController';
import {getCountries, getProducts, getCities, saveProducts} from "../controllers/generalController";

const router = Router();

router.post('/chat', getChatResponse);
router.post('/chatStream', getChatStreamResponse);

router.get('/products', getProducts);
router.get('/countries', getCountries);
router.get('/cities', getCities);

//TODO co to ma za problem?
// @ts-ignore
router.post('/products', saveProducts);
export default router;
