<script lang="ts">
export const meta = {
    type: 'logorow',
    label: 'Logo-Leiste',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { title: '', urls: '' },
    fields: [
        { key: 'title', label: 'Überschrift', type: 'text' as const },
        { key: 'urls', label: 'Logo-URLs (eine Zeile pro Bild)', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ data: Record<string, unknown> }>();

const urls = computed(() => {
    const raw = String(props.data.urls ?? '');
    return raw
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
});
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 @sm:px-6">
        <h3 v-if="props.data.title" class="mb-4 text-center text-lg font-semibold" style="color: var(--secondary)">
            {{ props.data.title }}
        </h3>
        <div class="flex flex-wrap items-center justify-center gap-8">
            <img
                v-for="(url, i) in urls"
                :key="i"
                :src="url"
                :alt="`Logo ${i + 1}`"
                class="h-12 w-auto object-contain opacity-80 grayscale hover:opacity-100 hover:grayscale-0"
            />
        </div>
    </div>
</template>
