<script lang="ts">
export const meta = {
    type: 'twocolumns',
    label: 'Zwei Spalten Text',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { heading: '', left: '', right: '' },
    fields: [
        { key: 'heading', label: 'Überschrift (optional)', type: 'text' as const },
        { key: 'left', label: 'Linke Spalte', type: 'textarea' as const },
        { key: 'right', label: 'Rechte Spalte', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 @sm:px-6">
        <h2 v-if="props.data.heading" class="mb-4 text-xl font-semibold" style="color: var(--secondary)">
            {{ props.data.heading }}
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 @sm:grid-cols-2">
            <div class="whitespace-pre-line text-base" style="color: var(--tertiary)">
                {{ props.data.left || 'Linke Spalte…' }}
            </div>
            <div class="whitespace-pre-line text-base" style="color: var(--tertiary)">
                {{ props.data.right || 'Rechte Spalte…' }}
            </div>
        </div>
    </div>
</template>
