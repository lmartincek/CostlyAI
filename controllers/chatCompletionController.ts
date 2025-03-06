import { Request, Response } from 'express';
import {fetchChatCompletion, fetchChatStreamCompletion} from '../services/chatCompletionService';
import {FailedResponse} from "../types/responseStatus";
import {returnError} from "../utils/responseErrorHandler";

export const getChatResponse = async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json(returnError('Message is missing in the request'));
    }

    const aiProducts: ProductAIResponse[] | FailedResponse = await fetchChatCompletion(message);
    if ('error' in aiProducts) {
        const { error, statusCode } = aiProducts;
        return res.status(statusCode ?? 500).json(returnError(`Failed to get response from openAI controller: ${error}`));
    }

    return res.status(200).json(aiProducts);
};

export const getChatStreamResponse = async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json(returnError('Message is missing in the request'));
    }

    const stream = await fetchChatStreamCompletion(message);

    if ('error' in stream) {
        const { error, statusCode} = stream as FailedResponse
        return res.status(statusCode ?? 500).json(returnError(`Failed to get response from OpenAI streaming: ${error}`, statusCode));
    }

    // Set streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    stream.on('data', (chunk: Buffer) => {
        res.write(chunk);
    });

    stream.on('end', () => {
        res.end();
    });

    stream.on('error', (error: Error) => {
        res.write(JSON.stringify(returnError('Stream error occurred')));
        res.end();
    });
};