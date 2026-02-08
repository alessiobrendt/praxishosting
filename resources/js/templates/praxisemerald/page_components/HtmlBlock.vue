<script lang="ts">
export const meta = {
    type: 'htmlblock',
    label: 'HTML-Block',
    placement: 'above_main' as const,
    category: 'Sonstiges',
    defaultData: { html: '<p>Eigenes HTML hier.</p>' },
    fields: [
        { key: 'html', label: 'HTML', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 @sm:px-6">
        <div class="prose prose-sm max-w-none" v-html="String(props.data.html ?? '')" />
    </div>
</template>
