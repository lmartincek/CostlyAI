import {returnError} from "../utils/responseErrorHandler";
import {supabase} from "../utils/supabaseClient";
import {FailedResponse} from "../types/responseStatus";
import {City} from "../types/cities";
import {Country} from "../types/countries";
import { Place, UserSearch, UserSearchPayload } from "../types/general";

export const fetchCountries = async (): Promise<Country[] | FailedResponse> => {
    try {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .order('name')

        // TODO
        //  - add search query
        //  - sort by alphabet
        //  - add pagination
        if (error) {
            return returnError(`Failed to fetch countries: ${error.message}`, 400)
        }

        return data
    } catch (error: any) {
        return returnError(`Unexpected error in fetchCountries: ${error.message}`);
    }
}

export const fetchCities = async (countryIds: number[]): Promise<City[] | FailedResponse> => {
    try {
        const { data, error } = await supabase
            .from('cities')
            .select('*')
            .in('country_id', countryIds)
            .order('name')

        if (error) {
            return returnError(`Failed to fetch cities: ${error.message}`, 400);
        }

        return data;
    } catch (error: any) {
        return returnError(`Unexpected error in fetchCities: ${error.message}`);
    }
};


export const fetchRecentlySearchedPlaces = async (places: number = 4): Promise<Place[] | FailedResponse> => {
    try {
        const { data, error } = await supabase
            .from("products")
            .select(`
            country: countries (id, name, code),
            city: cities (id, name)
            `)
            .order("created_at", { ascending: false })
            .limit(25 * places)

        if (error) {
            return returnError(`Failed to fetch recently searched places: ${error.message}`, 400);
        }

        const seen = new Set();
        const uniqueLocations = data
        .filter(({ country, city }) => {
            // @ts-ignore - TODO - supabase assume that returns different objects, find solution later
            const key = `${country.id}-${city?.id ?? "null"}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        })
        .slice(0, places);

        //@ts-ignore
        return uniqueLocations
        } catch (error: any) {
        return returnError(`Unexpected error in fetchRecentlySearchedPlaces: ${error.message}`);
    }
};

export const addUserSearch = async ({
        userId,
        categories, 
        countryId, 
        cityId, 
    }: UserSearchPayload) => {
    const payload = {
        user_id: userId,
        categories,
        country_id: countryId,
        ...(cityId && { city_id: cityId })
      };

    try {
        const { data, error } = await supabase
            .from('user_searches')
            .insert([payload])
            .select('id')

        if (error) return returnError(`Failed to insert user search: ${error.message}, hint: ${error.hint}`, 400);
        return data
    } catch (error: any) {
        return returnError(`Unexpected error in addUserSearch: ${error.message}`);
    }
}

export const fetchUserSearch = async (userId: string, places: number = 4): Promise<UserSearch[] | FailedResponse> => {
    try {
        const { data, error } = await supabase
            .from("user_searches")
            .select(`
                id,
                categories,
                created_at,
                country: countries (id, name, code),
                city: cities (id, name, country_id)
            `)
            .order("created_at", { ascending: false })
            .limit(places)
            .eq("user_id", userId);

        if (error) {
            return returnError(`Failed to fetch user search: ${error.message}`, 400);
        }

        //@ts-ignore
        return data
        } catch (error: any) {
        return returnError(`Unexpected error in fetchUserSearch: ${error.message}`);
    }
};