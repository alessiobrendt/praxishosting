<script lang="ts">
export const meta = {
    type: 'timeline',
    label: 'Zeitleiste',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        title: 'Unsere Geschichte',
        year1: '2010',
        title1: 'Gründung',
        text1: '',
        year2: '2015',
        title2: 'Erweiterung',
        text2: '',
        year3: '2020',
        title3: 'Modernisierung',
        text3: '',
        year4: '2025',
        title4: 'Heute',
        text4: '',
    },
    fields: [
        { key: 'title', label: 'Überschrift', type: 'text' as const },
        { key: 'year1', label: 'Jahr 1', type: 'text' as const },
        { key: 'title1', label: 'Titel 1', type: 'text' as const },
        { key: 'text1', label: 'Text 1', type: 'textarea' as const },
        { key: 'year2', label: 'Jahr 2', type: 'text' as const },
        { key: 'title2', label: 'Titel 2', type: 'text' as const },
        { key: 'text2', label: 'Text 2', type: 'textarea' as const },
        { key: 'year3', label: 'Jahr 3', type: 'text' as const },
        { key: 'title3', label: 'Titel 3', type: 'text' as const },
        { key: 'text3', label: 'Text 3', type: 'textarea' as const },
        { key: 'year4', label: 'Jahr 4', type: 'text' as const },
        { key: 'title4', label: 'Titel 4', type: 'text' as const },
        { key: 'text4', label: 'Text 4', type: 'textarea' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();

const items = () => [
    { year: props.data.year1, title: props.data.title1, text: props.data.text1 },
    { year: props.data.year2, title: props.data.title2, text: props.data.text2 },
    { year: props.data.year3, title: props.data.title3, text: props.data.text3 },
    { year: props.data.year4, title: props.data.title4, text: props.data.text4 },
];
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 @sm:px-6">
        <h2 v-if="props.data.title" class="mb-6 text-xl font-semibold" style="color: var(--secondary)">
            {{ props.data.title }}
        </h2>
        <div class="relative border-l-2 pl-6" style="border-color: var(--primary)">
            <div
                v-for="(item, i) in items()"
                :key="i"
                class="relative mb-8 last:mb-0"
            >
                <span
                    class="absolute -left-[29px] flex h-4 w-4 rounded-full border-2"
                    style="border-color: var(--primary); background-color: var(--background)"
                />
                <span class="text-sm font-bold" style="color: var(--primary)">{{ item.year }}</span>
                <h3 class="mt-1 font-semibold" style="color: var(--secondary)">{{ item.title }}</h3>
                <p class="mt-1 text-sm" style="color: var(--tertiary)">{{ item.text }}</p>
            </div>
        </div>
    </div>
</template>
