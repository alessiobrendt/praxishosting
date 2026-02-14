<script lang="ts">
export const meta = {
    type: 'infobox',
    label: 'Infobox',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { type: 'info', title: 'Hinweis', text: '' },
    fields: [
        { key: 'type', label: 'Typ', type: 'select' as const, options: ['info', 'warning', 'tip'] },
        { key: 'title', label: 'Titel', type: 'text' as const },
        { key: 'text', label: 'Text', type: 'richtext' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();

const boxClass = () => {
    switch (props.data.type) {
        case 'warning':
            return 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/30';
        case 'tip':
            return 'border-primary/50 bg-primary/10 dark:bg-primary/20';
        default:
            return 'border-blue-500/50 bg-blue-50 dark:bg-blue-950/30';
    }
};
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 @sm:px-6">
        <div
            class="rounded-lg border-l-4 p-4"
            :class="boxClass()"
        >
            <h4 v-if="props.data.title" class="font-semibold" style="color: var(--secondary)">
                {{ props.data.title }}
            </h4>
            <div
                class="mt-1 text-sm prose prose-sm max-w-none"
                style="color: var(--tertiary)"
                v-html="props.data.text ? String(props.data.text) : '<p class=\'text-muted-foreground\'>Text hier eingeben…</p>'"
            />
        </div>
    </div>
</template>
