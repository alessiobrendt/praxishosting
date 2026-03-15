<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    hover?: boolean;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    hover: true,
});

const rowClasses = computed(() =>
    cn(
        'border-b border-gray-200 transition-modern dark:border-gray-800',
        props.hover && 'hover:bg-gray-50 dark:hover:bg-gray-900/50',
        props.class,
    ),
);
</script>

<template>
    <tr :class="rowClasses">
        <slot />
    </tr>
</template>
