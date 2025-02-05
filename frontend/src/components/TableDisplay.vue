<script setup lang="ts">
const props = defineProps(['data', 'category'])
</script>

<template>
    <div>
        <h2>{{category}}</h2>

        <table v-if="data" border="1">
            <thead>
            <tr>
                <th>Item</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
            <!-- Loop through main key-values -->
            <tr v-for="(value, key) in data" :key="key">
                <td>{{ value.name }}</td>
<!--                TODO - currency-->
                <td>{{ value.price.toFixed(2) }} $</td>
            </tr>
            </tbody>
        </table>

        <p v-else>No data available</p>
    </div>
</template>
