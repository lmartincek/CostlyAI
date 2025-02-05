import { Router } from 'express';
import { getChatResponse } from '../controllers/externalApiController';

const router = Router();

// @ts-ignore
router.post('/chat', getChatResponse); // Define a route to fetch data from the external API via the backend

export default router;
