import { defineStore } from 'pinia';
import { ref } from 'vue';
import {getProducts} from '../services/externalApi.ts';

export const useProductsStore = defineStore('productsStore', () => {
    const products = ref<any>(null);
    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    const loadProducts = async ({countryId, cityId, prompt}: {countryId: number, cityId: number | undefined, prompt: string})  => {
        loading.value = true;
        try {
            products.value = await getProducts(countryId, cityId, prompt);
        } catch (err) {
            error.value = 'Failed to fetch products';
        } finally {
            loading.value = false;
        }
    };

    return { products, error, loading, loadProducts };
});
