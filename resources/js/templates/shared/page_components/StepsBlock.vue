<script lang="ts">
export const meta = {
    type: 'steps',
    label: 'Prozess-Schritte',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        title: 'So funktioniert es',
        step1Title: 'Schritt 1',
        step1Text: '',
        step2Title: 'Schritt 2',
        step2Text: '',
        step3Title: 'Schritt 3',
        step3Text: '',
        step4Title: 'Schritt 4',
        step4Text: '',
    },
    fields: [
        { key: 'title', label: 'Überschrift', type: 'text' as const },
        { key: 'step1Title', label: 'Schritt 1 – Titel', type: 'text' as const },
        { key: 'step1Text', label: 'Schritt 1 – Text', type: 'textarea' as const },
        { key: 'step2Title', label: 'Schritt 2 – Titel', type: 'text' as const },
        { key: 'step2Text', label: 'Schritt 2 – Text', type: 'textarea' as const },
        { key: 'step3Title', label: 'Schritt 3 – Titel', type: 'text' as const },
        { key: 'step3Text', label: 'Schritt 3 – Text', type: 'textarea' as const },
        { key: 'step4Title', label: 'Schritt 4 – Titel', type: 'text' as const },
        { key: 'step4Text', label: 'Schritt 4 – Text', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();

const steps = () => [
    { title: props.data.step1Title, text: props.data.step1Text },
    { title: props.data.step2Title, text: props.data.step2Text },
    { title: props.data.step3Title, text: props.data.step3Text },
    { title: props.data.step4Title, text: props.data.step4Text },
];
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <h2 v-if="props.data.title" class="mb-6 text-xl font-semibold" style="color: var(--secondary)">
            {{ props.data.title }}
        </h2>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div
                v-for="(step, i) in steps()"
                :key="i"
                class="relative rounded-lg border p-4"
                style="border-color: var(--border); color: var(--tertiary)"
            >
                <span
                    class="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                    style="background-color: var(--primary)"
                >
                    {{ i + 1 }}
                </span>
                <h3 class="mt-2 font-semibold" style="color: var(--secondary)">
                    {{ step.title }}
                </h3>
                <p class="mt-1 text-sm">{{ step.text }}</p>
            </div>
        </div>
    </div>
</template>
