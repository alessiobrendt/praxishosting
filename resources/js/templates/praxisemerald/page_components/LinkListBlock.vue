<script lang="ts">
export const meta = {
    type: 'linklist',
    label: 'Link-Liste',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { title: '', links: 'Startseite|/\nLeistungen|/leistungen' },
    fields: [
        { key: 'title', label: 'Titel', type: 'text' as const },
        { key: 'links', label: 'Links (eine Zeile pro Eintrag: Label|URL)', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{ data: Record<string, unknown>; designMode?: boolean }>(),
    { designMode: false },
);

const parsedLinks = computed(() => {
    const raw = String(props.data.links ?? '');
    return raw
        .split('\n')
        .map((line) => {
            const t = line.trim();
            if (!t) return null;
            const [label, url] = t.split('|').map((s) => s.trim());
            return { label: label ?? '', href: url ?? '#' };
        })
        .filter((x): x is { label: string; href: string } => x !== null && (x.label !== '' || x.href !== ''));
});
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <h3 v-if="props.data.title" class="mb-3 text-lg font-semibold" style="color: var(--secondary)">
            {{ props.data.title }}
        </h3>
        <ul class="space-y-2">
            <li v-for="(link, i) in parsedLinks" :key="i">
                <a
                    :href="designMode ? '#' : link.href"
                    class="underline transition-opacity hover:opacity-80"
                    style="color: var(--primary)"
                    @click="designMode && $event.preventDefault()"
                >
                    {{ link.label || link.href }}
                </a>
            </li>
        </ul>
    </div>
</template>
