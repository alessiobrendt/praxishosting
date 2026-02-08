<script lang="ts">
export const meta = {
    type: 'button',
    label: 'Button',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { text: 'Button', href: '#', variant: 'primary' },
    fields: [
        { key: 'text', label: 'Text', type: 'text' as const },
        { key: 'href', label: 'Link', type: 'text' as const },
        { key: 'variant', label: 'Variante', type: 'select' as const, options: ['primary', 'secondary', 'outline'] },
    ],
};
</script>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{ data: Record<string, unknown>; designMode?: boolean }>(),
    { designMode: false },
);
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 @sm:px-6">
        <a
            :href="designMode ? '#' : String(props.data.href || '#')"
            @click="designMode && $event.preventDefault()"
            class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            :class="{
                'bg-primary text-primary-foreground hover:opacity-90': props.data.variant === 'primary',
                'bg-secondary text-secondary-foreground hover:opacity-90': props.data.variant === 'secondary',
                'border-2 border-primary text-primary hover:bg-primary/10': props.data.variant === 'outline',
            }"
            :style="props.data.variant === 'primary' ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : props.data.variant === 'secondary' ? { backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' } : { borderColor: 'var(--primary)', color: 'var(--primary)' }"
        >
            {{ props.data.text || 'Button' }}
        </a>
    </div>
</template>
