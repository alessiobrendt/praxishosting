<script lang="ts">
import type { Component } from 'vue';
import AccordionBlockEditor from './editors/AccordionBlockEditor.vue';

export const meta = {
    type: 'accordion',
    label: 'FAQ / Accordion',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        items: [{ question: '', answer: '' }],
    },
};
export const Editor = AccordionBlockEditor as Component;
</script>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ data: Record<string, unknown> }>();

const items = () => (Array.isArray(props.data.items) ? props.data.items : []) as { question: string; answer: string }[];

const openIndex = ref<number | null>(null);

function toggle(i: number) {
    openIndex.value = openIndex.value === i ? null : i;
}
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div class="flex flex-col gap-4">
            <div
                v-for="(faq, i) in items()"
                :key="i"
                class="rounded-lg border bg-white"
            >
                <button
                    type="button"
                    class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-900 hover:bg-slate-50"
                    @click="toggle(i)"
                >
                    <span>{{ faq.question || 'Frage' }}</span>
                    <span class="text-slate-500">{{ openIndex === i ? '−' : '+' }}</span>
                </button>
                <div v-show="openIndex === i" class="border-t px-4 py-3 text-sm text-slate-700">
                    {{ faq.answer || 'Antwort' }}
                </div>
            </div>
        </div>
        <p v-if="!items().length" class="text-sm text-slate-500">Einträge im Kontext-Panel hinzufügen.</p>
    </div>
</template>
