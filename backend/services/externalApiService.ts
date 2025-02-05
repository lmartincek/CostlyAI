import axios from 'axios';

export const fetchChatCompletion = async (message: string) => {
    try {
        const response = await axios.post(
            process.env.EXTERNAL_API_URL as string,
            {
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
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}`,
                },
            }
        );

        console.log(response, 'zaujimave')
        return response.data; // Return data to the controller
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw new Error('Failed to fetch data from OpenAI API');
    }
};


