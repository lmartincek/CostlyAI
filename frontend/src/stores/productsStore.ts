import { defineStore } from 'pinia';
import { ref } from 'vue';
import {getProducts, sendChatMessage} from '../services/externalApi.ts';

export const useProductsStore = defineStore('productsStore', () => {
    const products = ref<any>(null);
    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    const loadProducts = async (prompt: string) => {
        loading.value = true;
        try {
            if (prompt) {
                products.value = await sendChatMessage(prompt);
            } else {
                products.value = await getProducts();
            }
        } catch (err) {
            error.value = 'Failed to fetch products';
        } finally {
            loading.value = false;
        }
    };

    return { products, error, loading, loadProducts };
});
