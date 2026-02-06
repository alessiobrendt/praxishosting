<script lang="ts">
export const meta = {
    type: 'divider',
    label: 'Trennlinie',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: { style: 'line', size: 'medium' },
    fields: [
        { key: 'style', label: 'Stil', type: 'select' as const, options: ['line', 'dotted', 'space'] },
        { key: 'size', label: 'Abstand', type: 'select' as const, options: ['small', 'medium', 'large'] },
    ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div
            :class="{
                'py-2': props.data.size === 'small',
                'py-4': props.data.size === 'medium',
                'py-8': props.data.size === 'large',
            }"
        >
            <hr
                v-if="props.data.style === 'line'"
                class="border-t"
                style="border-color: var(--border)"
            />
            <hr
                v-else-if="props.data.style === 'dotted'"
                class="border-t border-dotted"
                style="border-color: var(--border)"
            />
        </div>
    </div>
</template>
