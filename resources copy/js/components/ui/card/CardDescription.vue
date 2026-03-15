<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
}

const props = defineProps<Props>();

const descClasses = computed(() =>
    cn('text-sm text-gray-600 dark:text-gray-400', props.class),
);
</script>

<template>
    <p :class="descClasses">
        <slot />
    </p>
</template>
