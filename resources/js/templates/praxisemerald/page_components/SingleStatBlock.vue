<script lang="ts">
export const meta = {
    type: 'singlestat',
    label: 'Eine Kennzahl',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { value: '15', label: 'Jahre Erfahrung' },
    fields: [
        { key: 'value', label: 'Wert', type: 'text' as const },
        { key: 'label', label: 'Label', type: 'text' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 @sm:px-6">
        <div class="text-center">
            <div class="text-4xl font-bold sm:text-5xl @sm:text-5xl" style="color: var(--primary)">
                {{ props.data.value }}
            </div>
            <div class="mt-2 text-lg" style="color: var(--tertiary)">
                {{ props.data.label }}
            </div>
        </div>
    </div>
</template>
