<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'rectangular',
});

const variantClasses: Record<string, string> = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
};

const skeletonClasses = computed(() =>
    cn(
        'animate-pulse bg-gray-200 dark:bg-gray-800',
        variantClasses[props.variant],
        props.class,
    ),
);
</script>

<template>
    <div :class="skeletonClasses" />
</template>
