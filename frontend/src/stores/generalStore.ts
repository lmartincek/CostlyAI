import { defineStore } from 'pinia';
import { ref } from 'vue';
import {getCities, getCountries} from '../services/externalApi.ts';

export interface ICountry {
    id: number,
    code: string,
    name: string,
}

export interface ICity {
    id: number,
    name: string,
    country_id: number,
}
export const useGeneralStore = defineStore('generalStore', () => {
    const countries = ref<ICountry[]>([]);
    const cities = ref<ICity[]>([]);

    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    const loadCountries = async () => {
        loading.value = true;
        try {
            countries.value = await getCountries();
        } catch (err) {
            error.value = 'Failed to fetch countries';
        } finally {
            loading.value = false;
        }
    };

    const loadCities = async (countryId: number) => {
        loading.value = true;
        try {
            cities.value = await getCities(countryId);
        } catch (err) {
            error.value = 'Failed to fetch cities';
        } finally {
            loading.value = false;
        }
    };

    return { countries, cities, error, loading, loadCountries, loadCities };
});
