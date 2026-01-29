<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    for?: string;
    required?: boolean;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    required: false,
});

const labelClasses = computed(() =>
    cn(
        'text-sm font-medium leading-none text-gray-900 dark:text-gray-100',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        props.class,
    ),
);
</script>

<template>
    <label :for="for" :class="labelClasses">
        <slot />
        <span v-if="required" class="ml-1 text-red-500">*</span>
    </label>
</template>
