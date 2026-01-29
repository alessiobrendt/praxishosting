<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    as?: 'button' | 'a';
    class?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    size: 'md',
    as: 'button',
    type: 'button',
    disabled: false,
});

const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-modern disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2';

const variantClasses: Record<ButtonVariant, string> = {
    default: 'gradient-primary text-white shadow-emerald hover:shadow-emerald/80 active:scale-[0.98] dark:shadow-emerald/50',
    outline: 'border-2 border-gray-300 bg-white text-gray-900 shadow-modern hover:bg-gray-50 hover:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    ghost: 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800',
    destructive: 'bg-red-600 text-white shadow-modern-md hover:bg-red-700 active:scale-[0.98] dark:bg-red-600 dark:hover:bg-red-700',
    link: 'text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'h-10 w-10',
};

const classes = computed(() =>
    cn(baseClasses, variantClasses[props.variant], sizeClasses[props.size], props.class),
);
</script>

<template>
    <component
        :is="as"
        :class="classes"
        :type="as === 'button' ? type : undefined"
        :disabled="disabled"
    >
        <slot />
    </component>
</template>
