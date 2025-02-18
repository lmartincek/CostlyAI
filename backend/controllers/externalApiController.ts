import { Request, Response } from 'express';
import { fetchChatCompletion } from '../services/externalApiService';
import {ProductsParsedAIResponse} from "../types/products";
import {FailedResponse} from "../types/responseStatus";
import {throwError} from "../utils/responseErrorHandler";

// Controller to fetch data from the external API
export const getChatResponse = async (req: Request, res: Response) => {
    try {
        const { message } = req.body; // Extract message from frontend request

        if (!message) {
            res.status(400).json(throwError('Message is missing in the request'));
            return
        }

        const aiProducts: ProductsParsedAIResponse | FailedResponse = await fetchChatCompletion(message); //returns openAI api response
        res.status(200).json(aiProducts);
    } catch (error) {
        res.status(500).json(throwError(`Failed to get response from openAI controller: ${error}`));
    }
};