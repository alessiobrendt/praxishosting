<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
}

const props = defineProps<Props>();

const headClasses = computed(() =>
    cn(
        'h-12 px-4 text-left align-middle font-medium text-gray-600 dark:text-gray-400',
        '[&:has([role=checkbox])]:pr-0',
        props.class,
    ),
);
</script>

<template>
    <th :class="headClasses">
        <slot />
    </th>
</template>
