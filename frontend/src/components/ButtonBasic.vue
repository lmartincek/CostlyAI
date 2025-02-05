<template>
    <button
            :class="buttonClass"
            :type="type"
            :disabled="disabled"
            @click="handleClick"
    >
        <slot>{{ label }}</slot>
    </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Define props with default values and types
const props = defineProps({
    label: {
        type: String,
        default: 'Click Me',
    },
    type: {
        type: String,
        default: 'button',
    },
    buttonClass: {
        type: String,
        default: 'btn-primary',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

// Emit click event to parent
const emit = defineEmits(['click']);
const handleClick = () => {
    emit('click');
};
</script>

<style scoped>
button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #0056b3;
}
</style>
