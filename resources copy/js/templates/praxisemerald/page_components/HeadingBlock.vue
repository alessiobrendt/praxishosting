<script lang="ts">
export const meta = {
    type: 'heading',
    label: 'Überschrift',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { title: '', level: 'h2', subline: '', align: 'left' },
    fields: [
        { key: 'title', label: 'Titel', type: 'text' as const },
        { key: 'level', label: 'Ebene', type: 'select' as const, options: ['h1', 'h2', 'h3'] },
        { key: 'subline', label: 'Unterzeile', type: 'text' as const },
        { key: 'align', label: 'Ausrichtung', type: 'select' as const, options: ['left', 'center', 'right'] },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 @sm:px-6" :class="{ 'text-center': props.data.align === 'center', 'text-right': props.data.align === 'right' }">
        <component
            :is="props.data.level === 'h1' ? 'h1' : props.data.level === 'h3' ? 'h3' : 'h2'"
            class="font-semibold"
            :class="{
                'text-3xl': props.data.level === 'h1',
                'text-2xl': props.data.level === 'h2',
                'text-xl': props.data.level === 'h3',
            }"
            style="color: var(--secondary)"
        >
            {{ props.data.title || 'Überschrift' }}
        </component>
        <p v-if="props.data.subline" class="mt-1 text-base" style="color: var(--tertiary)">
            {{ props.data.subline }}
        </p>
    </div>
</template>
