<script setup lang="ts">
// const props = defineProps(['data'])
defineProps(['data'])
</script>

<template>
    <div>
<!--        <h2>{{category}}</h2>-->

        <table v-if="data" border="1">
            <thead>
            <tr>
                <th>Item</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>

            <tr v-for="(value, key) in data" :key="key">
                <td>{{ value.name }}</td>
                <!-- TODO - currency based on country, add currency file-->
                <td>{{ Number(value.price).toFixed(2) }} $</td>
            </tr>
            </tbody>
        </table>

        <p v-else>No data available</p>
    </div>
</template>
