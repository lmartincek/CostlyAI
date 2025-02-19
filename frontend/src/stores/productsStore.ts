import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getProducts } from '../services/externalApi.ts';
import type {ICity, ICountry} from "./generalStore.ts";

export const useProductsStore = defineStore('productsStore', () => {
    const products = ref<any>(null);
    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    const lastCountry = ref<string | null>(null);
    const lastCity = ref<string | null>(null);

    const loadProducts = async ({country, city, prompt}: {country: ICountry | null, city: ICity | null, prompt: string})  => {
        if (!country) return;

        loading.value = true;
        try {
            products.value = await getProducts(country.id, city?.id, prompt);
            lastCountry.value = country.name;
            lastCity.value = city?.name || null;
        } catch (err) {
            error.value = 'Failed to fetch products';

            if (lastCountry.value) {
                lastCountry.value = null;
            }

            if (lastCity.value) {
                lastCity.value = null;
            }
        } finally {
            loading.value = false;
        }
    };

    return { products, error, loading, lastCountry, lastCity, loadProducts };
});
