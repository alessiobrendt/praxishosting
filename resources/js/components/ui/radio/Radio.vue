<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    modelValue?: string | number;
    value: string | number;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    id?: string;
    name?: string;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    required: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
}>();

const isChecked = computed(() => props.modelValue === props.value);

const radioClasses = computed(() =>
    cn(
        'h-4 w-4 rounded-full border-2 border-gray-300 bg-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-700 dark:bg-gray-800',
        'transition-modern',
        isChecked.value && 'border-emerald-700',
        props.class,
    ),
);

const innerClasses = computed(() =>
    cn(
        'absolute inset-0 m-auto h-2 w-2 rounded-full transition-modern',
        isChecked.value ? 'bg-emerald-700' : 'bg-transparent',
    ),
);
</script>

<template>
    <div class="relative inline-flex items-center">
        <input
            :id="id"
            :name="name"
            :value="value"
            type="radio"
            :checked="isChecked"
            :disabled="disabled"
            :required="required"
            class="sr-only peer"
            @change="emit('update:modelValue', value)"
        />
        <div :class="radioClasses">
            <div :class="innerClasses" />
        </div>
    </div>
</template>
