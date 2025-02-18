import axios from 'axios';

// Create an Axios instance for making API requests
const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to fetch data from the backend -> This is processed by 1.ApiRoutes, 2.Controller which uses 3.Service
export const sendChatMessage = async (countryId: number | undefined, cityId: number | undefined, message: string) => {
    try {
        const response = await apiClient.post('/chat', { message } );

        if (response.data) {
            await apiClient.post('/products', { countryId, cityId, products: response.data })
        }

        return response.data;  // Return the data received from the backend
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
};

export const getProducts = async (countryId: number, cityId: number | undefined, message: string) => {
    const url = `/products?countryId=${countryId}${cityId ? `&cityId=${cityId}` : ''}`
    try {
        const response = await apiClient.get(url);
        return response.data;  // Return the data received from the backend
    } catch (error) {
        // @ts-ignore
        if (error.response.status === 404) {
            return await sendChatMessage(countryId, cityId, message)
        }

        console.error('Error fetching products from DB:', error);
        throw error;
    }
};

export const getCountries = async () => {
    try {
        const response = await apiClient.get('/countries' );
        console.log(response, 'countries from DB')
        return response.data;  // Return the data received from the backend
    } catch (error) {
        console.error('Error fetching countries from DB:', error);
        throw error;
    }
};

export const getCities = async (countryId: number) => {
    try {
        const response = await apiClient.get(`/cities?countryId=${countryId}` );
        console.log(response, 'cities from DB')
        return response.data;  // Return the data received from the backend
    } catch (error) {
        console.error('Error fetching cities from DB:', error);
        throw error;
    }
};
