<script setup lang="ts">
import ButtonBasic from "./components/ButtonBasic.vue";
import SelectInput from "./components/SelectInput.vue";
import TableDisplay from "./components/TableDisplay.vue";

import { useProductsStore } from './stores/productsStore.ts';
import {computed, onMounted, ref, watch} from "vue";
import {ICity, ICountry, useGeneralStore} from "./stores/generalStore.ts";

const prompt = computed(() => `create JSON form of 20 commonly bought groceries,
         pint of beer in a bar, cocktail, gym month membership, one time entry in a gym,
         airbnb prices per night and one night bed in a shared dormitory in ${selectedCountry.value}, ${selectedCity.value || ''}.
         JSON form should be {"GROCERIES": [{"name (weight or quantity info)", "price"}], "OTHERS": [{"name", "price"}]}`)

const productsStore = useProductsStore();
// const { products, error, loading, loadProducts } = useProductsStore(); LOSE REACTIVITY

const generalStore = useGeneralStore();

const selectedCountry = ref<string | number | null>(null);
const selectedCity = ref<string | number | null>(null);

const selectedCountryObj = computed<ICountry | null>(() => {
    return generalStore.countries.find(country => country.name === selectedCountry.value) || null
})
const selectedCityObj = computed<ICity | null>(() => {
    return generalStore.cities.find(country => country.name === selectedCity.value) || null
})

const args = computed<{countryId: number | undefined, cityId: number | undefined, prompt: string}>(() => {
    return {
        countryId: selectedCountryObj.value?.id,
        cityId: selectedCityObj.value?.id,
        prompt: prompt.value
    }
})

onMounted(async () => await generalStore.loadCountries())
watch( () => selectedCountry.value, async () => {
    if ("id" in selectedCountryObj.value) {
        await generalStore.loadCities(selectedCountryObj.value.id)
    }
})

const textInput = ref<string>('')
const streamText = ref<string>('')
const sendChatStreamMessage = async (message: string) => {
    const response = await fetch('http://localhost:3000/api/chatStream', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: { 'Content-Type': 'application/json'}
    })

    if (!response.body) {
        streamText.value = 'Error: not possible to get the streamed response'
        console.error('No response body');
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        console.log(await reader.read())
        const { done, value } = await reader.read();
        if (done) break;

        streamText.value += decoder.decode(value, { stream: true });
        console.log(`Received chunk: ${streamText.value}`);
    }
};
</script>

<template>
    <div>
        <h1>Costly</h1>
        <p>Search most commonly bought groceries and its prices in your location or location you want to visit</p>

        <div class="wrapper-control">
            <div class="wrapper-control__inputs">
                <SelectInput
                        label="Select a Country"
                        :options="generalStore.countries"
                        v-model="selectedCountry"
                />
                <SelectInput
                        label="Select a City"
                        :options="generalStore.cities"
                        v-model="selectedCity"
                        :disabled="!selectedCountry"
                />
            </div>
            <div class="wrapper-control__button">
                <ButtonBasic :disabled="!selectedCountry || productsStore.loading"
                             @click="productsStore.loadProducts(args)">Search</ButtonBasic>
            </div>
        </div>

        <div class="wrapper-stream">
            <div class="wrapper-stream__controls">
                <input placeholder="Ask a question to get a streamed response"
                       v-model="textInput"/>
                <ButtonBasic :disabled="!textInput"
                             @click="sendChatStreamMessage(textInput)">Ask</ButtonBasic>
            </div>

            <div class="wrapper-stream__output">
                <p>{{streamText ? streamText : 'Ask me something and I will respond with stream'}}</p>
            </div>
        </div>

        <div class="wrapper-data">
            <div v-if="productsStore.loading" class="loader">
                Data is about to be shown, <b>please wait...</b>
            </div>
            <div v-if="productsStore.error" class="error">{{ productsStore.error }}</div>
            <template v-if="productsStore.products">
                    <p>Current avg prices in <b>{{selectedCity ? `${selectedCity}, ${selectedCountry}` : selectedCountry}}</b>.</p>
                    <div class="wrapper-data__table">
                        <TableDisplay v-for="(product, category) in productsStore.products"
                                      :data="product"  :category="category"
                                      :key="'table ' + category"/>
                    </div>
            </template>
        </div>
    </div>
</template>

<style scoped lang="scss">
.error {
    color: red;
}

.loader {
    margin-top: 2rem;
}

.wrapper-data {
    border-top: 1px solid black;
    padding-top: 1rem;

    &__table {
        margin: 1rem 0 2rem;
        display: flex;
        justify-content: space-between;
    }
}

.wrapper-control {
    display: flex;
    justify-content: space-between;
    margin: 3rem 0 1rem;

    &__inputs {
        display: flex;

        .select-input {
            max-width: 220px;

            :deep(label) {
                position: relative;
                top: -5px;
            }
        }
    }

    &__button {
        display: flex;

        :deep(button) {
            width: 160px;
        }
    }
}

.wrapper-stream {
    width: 100%;
    background: black;
    border-radius: 1rem;
    margin: 3rem 0 1rem;

    &__controls {
        display: flex;
        position: relative;
        top: 1rem;
        left: 1rem;

        input {
            border-radius: .5rem;
            padding: 0.5rem 1rem;
            margin-right: 1rem;
            background: #ffffff;
            color: #000000;
        }
    }

    &__output {
        text-align: left;
        display: flex;
        padding: 0.75rem 1.25rem 1rem;
    }
}
</style>
