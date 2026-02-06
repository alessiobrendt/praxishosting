<script lang="ts">
import type { Component } from 'vue';
import EmergencyCardBlockEditor from './editors/EmergencyCardBlockEditor.vue';

export const meta = {
    type: 'emergencycard',
    label: 'Notfall-Karten',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        items: [
            { title: '', icon: 'Phone', highlight: '', desc: '', href: '' },
        ],
    },
};
export const Editor = EmergencyCardBlockEditor as Component;
</script>

<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps<{ data: Record<string, unknown> }>();

const items = () => (Array.isArray(props.data.items) ? props.data.items : []) as { title: string; icon: string; highlight: string; desc: string; href: string }[];

const invalidIconNames = new Set(['Icon', 'createLucideIcon']);
function iconComponent(name: string) {
    if (invalidIconNames.has(name)) return LucideIcons.Phone;
    const icons = LucideIcons as unknown as Record<string, (typeof LucideIcons)['Phone']>;
    return icons[name] ?? LucideIcons.Phone;
}
</script>
 
<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div class="space-y-4">
            <a
                v-for="(info, i) in items()"
                :key="i"
                :href="info.href || '#'"
                class="flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm transition hover:border-emerald-600"
            >
                <div class="flex items-center justify-between">
                    <component :is="iconComponent(info.icon)" class="h-5 w-5 shrink-0" style="color: var(--primary-dark)" aria-hidden="true" />
                    <span v-if="info.highlight" class="text-lg font-semibold" style="color: var(--primary-dark)">{{ info.highlight }}</span>
                </div>
                <h2 class="text-lg font-semibold text-slate-900">{{ info.title || 'Titel' }}</h2>
                <p class="text-sm text-slate-700">{{ info.desc || 'Beschreibung' }}</p>
            </a>
        </div>
        <p v-if="!items().length" class="text-sm text-slate-500">Karten im Kontext-Panel hinzufügen.</p>
    </div>
</template>
