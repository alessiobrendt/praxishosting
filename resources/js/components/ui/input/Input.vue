<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    type?: string;
    modelValue?: string | number;
    defaultValue?: string | number;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    id?: string;
    name?: string;
    autocomplete?: string;
    autofocus?: boolean;
    tabindex?: number;
    'aria-invalid'?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    disabled: false,
    required: false,
    autofocus: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
}>();

const value = computed({
    get: () => props.modelValue ?? props.defaultValue ?? '',
    set: (val) => emit('update:modelValue', val),
});

const inputClasses = computed(() =>
    cn(
        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
        'placeholder:text-gray-400',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:border-emerald-500',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
        'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
        'dark:focus-visible:ring-emerald-500 dark:focus-visible:border-emerald-500',
        'transition-modern',
        props['aria-invalid'] && 'border-red-500 focus-visible:ring-red-500 dark:border-red-500',
        props.class,
    ),
);
</script>

<template>
    <input
        :id="id"
        :name="name"
        :type="type"
        v-model="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :tabindex="tabindex"
        :aria-invalid="aria-invalid"
        :class="inputClasses"
    />
</template>
