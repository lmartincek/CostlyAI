import {returnError} from "../utils/responseErrorHandler";
import {supabase} from "../utils/supabaseClient";
import {FailedResponse} from "../types/responseStatus";
import {City} from "../types/cities";
import {Country} from "../types/countries";
import {Product, ProductAIResponse} from "../types/products";

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

export const fetchProducts = async (
    countryId: number | null,
    cityId: number | null,
    limit: number | null = null
): Promise<Product[] | FailedResponse> => {
    //TODO - with limit not getting products where city_id is set
    try {
        const query = supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (countryId !== null) {
            query.eq('country_id', countryId);
        }

        if (cityId) {
            query.eq('city_id', cityId);
        } else if (cityId === null) {
            query.is('city_id', null);
        }

        if (limit !== null) {
            query.limit(limit);
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