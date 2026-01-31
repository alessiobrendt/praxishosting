<script lang="ts">
export const meta = {
    type: 'stats',
    label: 'Statistik',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        value1: '15',
        label1: 'Jahre Erfahrung',
        value2: '5000+',
        label2: 'Patienten',
        value3: '24',
        label3: 'Stunden',
        value4: '100%',
        label4: 'Engagement',
    },
    fields: [
        { key: 'value1', label: 'Wert 1', type: 'text' as const },
        { key: 'label1', label: 'Label 1', type: 'text' as const },
        { key: 'value2', label: 'Wert 2', type: 'text' as const },
        { key: 'label2', label: 'Label 2', type: 'text' as const },
        { key: 'value3', label: 'Wert 3', type: 'text' as const },
        { key: 'label3', label: 'Label 3', type: 'text' as const },
        { key: 'value4', label: 'Wert 4', type: 'text' as const },
        { key: 'label4', label: 'Label 4', type: 'text' as const },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();

const stats = () => [
    { value: props.data.value1, label: props.data.label1 },
    { value: props.data.value2, label: props.data.label2 },
    { value: props.data.value3, label: props.data.label3 },
    { value: props.data.value4, label: props.data.label4 },
];
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div
                v-for="(stat, i) in stats()"
                :key="i"
                class="text-center"
            >
                <div class="text-2xl font-bold sm:text-3xl" style="color: var(--primary)">
                    {{ stat.value }}
                </div>
                <div class="mt-1 text-sm" style="color: var(--tertiary)">
                    {{ stat.label }}
                </div>
            </div>
        </div>
    </div>
</template>
