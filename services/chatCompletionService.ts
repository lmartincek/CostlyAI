import axios, {AxiosResponse} from 'axios';
import {OpenAIResponse, OpenAIStreamResponse} from "../types/openAi";
import {extractJSONProductsFromResponse} from "../utils/parseHelpers";
import {FailedResponse} from "../types/responseStatus";
import {returnError} from "../utils/responseErrorHandler";
import { Response } from "express";

export const fetchChatCompletion = async (message: string): Promise<ProductAIResponse[] | FailedResponse> => {
    try {
        const response: AxiosResponse<OpenAIResponse> = await axios.post<OpenAIResponse>(
            process.env.CHAT_COMPLETION_URL as string,
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: message }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.CHAT_COMPLETION_KEY}`,
                },
            }
        );

        const rawContent = response.data.choices?.[0]?.message?.content || "";
        if (!rawContent) {
            return returnError("No text in response from openAI", 404)
        }

        const extractedJSON = extractJSONProductsFromResponse(rawContent)
        if (!extractedJSON) {
            return returnError("Couldn't find JSON to parse", 400)
        }

        return extractJSONProductsFromResponse(rawContent)
    } catch (error: any) {
        return returnError(`Error fetching openAI API response: ${error.message}`)
    }
};

export const fetchChatStreamCompletion = async (message: string): Promise<FailedResponse | any> => {
    try {
        const response = await axios.post(
            process.env.CHAT_COMPLETION_URL as string,
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: message }],
                stream: true,
                store: true,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.CHAT_COMPLETION_KEY}`,
                },
                responseType: 'stream',
            }
        );

        return response.data;
    } catch (error: any) {
        return returnError(`Error fetching OpenAI API response: ${error.message}`)
    }
};

