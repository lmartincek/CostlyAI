"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatResponse = void 0;
const externalApiService_1 = require("../services/externalApiService");
// Controller to fetch data from the external API
const getChatResponse = async (req, res) => {
    try {
        const { message } = req.body; // Extract message from frontend request
        if (!message) {
            return res.status(400).json({ error: 'Invalid request format' });
        }
        const aiResponse = await (0, externalApiService_1.fetchChatCompletion)(message); //returns openAI api response
        res.status(200).json(aiResponse);
    }
    catch (error) {
        console.error('Error in OpenAI controller:', error);
        res.status(500).json({ error: 'Failed to get response from OpenAI API' });
    }
};
exports.getChatResponse = getChatResponse;
