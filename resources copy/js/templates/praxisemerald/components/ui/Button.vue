<script setup lang="ts">
import { inject, computed } from 'vue';

const props = defineProps<{
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}>();

const injectedButtonStyle = inject<{ variant?: string; radius?: string; size?: string } | { value: { variant?: string; radius?: string; size?: string } }>('globalButtonStyle', {});
const globalButtonStyle = computed(() => ('value' in injectedButtonStyle ? injectedButtonStyle.value : injectedButtonStyle));

const effectiveVariant = computed(() => {
    const g = globalButtonStyle.value;
    const v = props.variant ?? g?.variant ?? 'default';
    return v as keyof typeof variants.variant;
});
const effectiveSize = computed(() => {
    const g = globalButtonStyle.value;
    const s = props.size ?? g?.size ?? 'default';
    return s as keyof typeof variants.size;
});
const radiusClass = computed(() => {
    const r = globalButtonStyle.value?.radius ?? 'md';
    const map: Record<string, string> = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    };
    return map[r] ?? 'rounded-md';
});

const variants = {
    variant: {
        default: 'shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground',
        destructive:
            'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
            'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
    },
};
</script>

<template>
    <div>
        <button
            :class="[
                variants.variant[effectiveVariant],
                variants.size[effectiveSize],
                radiusClass,
                'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            ]"
        >
            <slot />
        </button>
    </div>
</template>
