<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const props = withDefaults(defineProps<Props>(), {
    as: 'h3',
});

const titleClasses = computed(() =>
    cn('text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100', props.class),
);
</script>

<template>
    <component :is="as" :class="titleClasses">
        <slot />
    </component>
</template>
