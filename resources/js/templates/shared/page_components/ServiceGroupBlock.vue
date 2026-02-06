<script lang="ts">
import type { Component } from 'vue';
import ServiceGroupBlockEditor from './editors/ServiceGroupBlockEditor.vue';

export const meta = {
    type: 'servicegroup',
    label: 'Leistungsgruppen',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        groups: [{ title: '', icon: 'CheckCircle2', items: '' }],
    },
};
export const Editor = ServiceGroupBlockEditor as Component;
</script>

<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps<{ data: Record<string, unknown> }>();

const groups = () => (Array.isArray(props.data.groups) ? props.data.groups : []) as { title: string; icon: string; items: string }[];

const invalidIconNames = new Set(['Icon', 'createLucideIcon']);
function iconComponent(name: string) {
    if (invalidIconNames.has(name)) return LucideIcons.CheckCircle2;
    const icons = LucideIcons as unknown as Record<string, (typeof LucideIcons)['CheckCircle2']>;
    return icons[name] ?? LucideIcons.CheckCircle2;
}

function parseItems(items: string): string[] {
    return String(items ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
}
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2" style="justify-items: start;">
            <div
                v-for="(g, i) in groups()"
                :key="i"
                class="w-fit min-w-0 max-w-full rounded-lg border bg-white p-5 shadow-sm"
            >
                <div class="mb-3 flex items-center gap-2">
                    <component :is="iconComponent(g.icon)" class="h-5 w-5 shrink-0" style="color: var(--primary-dark)" aria-hidden="true" />
                    <h2 class="text-lg font-semibold text-slate-900">{{ g.title || 'Titel' }}</h2>
                </div>
                <ul class="list-inside list-disc space-y-1 text-slate-700">
                    <li v-for="(item, j) in parseItems(g.items)" :key="j" class="text-sm">{{ item }}</li>
                </ul>
            </div>
        </div>
        <p v-if="!groups().length" class="text-sm text-slate-500">Gruppen im Kontext-Panel hinzufügen.</p>
    </div>
</template>
