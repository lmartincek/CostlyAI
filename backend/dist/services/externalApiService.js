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
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: message }],
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}`,
            },
        });
        return response.data; // Return data to the controller
    }
    catch (error) {
        console.error('Error fetching AI response:', error);
        throw new Error('Failed to fetch data from OpenAI API');
    }
};
exports.fetchChatCompletion = fetchChatCompletion;
