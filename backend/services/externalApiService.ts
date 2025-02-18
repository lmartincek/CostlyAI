import axios, {AxiosResponse} from 'axios';
import {OpenAIResponse} from "../types/openAi";
import {ProductsParsedAIResponse} from "../types/products";
import {extractJSONfromResponse} from "../utils/parseHelpers";
import {FailedResponse} from "../types/responseStatus";
import {throwError} from "../utils/responseErrorHandler";

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


