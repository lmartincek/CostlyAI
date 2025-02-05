import { defineStore } from 'pinia';
import { ref } from 'vue';
import { sendChatMessage } from '../services/externalApi.ts';

export const useDataStore = defineStore('dataStore', () => {
    const data = ref<any>(null);
    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);

    const loadData = async (prompt: string) => {
        loading.value = true;
        try {
            data.value = await sendChatMessage(prompt);
        } catch (err) {
            error.value = 'Failed to fetch data';
        } finally {
            loading.value = false;
        }
    };

    return { data, error, loading, loadData };
});
