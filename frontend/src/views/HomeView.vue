<template>
    <div>
        <h1>External Data</h1>
        <div v-if="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="data">
            <pre>{{ data }}</pre>
        </div>
        <button @click="loadData(prompt)">Fetch Data</button>
    </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../stores/dataStore.ts';
import {ref} from "vue";

const prompt = ref('I want to know in a json form of 20 commonly bought groceries, pint of beer in a bar, cocktail, gym month membership, one time entry in a gym, airbnb prices per night and one night bed in a shared dormitory in SLOVAKIA, Bratislava')
// todo - loading doesnt work, I need a parser for key values given from AI
const { data, error, loading, loadData } = useDataStore();
</script>

<style scoped>
.error {
    color: red;
}
</style>
