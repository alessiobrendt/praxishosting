<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface Props {
    variant?: BadgeVariant;
    size?: BadgeSize;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'md',
});

const baseClasses = 'inline-flex items-center rounded-full font-medium transition-modern';

const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
};

const sizeClasses: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
};

const classes = computed(() =>
    cn(baseClasses, variantClasses[props.variant], sizeClasses[props.size], props.class),
);
</script>

<template>
    <span :class="classes">
        <slot />
    </span>
</template>
