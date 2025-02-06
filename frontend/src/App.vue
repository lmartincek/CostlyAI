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
         JSON form should be {"GROCERIES": [{"name (weight or quantity info)", "string_id", "price"}], "OTHERS": [{"name", "string_id", "price"}]}`)

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

const args = computed(() => {
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
</script>

<template>
    <div>
        <h1>Costly</h1>
        <p>Search most commonly bought groceries and its prices in your location or location you want to visit</p>

        <div class="wrapper">
            <div class="wrapper__inputs">
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
            <div class="wrapper__button">
                <ButtonBasic :disabled="!selectedCountry"
                             @click="productsStore.loadProducts(args)">Search</ButtonBasic>
            </div>
        </div>

        <div v-if="productsStore.loading">Loading...</div>
        <div v-if="productsStore.error" class="error">{{ productsStore.error }}</div>
        <template v-if="productsStore.products">
            <div class="wrapper-table">
                <TableDisplay v-for="(product, category) in productsStore.products"
                              :data="product"  :category="category"
                              :key="'table ' + category"/>
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.error {
    color: red;
}

.wrapper-table {
    margin: 2rem 0;
    display: flex;
    justify-content: space-between;
    max-width: 600px;
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
