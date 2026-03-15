<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
}

const props = defineProps<Props>();

const footerClasses = computed(() =>
    cn('flex items-center justify-end gap-2 p-6 border-t border-gray-200 dark:border-gray-800', props.class),
);
</script>

<template>
    <div :class="footerClasses">
        <slot />
    </div>
</template>
