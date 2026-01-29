<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface Props {
    size?: SpinnerSize;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
});

const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
};

const spinnerClasses = computed(() =>
    cn(
        'animate-spin rounded-full border-emerald-700 border-t-transparent',
        sizeClasses[props.size],
        props.class,
    ),
);
</script>

<template>
    <div :class="spinnerClasses" role="status" aria-label="Loading">
        <span class="sr-only">Loading...</span>
    </div>
</template>
