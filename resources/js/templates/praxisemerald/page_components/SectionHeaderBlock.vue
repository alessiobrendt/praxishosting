<script lang="ts">
export const meta = {
    type: 'sectionheader',
    label: 'Abschnittsüberschrift',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { title: '', subtitle: '' },
    fields: [
        { key: 'title', label: 'Titel', type: 'text' as const },
        { key: 'subtitle', label: 'Untertitel', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <header class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <h1 class="text-2xl font-semibold text-slate-900 sm:text-3xl" style="color: var(--secondary)">
            {{ props.data.title || 'Titel' }}
        </h1>
        <p v-if="props.data.subtitle" class="mt-2 text-slate-600" style="color: var(--tertiary)">
            {{ props.data.subtitle }}
        </p>
    </header>
</template>
