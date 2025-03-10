import axios, {AxiosResponse} from 'axios';
import {OpenAIResponse, OpenAIStreamResponse} from "../types/openAi";
import {extractJSONProductsFromResponse} from "../utils/parseHelpers";
import {FailedResponse} from "../types/responseStatus";
import {returnError} from "../utils/responseErrorHandler";
import { Response } from "express";
import {ProductAIResponse} from "../types/products";

export const fetchChatCompletion = async (countryName: string, cityName?: string): Promise<ProductAIResponse[] | FailedResponse> => {
    const message = `create only JSON, no text outside of JSON format, of 24 items in total.
    10 commonly bought groceries with units (pc, kg, L),
    8 commonly used services, meal in restaurant, pint of beer, gym membership
    6 others such as transportation (with km range) or other available data
    in ${cityName ? countryName + ', ' + cityName : countryName}.
    JSON format should be
    [
        {
            "name": string in english,
            "price": number in USD (up to date conversion rate if possible),
            "category": string as "groceries" | "services" | "others",
        }
    ]`;

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

