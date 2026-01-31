<script lang="ts">
export const meta = {
    type: 'quote',
    label: 'Zitat',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { text: '', author: '' },
    fields: [
        { key: 'text', label: 'Zitattext', type: 'textarea' as const },
        { key: 'author', label: 'Autor (optional)', type: 'text' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <blockquote class="border-l-4 pl-4" style="border-color: var(--primary); color: var(--tertiary)">
            <p class="text-lg italic">{{ props.data.text || 'Zitat hier eingeben…' }}</p>
            <cite v-if="props.data.author" class="mt-2 block text-sm not-italic" style="color: var(--secondary)">
                — {{ props.data.author }}
            </cite>
        </blockquote>
    </div>
</template>
