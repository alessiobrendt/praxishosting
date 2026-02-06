<script setup lang="ts">
/**
 * Generische Komponente für beliebige JSON-Daten.
 * Rendert je nach data:
 * - html: v-html (nur vertrauenswürdige Inhalte verwenden)
 * - text: als Absatz
 * - className: als CSS-Klasse auf dem Wrapper
 * - Sonst: Block mit beliebigen data-* Attributen / Inhalt
 */
import { computed } from 'vue';

const props = defineProps<{
    data: Record<string, unknown>;
}>();

const html = computed(() => (typeof props.data?.html === 'string' ? props.data.html : ''));
const text = computed(() => (typeof props.data?.text === 'string' ? props.data.text : ''));
const className = computed(() => (typeof props.data?.className === 'string' ? props.data.className : ''));
const hasContent = computed(() => !!html.value || !!text.value);
</script>

<template>
    <section
        v-if="hasContent || Object.keys(data).length > 0"
        class="mx-auto max-w-6xl px-4 py-6 sm:px-6"
        :class="className"
    >
        <div v-if="html" class="prose prose-slate max-w-none" v-html="html" />
        <p v-else-if="text" class="text-slate-700">{{ text }}</p>
        <pre
            v-else
            class="overflow-auto rounded-md border bg-slate-50 p-4 text-sm text-slate-600"
        >{{ JSON.stringify(data, null, 2) }}</pre>
    </section>
</template>
