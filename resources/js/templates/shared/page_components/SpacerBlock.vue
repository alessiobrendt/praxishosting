<script lang="ts">
export const meta = {
    type: 'spacer',
    label: 'Abstand',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { size: 'medium' },
    fields: [
        { key: 'size', label: 'Größe', type: 'select' as const, options: ['small', 'medium', 'large'] },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div
        class="w-full"
        :class="{
            'min-h-[1rem]': props.data.size === 'small',
            'min-h-[2.5rem]': props.data.size === 'medium',
            'min-h-[4rem]': props.data.size === 'large',
        }"
        aria-hidden="true"
    />
</template>
