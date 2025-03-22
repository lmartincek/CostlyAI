import axios, {AxiosResponse} from 'axios';
import {OpenAIResponse} from "../types/openAi";
import {handleOpenAIResponse} from "../utils/parseHelpers";
import {FailedResponse} from "../types/responseStatus";
import {returnError} from "../utils/responseErrorHandler";
import {ProductAIResponse} from "../types/products";

export const fetchChatCompletion = async (countryName: string, cityName?: string, selectedCategories?: string[]): Promise<ProductAIResponse[] | FailedResponse> => {
    const format = (categories = '"groceries" | "services" | "others"') => `[{"name": string in english,"price": number in USD (up to date conversion rate if possible),"category": string as ${categories}}]`
    const instructions = `You are an assistant that shows costs of living list in desired JSON object. The desired output is only JSON, no text outside of JSON - as ${selectedCategories ? format(selectedCategories.join(' | ')) : format()}. If you can't find proper data, output only few items you can in a format I provided you.`
    const message = selectedCategories && selectedCategories.length
        ? `I want to know prices in ${cityName ? countryName + ', ' + cityName : countryName} within this categories: ${selectedCategories.join(', ')}.`
        : `Show me 24 items in total, most commonly bought groceries, 8 most used services, meal in restaurant, pint of beer, gym membership. 6 others such as transportation (with km range) or other available data in ${cityName ? countryName + ', ' + cityName : countryName}.`

    try {
        const response: AxiosResponse<OpenAIResponse> = await axios.post<OpenAIResponse>(
            process.env.CHAT_COMPLETION_URL as string,
            {
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'developer', content: instructions},
                    { role: 'user', content: message }
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.CHAT_COMPLETION_KEY}`,
                },
            }
        );

        return handleOpenAIResponse(response)
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

