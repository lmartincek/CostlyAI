import {ProductsParsedAIResponse} from "../types/products";
import {FailedResponse} from "../types/responseStatus";
import {throwError} from "./responseErrorHandler";

export const extractJSONfromResponse = (responseContent: string): ProductsParsedAIResponse | FailedResponse  => {
    const jsonMatch: RegExpMatchArray | null = responseContent.match(/```json\n([\s\S]+?)\n```/);
    if (!jsonMatch) return throwError("No valid JSON found in openAI response.");

    try {
        return JSON.parse(jsonMatch[1]) as ProductsParsedAIResponse;
    } catch (error: unknown) {
        return throwError(`Error parsing JSON from openAI: ${error}`);
    }
};

export const groupByFn = (products: {id: number, category: string, name: string}[]) => {
    return products.reduce((x, y) => {
        // @ts-ignore
        (x[y.category] = (x[y.category] || [])).push(y);
        return x;
    }, {})
}