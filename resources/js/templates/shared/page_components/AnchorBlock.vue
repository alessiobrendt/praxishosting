<script lang="ts">
export const meta = {
    type: 'anchor',
    label: 'Sprungmarke',
    placement: 'above_main' as const,
    category: 'Sonstiges',
    defaultData: { id: 'anker', label: '' },
    fields: [
        { key: 'id', label: 'ID (für Anker-Links)', type: 'text' as const },
        { key: 'label', label: 'Label (nur für Sidebar)', type: 'text' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div
        :id="String(props.data.id || '')"
        class="relative -top-4"
        :aria-label="props.data.label ? String(props.data.label) : undefined"
    >
        <span v-if="props.data.label" class="sr-only">{{ props.data.label }}</span>
    </div>
</template>
