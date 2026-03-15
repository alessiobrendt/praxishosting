<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    striped?: boolean;
    hover?: boolean;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    striped: false,
    hover: true,
});

const bodyClasses = computed(() =>
    cn(
        '[&_tr:last-child]:border-0',
        props.striped && '[&_tr:nth-child(even)]:bg-gray-50 dark:[&_tr:nth-child(even)]:bg-gray-900/50',
        props.class,
    ),
);
</script>

<template>
    <tbody :class="bodyClasses">
        <slot />
    </tbody>
</template>
