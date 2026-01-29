<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
}

const props = defineProps<Props>();

const headerClasses = computed(() =>
    cn('border-b border-gray-200 dark:border-gray-800', props.class),
);
</script>

<template>
    <thead :class="headerClasses">
        <slot />
    </thead>
</template>
