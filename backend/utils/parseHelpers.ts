import {FailedResponse} from "../types/responseStatus";
import {returnError} from "./responseErrorHandler";

export const extractJSONProductsFromResponse = (responseContent: string): ProductAIResponse[] | FailedResponse  => {
    const jsonMatch: RegExpMatchArray | null = responseContent.match(/```json\n([\s\S]+?)\n```/);
    if (!jsonMatch) return returnError("No valid JSON found in openAI response.");

    try {
        return JSON.parse(jsonMatch[1]) as ProductAIResponse[];
    } catch (error: unknown) {
        return returnError(`Error parsing JSON from openAI: ${error}`);
    }
};