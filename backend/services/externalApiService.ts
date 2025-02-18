import axios, {AxiosResponse} from 'axios';
import {OpenAIResponse} from "../types/openAi";
import {ProductsParsedAIResponse} from "../types/products";
import {extractJSONfromResponse} from "../utils/parseHelpers";
import {FailedResponse} from "../types/responseStatus";
import {throwError} from "../utils/responseErrorHandler";
import { Response } from "express";

export const fetchChatCompletion = async (message: string): Promise<ProductsParsedAIResponse | FailedResponse> => {
    try {
        const response: AxiosResponse<OpenAIResponse> = await axios.post<OpenAIResponse>(
            process.env.EXTERNAL_API_URL as string,
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: message }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}`,
                },
            }
        );

        const rawContent = response.data.choices?.[0]?.message?.content || "";
        return extractJSONfromResponse(rawContent)
    } catch (error) {
        return throwError(`Error fetching openAI API response: ${error}`)
    }
};

export const fetchChatStreamCompletion = async (message: string, res: Response): Promise<void> => {
    // Set streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const response = await axios.post(
            process.env.EXTERNAL_API_URL as string,
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: message }],
                stream: true,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}`,
                },
                responseType: 'stream',
            }
        );

        const stream = response.data;
        stream.on('data', (chunk: Buffer) => {
            res.write(chunk);
        });

        stream.on('end', () => {
            res.end();
        });

        stream.on('error', (error: Error) => {
            res.write(`data: ${JSON.stringify(throwError('Stream error occurred'))}`);
            res.end();
        });
    } catch (error) {
        res.status(500).json(throwError(`Error fetching OpenAI API response: ${error}`));
    }
};

