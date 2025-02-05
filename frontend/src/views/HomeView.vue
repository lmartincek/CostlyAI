<template>
    <div>
        <h1>External Data</h1>
        <div v-if="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="data">
            <pre>{{ data }}</pre>
        </div>
        <button @click="loadData('kolko je hodin dnes vecer')">Fetch Data</button>
    </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../stores/dataStore.ts';
import {ref} from "vue";

const prompt = ref('')

const { data, error, loading, loadData } = useDataStore();
</script>

<style scoped>
.error {
    color: red;
}
</style>
