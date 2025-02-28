import {returnError} from "../utils/responseErrorHandler";
import {supabase} from "../utils/supabaseClient";
import {FailedResponse} from "../types/responseStatus";
import {City} from "../types/cities";
import {Country} from "../types/countries";

export const fetchCountries = async (): Promise<Country[] | FailedResponse> => {
    try {
        const { data, error } = await supabase
            .from('countries')
            .select('*')

        if (error) {
            return returnError(`Failed to fetch countries: ${error.message}`, 400)
        }

        return data
    } catch (error: any) {
        return returnError(`Unexpected error in fetchCountries: ${error.message}`);
    }
}

export const fetchCities = async (countryId: number): Promise<City[] | FailedResponse> => {
    try {
        const { data, error } = await supabase
            .from('cities')
            .select('*')
            .eq('country_id', countryId)

        if (error) {
            return returnError(`Failed to fetch cities: ${error.message}`, 400)
        }

        return data
    } catch (error: any) {
        return returnError(`Unexpected error in fetchCities: ${error.message}`);
    }

}

//TODO - handle edges where extracting general country products
export const fetchProducts = async (
    countryId: number,
    cityId: number | null
): Promise<Product[] | FailedResponse> => {
    try {
        const query = supabase
            .from('products')
            .select('*')
            .eq('country_id', countryId);

        if (cityId) {
            query.eq('city_id', cityId);
        }

        const { data, error } = await query;

        if (error) {
            return returnError(`Failed to fetch products: ${error.message}`, 400);
        }

        if (!data?.length) {
            return returnError(`No products found for country ID: ${countryId} ${cityId ? 'and city ID: ' + cityId : ''}`, 404);
        }

        return data;
    } catch (error: any) {
        return returnError(`Unexpected error in fetchProducts: ${error.message}`);
    }
};

export const addProducts = async (products: ProductAIResponse[]): Promise<FailedResponse | null>=> {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert(products);

        if (error) {
            return returnError(`Failed to insert products: ${error.message}`, 400);
        }

        return data
    } catch (error: any) {
        return returnError(`Unexpected error in addProducts: ${error.message}`);
    }
}