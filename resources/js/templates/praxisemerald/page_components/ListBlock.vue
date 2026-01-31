<script lang="ts">
export const meta = {
    type: 'list',
    label: 'Liste',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { items: '', style: 'bullet' },
    fields: [
        { key: 'items', label: 'Einträge (eine Zeile = ein Punkt)', type: 'textarea' as const },
        { key: 'style', label: 'Stil', type: 'select' as const, options: ['bullet', 'numbered'] },
    ],
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ data: Record<string, unknown> }>();

const items = computed(() => {
    const raw = String(props.data.items ?? '');
    return raw
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
});
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <ol v-if="props.data.style === 'numbered'" class="list-decimal list-inside space-y-1 text-base" style="color: var(--tertiary)">
            <li v-for="(item, i) in items" :key="i">{{ item }}</li>
        </ol>
        <ul v-else class="list-disc list-inside space-y-1 text-base" style="color: var(--tertiary)">
            <li v-for="(item, i) in items" :key="i">{{ item }}</li>
        </ul>
        <p v-if="!items.length" class="text-sm" style="color: var(--tertiary)">Eine Zeile pro Listenpunkt eingeben.</p>
    </div>
</template>
