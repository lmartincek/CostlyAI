<template>
    <div class="select-input">
        <label :for="id" class="select-label">{{ label }}</label>
        <select
            :id="id"
            v-model="selectedValue"
            @change="handleChange"
            :disabled="disabled"
            class="select-input"
        >
            <option
                :value="null"
                disabled
                selected
            >
                {{ defaultOptionLabel }}
            </option>
<!--            TODO - rewrite to more abstract -->
            <option
                v-for="option in options"
                :key="option.code"
                :value="option.name"
            >
                {{ option.name }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// Define props for the component
const props = defineProps({
    label: {
        type: String,
        default: 'Select an option',
    },
    options: {
        type: Array as () => Array<{ id: number, name: string, code: string }>,
        required: true,
    },
    defaultOptionLabel: {
        type: String,
        default: 'Select an option...',
    },
    id: {
        type: String,
        default: 'select-input',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

// Reactive variable to hold the selected value
const selectedValue = ref<any>(null);

// Emit event when value changes
const emit = defineEmits(['update:modelValue']);
const handleChange = () => {
    emit('update:modelValue', selectedValue.value);
};

// Watch the selected value (Optional: could be useful for custom logic)
watch(selectedValue, (newValue) => {
    console.log("Selected value changed to: ", newValue);
});
</script>

<style scoped>
select {
    margin: 0 10px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
}

option:disabled {
    color: #aaa;
}

.select-label {
    font-weight: bold;
}
</style>
