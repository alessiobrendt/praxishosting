<script lang="ts">
export const meta = {
    type: 'buttongroup',
    label: 'Button-Gruppe',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        text1: 'Primär',
        href1: '#',
        variant1: 'primary',
        text2: 'Sekundär',
        href2: '#',
        variant2: 'outline',
    },
    fields: [
        { key: 'text1', label: 'Button 1 – Text', type: 'text' as const },
        { key: 'href1', label: 'Button 1 – Link', type: 'text' as const },
        { key: 'variant1', label: 'Button 1 – Variante', type: 'select' as const, options: ['primary', 'secondary', 'outline'] },
        { key: 'text2', label: 'Button 2 – Text', type: 'text' as const },
        { key: 'href2', label: 'Button 2 – Link', type: 'text' as const },
        { key: 'variant2', label: 'Button 2 – Variante', type: 'select' as const, options: ['primary', 'secondary', 'outline'] },
    ],
};
</script>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{ data: Record<string, unknown>; designMode?: boolean }>(),
    { designMode: false },
);

const btnClass = (variant: unknown) => {
    switch (variant) {
        case 'primary':
            return 'bg-primary text-primary-foreground hover:opacity-90';
        case 'secondary':
            return 'bg-secondary text-secondary-foreground hover:opacity-90';
        default:
            return 'border-2 border-primary text-primary hover:bg-primary/10';
    }
};
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div class="flex flex-wrap gap-3">
            <a
                :href="designMode ? '#' : String(props.data.href1 ?? '#')"
                class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
                :class="btnClass(props.data.variant1)"
                :style="props.data.variant1 === 'primary' ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : props.data.variant1 === 'secondary' ? { backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' } : { borderColor: 'var(--primary)', color: 'var(--primary)' }"
                @click="designMode && $event.preventDefault()"
            >
                {{ props.data.text1 || 'Button 1' }}
            </a>
            <a
                :href="designMode ? '#' : String(props.data.href2 ?? '#')"
                class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
                :class="btnClass(props.data.variant2)"
                :style="props.data.variant2 === 'primary' ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : props.data.variant2 === 'secondary' ? { backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' } : { borderColor: 'var(--primary)', color: 'var(--primary)' }"
                @click="designMode && $event.preventDefault()"
            >
                {{ props.data.text2 || 'Button 2' }}
            </a>
        </div>
    </div>
</template>
