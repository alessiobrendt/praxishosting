<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    modelValue?: string | number;
    defaultValue?: string | number;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    id?: string;
    name?: string;
    'aria-invalid'?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    required: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
}>();

const value = computed({
    get: () => props.modelValue ?? props.defaultValue ?? '',
    set: (val) => emit('update:modelValue', val),
});

const ariaInvalid = computed(() => props['aria-invalid']);

const selectClasses = computed(() =>
    cn(
        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:border-emerald-500',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
        'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
        'dark:focus-visible:ring-emerald-500 dark:focus-visible:border-emerald-500',
        'transition-modern',
        'appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10',
        'dark:bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%9ca3af\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")]',
        props['aria-invalid'] && 'border-red-500 focus-visible:ring-red-500 dark:border-red-500',
        props.class,
    ),
);
</script>

<template>
    <select
        :id="id"
        :name="name"
        v-model="value"
        :disabled="disabled"
        :required="required"
        :aria-invalid="ariaInvalid"
        :class="selectClasses"
    >
        <slot />
    </select>
</template>
