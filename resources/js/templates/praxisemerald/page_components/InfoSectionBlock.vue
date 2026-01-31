<script lang="ts">
import type { Component } from 'vue';
import InfoSectionBlockEditor from './editors/InfoSectionBlockEditor.vue';

export const meta = {
    type: 'infosection',
    label: 'Info-Abschnitte',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        items: [{ title: '', icon: 'Info', content: '', isList: false }],
    },
};
export const Editor = InfoSectionBlockEditor as Component;
</script>

<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps<{ data: Record<string, unknown> }>();

const items = () => (Array.isArray(props.data.items) ? props.data.items : []) as { title: string; icon: string; content: string; isList: boolean }[];

const invalidIconNames = new Set(['Icon', 'createLucideIcon']);
function iconComponent(name: string) {
    if (invalidIconNames.has(name)) return LucideIcons.Info;
    const icons = LucideIcons as unknown as Record<string, (typeof LucideIcons)['Info']>;
    return icons[name] ?? LucideIcons.Info;
}

function parseContent(content: string): string[] {
    return String(content ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
}
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-4">
                <div
                    v-for="(info, i) in items()"
                    :key="i"
                    class="rounded-lg border bg-white p-4 shadow-sm"
                >
                    <h3 class="flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <component :is="iconComponent(info.icon)" class="h-5 w-5 shrink-0" style="color: var(--primary-dark)" aria-hidden="true" />
                        {{ info.title || 'Titel' }}
                    </h3>
                    <div class="mt-3 text-sm text-slate-700">
                        <ul v-if="info.isList" class="list-inside list-disc space-y-1">
                            <li v-for="(line, j) in parseContent(info.content)" :key="j">{{ line }}</li>
                        </ul>
                        <template v-else>
                            <p v-for="(line, j) in parseContent(info.content)" :key="j">{{ line }}</p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <p v-if="!items().length" class="text-sm text-slate-500">Abschnitte im Kontext-Panel hinzufügen.</p>
    </div>
</template>
