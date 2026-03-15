<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
}

const props = defineProps<Props>();

const cellClasses = computed(() =>
    cn(
        'p-4 align-middle text-gray-900 dark:text-gray-100',
        '[&:has([role=checkbox])]:pr-0',
        props.class,
    ),
);
</script>

<template>
    <td :class="cellClasses">
        <slot />
    </td>
</template>
