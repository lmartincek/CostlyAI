"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchChatCompletion = void 0;
const axios_1 = __importDefault(require("axios"));
const fetchChatCompletion = async (message) => {
    try {
        const response = await axios_1.default.post(process.env.EXTERNAL_API_URL, {
            //todo - if 429 is returned (rate limit for model 4 is reached, new request to another model)
            // model: 'gpt-4o-mini',
            // messages: [{ role: 'user', content: message }],
            "name": "Apple MacBook Pro 1632923093202392390",
            "data": {
                "year": 234232423019,
                "price": 1844324234239.99,
                "CPU model": "Intel Core34242423 i9",
                "Hard disk size": "143242342 TB"
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}`,
            },
        });
        console.log(response, 'zaujimave');
        return response.data; // Return data to the controller
    }
    catch (error) {
        console.error('Error fetching AI response:', error);
        throw new Error('Failed to fetch data from OpenAI API');
    }
};
exports.fetchChatCompletion = fetchChatCompletion;
