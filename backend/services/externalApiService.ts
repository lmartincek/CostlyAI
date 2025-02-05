import axios from 'axios';

export const fetchChatCompletion = async (message: string) => {
    try {
        const response = await axios.post(
            process.env.EXTERNAL_API_URL as string,
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: message }],
                // TODO - add stream later on
                // stream: true,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}`,
                },
            }
        );

        return response.data; // Return data to the controller
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw new Error('Failed to fetch data from OpenAI API');
    }
};


