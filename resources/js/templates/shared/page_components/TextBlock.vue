<script lang="ts">
export const meta = {
    type: 'text',
    label: 'Text',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { content: '', align: 'left' },
    fields: [
        { key: 'content', label: 'Inhalt', type: 'textarea' as const },
        {
            key: 'align',
            label: 'Ausrichtung',
            type: 'select' as const,
            options: ['left', 'center', 'right'],
        },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <p
            class="text-base text-slate-600 dark:text-slate-400"
            :class="{
                'text-center': props.data.align === 'center',
                'text-right': props.data.align === 'right',
            }"
        >
            {{ props.data.content || 'Text hier eingeben…' }}
        </p>
    </div>
</template>
