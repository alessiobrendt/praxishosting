<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface Props {
    level?: HeadingLevel;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    level: 'h2',
});

const headingClasses: Record<HeadingLevel, string> = {
    h1: 'text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100',
    h2: 'text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100',
    h3: 'text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100',
    h4: 'text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100',
    h5: 'text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100',
    h6: 'text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100',
};

const classes = computed(() =>
    cn(headingClasses[props.level], props.class),
);
</script>

<template>
    <component :is="level" :class="classes">
        <slot />
    </component>
</template>
