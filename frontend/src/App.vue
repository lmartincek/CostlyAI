<script setup lang="ts">
import ButtonBasic from "./components/ButtonBasic.vue";
import SelectInput from "./components/SelectInput.vue";
import TableDisplay from "./components/TableDisplay.vue";

import { useProductsStore } from './stores/productsStore.ts';
import {computed, onMounted, ref, watch} from "vue";
import {ICity, ICountry, useGeneralStore} from "./stores/generalStore.ts";
import {fixAndParseJSON, groupProductsByCategory} from "./utils/objectHelpers.ts";

const prompt = computed(() => `
create only JSON, no text outside of JSON format, of 24 items in total.
10 commonly bought groceries with units (pc, kg, L),
8 commonly used services, meal in restaurant, pint of beer, gym membership
6 others such as transportation (with km range) or other available data
in ${selectedCity.value ? selectedCountry.value + ', ' + selectedCity.value : selectedCountry.value}.
JSON format should be
[
    {
        "name": string in english,
        "price": number in local currency,
        "category": "groceries" | "services" | "others",
    }
]
`)

const productsStore = useProductsStore();
const productsByCategory = computed(() => {
    if (productsStore.products) return groupProductsByCategory(productsStore.products)
    return []
})

function logGroups() {
    console.log(productsByCategory, 'hmm')
}
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

const args = computed<{country: ICountry | null, city: ICity | null, prompt: string}>(() => {
    return {
        country: selectedCountryObj.value,
        city: selectedCityObj.value,
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

//TODO rewrite later
//@ts-ignore
const parsedStreamText = computed<string>(() => streamText.value || "Ask me something and I will respond with stream")
const sendChatStreamMessage = async (message: string) => {
    if (streamText.value) streamText.value = ""

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
        const { done, value } = await reader.read();
        if (done) break;

        //@ts-ignore
        streamText.value += fixAndParseJSON(decoder.decode(value, { stream: true }))?.data?.choices?.[0]?.delta?.content || "";
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
                       @keydown.enter="sendChatStreamMessage(textInput)"
                       v-model="textInput"/>
                <ButtonBasic :disabled="!textInput"
                             @click="sendChatStreamMessage(textInput)">Ask</ButtonBasic>
            </div>

            <div class="wrapper-stream__output">
                <p>{{parsedStreamText}}</p>
            </div>
        </div>

        <div class="wrapper-data">
            <div v-if="productsStore.loading" class="loader">
                Data is about to be shown, <b>please wait...</b>
            </div>
            <div v-if="productsStore.error" class="error">{{ productsStore.error }}</div>
            <template v-if="productsStore.products">
                    <p v-if="productsStore.lastCountry">
                        Current avg prices in
                        <b>{{productsStore.lastCity
                        ? `${productsStore.lastCity}, ${productsStore.lastCountry}`
                        : productsStore.lastCountry}}
                        </b>.
                    </p>
                    <div class="wrapper-data__table">
                        <TableDisplay :data="productsStore.products"/>
                    </div>
            </template>

            <button @click="logGroups">log groups</button>
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
        padding: 1rem 1rem 0 1rem;

        input {
            border-radius: .5rem;
            padding: 0.5rem 1rem;
            margin-right: 1rem;
            background: #ffffff;
            color: #000000;
            width: 100%;
        }
    }

    &__output {
        text-align: left;
        display: flex;
        padding: 0 1.25rem 0;
    }
}
</style>
