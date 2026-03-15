<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    class?: string;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
});

const itemClasses = computed(() =>
    cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-modern',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'focus:bg-gray-100 dark:focus:bg-gray-800',
        props.disabled && 'pointer-events-none opacity-50',
        props.class,
    ),
);
</script>

<template>
    <div :class="itemClasses" @click="$emit('click')">
        <slot />
    </div>
</template>
