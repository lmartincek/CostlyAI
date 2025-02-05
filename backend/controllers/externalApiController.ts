import { Request, Response } from 'express';
import { fetchChatCompletion } from '../services/externalApiService';

// Controller to fetch data from the external API
export const getChatResponse = async (req: Request, res: Response) => {
    try {
        const { message } = req.body; // Extract message from frontend request

        if (!message) {
            return res.status(400).json({ error: 'Invalid request format' });
        }

        const aiResponse = await fetchChatCompletion(message); //returns openAI api response
        res.status(200).json(aiResponse);
    } catch (error) {
        console.error('Error in OpenAI controller:', error);
        res.status(500).json({ error: 'Failed to get response from OpenAI API' });
    }
};
