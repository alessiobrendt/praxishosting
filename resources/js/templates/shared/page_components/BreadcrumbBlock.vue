<script lang="ts">
export const meta = {
    type: 'breadcrumb',
    label: 'Breadcrumb',
    placement: 'above_main' as const,
    category: 'Navigation & Layout',
    defaultData: { items: 'Startseite|/\nAktuelle Seite' },
    fields: [
        { key: 'items', label: 'Einträge (eine Zeile pro Eintrag: Label|URL, letzte Zeile ohne URL = aktuell)', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{ data: Record<string, unknown>; designMode?: boolean }>(),
    { designMode: false },
);

const parsedItems = computed(() => {
    const raw = String(props.data.items ?? '');
    return raw
        .split('\n')
        .map((line) => {
            const t = line.trim();
            if (!t) return null;
            const parts = t.split('|').map((s) => s.trim());
            return { label: parts[0] ?? '', href: parts[1] ?? '' };
        })
        .filter((x): x is { label: string; href: string } => x !== null && x.label !== '');
});
</script>

<template>
    <nav class="mx-auto max-w-6xl px-4 py-2 sm:px-6" aria-label="Breadcrumb">
        <ol class="flex flex-wrap items-center gap-1 text-sm" style="color: var(--tertiary)">
            <template v-for="(item, i) in parsedItems" :key="i">
                <li v-if="i > 0" class="flex items-center">
                    <ChevronRight class="h-4 w-4 shrink-0" />
                </li>
                <li class="flex items-center">
                    <a
                        v-if="item.href"
                        :href="designMode ? '#' : item.href"
                        class="underline hover:opacity-80"
                        style="color: var(--primary)"
                        @click="designMode && $event.preventDefault()"
                    >
                        {{ item.label }}
                    </a>
                    <span v-else class="font-medium" style="color: var(--secondary)">
                        {{ item.label }}
                    </span>
                </li>
            </template>
        </ol>
    </nav>
</template>
