<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

type TextVariant = 'p' | 'span' | 'small';

interface Props {
    variant?: TextVariant;
    class?: string;
    muted?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'p',
    muted: false,
});

const baseClasses = 'text-gray-900 dark:text-gray-100';

const variantClasses: Record<TextVariant, string> = {
    p: 'text-base leading-7',
    span: 'text-base',
    small: 'text-sm',
};

const classes = computed(() =>
    cn(
        baseClasses,
        variantClasses[props.variant],
        props.muted && 'text-gray-600 dark:text-gray-400',
        props.class,
    ),
);
</script>

<template>
    <component :is="variant" :class="classes">
        <slot />
    </component>
</template>
