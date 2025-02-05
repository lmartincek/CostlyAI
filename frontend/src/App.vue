<script setup lang="ts">
import ButtonBasic from "./components/ButtonBasic.vue";
import SelectInput from "./components/SelectInput.vue";
import HomeView from "./views/HomeView.vue";

import {ref} from "vue";

const selectedCountry = ref<string | number | null>(null);
const selectedCity = ref<string | number | null>(null);

const countryOptions = [
    { label: "Slovakia", value: "Slovakia" },
    { label: "Czech Republic", value: "Czech Republic" },
    { label: "Poland", value: "Poland" },
];

// TODO - dynamic cities depending on a choosen country
const cityOptions = [
    { label: "Bratislava", value: "Bratislava" },
    { label: "Zilina", value: "Zilina" },
    { label: "Trnava", value: "Trnava" },
];
</script>

<template>
    <div>
        <ButtonBasic :disabled="!selectedCountry">Search</ButtonBasic>
        <SelectInput
                label="Select a Country"
                :options="countryOptions"
                v-model="selectedCountry"
                defaultOptionLabel="Please select a color"
        />
        <SelectInput
                label="Select a City"
                :options="cityOptions"
                v-model="selectedCity"
                :disabled="!selectedCountry"
        />

<!--        TODO - add router view-->
        <HomeView/>
    </div>
</template>

<style scoped>

</style>
