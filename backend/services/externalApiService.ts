import axios from 'axios';
import {OpenAIResponse} from "../types/openai";

//TODO - move to utils
// const parseResponse = (responseContent: string) => {
//     const jsonMatch = responseContent.match(/```json\n([\s\S]+?)\n```/);
//     if (!jsonMatch) return null;  // Return null if no JSON is found
//
//     try {
//         return JSON.parse(jsonMatch[1]); // Parse extracted JSON
//     } catch (error) {
//         console.error("Error parsing JSON:", error);
//         return null;
//     }
// };

const mockData = {
    "id": "chatcmpl-AxLFTKMMSHkzqmJvFnLGyCIXRlsxO",
    "object": "chat.completion",
    "created": 1738706395,
    "model": "gpt-4o-mini-2024-07-18",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "Here's a JSON representation based on your request, including 20 commonly bought groceries, various other items, and typical prices for accommodations in Bratislava, Slovakia:\n\n```json\n{\n  \"GROCERIES\": [\n    {\"name\": \"Milk\", \"slug\": \"milk\", \"price\": 0.80},\n    {\"name\": \"Bread\", \"slug\": \"bread\", \"price\": 1.00},\n    {\"name\": \"Eggs\", \"slug\": \"eggs\", \"price\": 2.00},\n    {\"name\": \"Apples\", \"slug\": \"apples\", \"price\": 1.50},\n    {\"name\": \"Bananas\", \"slug\": \"bananas\", \"price\": 1.20},\n    {\"name\": \"Chicken Breast\", \"slug\": \"chicken-breast\", \"price\": 7.00},\n    {\"name\": \"Rice\", \"slug\": \"rice\", \"price\": 2.50},\n    {\"name\": \"Pasta\", \"slug\": \"pasta\", \"price\": 1.80},\n    {\"name\": \"Tomato Sauce\", \"slug\": \"tomato-sauce\", \"price\": 1.00},\n    {\"name\": \"Potatoes\", \"slug\": \"potatoes\", \"price\": 1.00},\n    {\"name\": \"Cheese\", \"slug\": \"cheese\", \"price\": 3.00},\n    {\"name\": \"Butter\", \"slug\": \"butter\", \"price\": 2.50},\n    {\"name\": \"Yogurt\", \"slug\": \"yogurt\", \"price\": 0.90},\n    {\"name\": \"Cereal\", \"slug\": \"cereal\", \"price\": 3.50},\n    {\"name\": \"Sugar\", \"slug\": \"sugar\", \"price\": 1.00},\n    {\"name\": \"Coffee\", \"slug\": \"coffee\", \"price\": 4.00},\n    {\"name\": \"Tea\", \"slug\": \"tea\", \"price\": 2.50},\n    {\"name\": \"Olive Oil\", \"slug\": \"olive-oil\", \"price\": 5.00},\n    {\"name\": \"Frozen Vegetables\", \"slug\": \"frozen-vegetables\", \"price\": 2.00},\n    {\"name\": \"Snack Chips\", \"slug\": \"snack-chips\", \"price\": 1.50}\n  ],\n  \"OTHERS\": [\n    {\"name\": \"Pint of Beer\", \"slug\": \"pint-of-beer\", \"price\": 2.50},\n    {\"name\": \"Cocktail\", \"slug\": \"cocktail\", \"price\": 5.00},\n    {\"name\": \"Gym Monthly Membership\", \"slug\": \"gym-monthly-membership\", \"price\": 30.00},\n    {\"name\": \"One-Time Entry to Gym\", \"slug\": \"one-time-entry-gym\", \"price\": 10.00},\n    {\"name\": \"Airbnb Prices per Night\", \"slug\": \"airbnb-price-night\", \"price\": 50.00},\n    {\"name\": \"Shared Dormitory Bed\", \"slug\": \"shared-dormitory-bed\", \"price\": 15.00}\n  ]\n}\n```\n\nThis JSON includes 20 grocery items with their names, slug (a URL-friendly version of the name), and prices. Additionally, it includes various other items related to leisure and accommodation, specifically relevant to Bratislava, Slovakia. Prices are indicative and may vary.",
                "refusal": null
            },
            "logprobs": null,
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 95,
        "completion_tokens": 736,
        "total_tokens": 831,
        "prompt_tokens_details": {
            "cached_tokens": 0,
            "audio_tokens": 0
        },
        "completion_tokens_details": {
            "reasoning_tokens": 0,
            "audio_tokens": 0,
            "accepted_prediction_tokens": 0,
            "rejected_prediction_tokens": 0
        }
    },
    "service_tier": "default",
    "system_fingerprint": "fp_72ed7ab54c"
}


export const fetchChatCompletion = async (message: string): Promise<OpenAIResponse> => {
    try {
        const response = await axios.post<OpenAIResponse>(
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

        // @ts-ignore
        // const rawContent = mockData.choices?.[0]?.message?.content || "";

        // Extract JSON from the response content
        const jsonMatch = rawContent.match(/```json\n([\s\S]+?)\n```/);
        if (!jsonMatch) {
            throw new Error("No valid JSON found in response.");
        }

        return JSON.parse(jsonMatch[1]); // Return parsed JSON to the frontend

        // return response.data; // Return data to the controller
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw new Error('Failed to fetch data from OpenAI API');
    }
};


