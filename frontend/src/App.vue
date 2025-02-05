<script setup lang="ts">
import ButtonBasic from "./components/ButtonBasic.vue";
import SelectInput from "./components/SelectInput.vue";
import TableDisplay from "./components/TableDisplay.vue";

import { useDataStore } from './stores/dataStore.ts';
import {computed, ref} from "vue";

const prompt = computed(() => `create JSON form of 20 commonly bought groceries,
 pint of beer in a bar, cocktail, gym month membership, one time entry in a gym,
 airbnb prices per night and one night bed in a shared dormitory in ${selectedCountry.value}, ${selectedCity.value || ''}.
 JSON form should be {"GROCERIES": [{"name (weight or quantity info)", "string_id", "price"}], "OTHERS": [{"name", "string_id", "price"}]}`)

const store = useDataStore();
// const { data, error, loading, loadData } = useDataStore(); LOSE REACTIVITY

const selectedCountry = ref<string | number | null>(null);
const selectedCity = ref<string | number | null>(null);

const countryOptions = [
    { label: "Slovakia", value: "Slovakia" },
    { label: "Czech Republic", value: "Czech_Republic" },
    { label: "Poland", value: "Poland" },
];

// TODO - dynamic cities depending on a choosen country
const cityOptions = {
    Slovakia: [
        { label: "Bratislava", value: "Bratislava" },
        { label: "Zilina", value: "Zilina" },
        { label: "Trnava", value: "Trnava" },
    ],
    Czech_Republic: [
        { label: "Brno", value: "Brno" },
        { label: "Praha", value: "Praha" },
        { label: "Ostrava", value: "Ostrava" },
    ],
    Poland: [
        { label: "Krakow", value: "Krakow" },
        { label: "Wroclaw", value: "Wroclaw" },
        { label: "Katowice", value: "Katowice" },
    ]
}
</script>

<template>
    <div>
        <h1>Costly</h1>
        <p>Search most commonly bought groceries and its prices in your location or location you want to visit</p>

        <div class="wrapper">
            <div class="wrapper__inputs">
                <SelectInput
                        label="Select a Country"
                        :options="countryOptions"
                        v-model="selectedCountry"
                        defaultOptionLabel="Please select a color"
                />
                <SelectInput
                        label="Select a City"
                        :options="cityOptions[selectedCountry]"
                        v-model="selectedCity"
                        :disabled="!selectedCountry"
                />
            </div>
            <div class="wrapper__button">
                <ButtonBasic :disabled="!selectedCountry"
                             @click="store.loadData(prompt)">Search</ButtonBasic>
            </div>
        </div>


        <div v-if="store.loading">Loading...</div>
        <div v-if="store.error" class="error">{{ store.error }}</div>
        <template v-if="store.data">
            <TableDisplay v-for="(data, i) in store.data"
                          :data="data"  :category="i"
                          :key="'table' + i"/>
        </template>
    </div>
</template>

<style scoped lang="scss">
.error {
    color: red;
}

.wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 50px;

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
</style>
