<script lang="ts">
import type { Component } from 'vue';
import NewsCardBlockEditor from './editors/NewsCardBlockEditor.vue';

export const meta = {
    type: 'newscard',
    label: 'Aktuelles / News-Karten',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        items: [
            { title: '', date: '', excerpt: '', image: '', href: '' },
        ],
    },
};
export const Editor = NewsCardBlockEditor as Component;
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();

const items = () => (Array.isArray(props.data.items) ? props.data.items : []) as { title: string; date: string; excerpt: string; image: string; href: string }[];
</script>

<template>
    <section class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <ul class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <li
                v-for="(p, i) in items()"
                :key="i"
                class="rounded-lg border bg-white p-4 shadow-sm"
            >
                <div class="relative aspect-[3/2] overflow-hidden rounded-t-lg">
                    <img
                        v-if="p.image"
                        :src="p.image"
                        :alt="p.title || 'News'"
                        class="h-full w-full object-cover"
                    />
                    <div v-else class="flex h-full w-full items-center justify-center bg-muted/30 text-muted-foreground text-sm">
                        Bild
                    </div>
                </div>
                <div class="p-4">
                    <p v-if="p.date" class="text-xs text-slate-500">{{ new Date(p.date).toLocaleDateString('de-DE') }}</p>
                    <h2 class="mt-1 text-lg font-semibold text-slate-900">{{ p.title || 'Titel' }}</h2>
                    <p class="mt-1 text-sm text-slate-700">{{ p.excerpt || 'Kurzbeschreibung' }}</p>
                    <a v-if="p.href" :href="p.href" class="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline">
                        Mehr lesen
                    </a>
                </div>
            </li>
        </ul>
        <p v-if="!items().length" class="text-sm text-slate-500">Einträge im Kontext-Panel hinzufügen.</p>
    </section>
</template>
