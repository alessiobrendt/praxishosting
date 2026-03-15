<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
    hover?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    hover: false,
});

const cardClasses = computed(() =>
    cn(
        'rounded-xl border border-gray-200 bg-white shadow-modern',
        'dark:border-gray-800 dark:bg-gray-900',
        props.hover && 'transition-modern hover:shadow-modern-lg',
        props.class,
    ),
);
</script>

<template>
    <div :class="cardClasses">
        <slot />
    </div>
</template>
