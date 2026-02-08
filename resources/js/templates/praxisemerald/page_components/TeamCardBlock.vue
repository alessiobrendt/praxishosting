<script lang="ts">
import type { Component } from 'vue';
import TeamCardBlockEditor from './editors/TeamCardBlockEditor.vue';

export const meta = {
    type: 'teamcard',
    label: 'Team-Karten',
    placement: 'above_main' as const,
    category: 'Inhalt',
    fieldsperRow: 3,
    defaultData: {
        items: [{ name: '', role: '', bio: '', image: '' }],
    },
};

export const Editor = TeamCardBlockEditor as Component;
</script>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ data: Record<string, unknown> }>();

const cols = computed(() => {
    const v = props.data.fieldsperRow;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) && n > 0 ? n : 3;
});

const items = () => (Array.isArray(props.data.items) ? props.data.items : []) as { name: string; role: string; bio: string; image: string }[];
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 @sm:px-6">
        <ul
            class="grid gap-6 grid-cols-1 sm:grid-cols-2 @sm:grid-cols-2 lg:[grid-template-columns @lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
            :style="{ '--cols': cols }"
        >
            <li
                v-for="(m, i) in items()"
                :key="i"
                class="rounded-lg border bg-white p-4 shadow-sm"
            >
                <div class="relative aspect-square overflow-hidden rounded-md">
                    <img
                        v-if="m.image"
                        :src="m.image"
                        :alt="`Portrait von ${m.name || 'Person'}`"
                        class="h-full w-full object-cover"
                        loading="lazy"
                    />
                    <div v-else class="flex h-full w-full items-center justify-center bg-muted/30 text-muted-foreground text-sm">
                        Bild
                    </div>
                </div>
                <h2 class="mt-4 text-lg font-semibold text-slate-900">{{ m.name || 'Name' }}</h2>
                <p class="text-sm" style="color: var(--primary-dark)">{{ m.role || 'Rolle' }}</p>
                <p class="mt-2 text-sm text-slate-700">{{ m.bio || 'Kurzbeschreibung' }}</p>
            </li>
        </ul>
        <p v-if="!items().length" class="text-sm text-slate-500">Personen im Kontext-Panel hinzufügen.</p>
    </div>
</template>
