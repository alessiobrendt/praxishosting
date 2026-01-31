<script setup lang="ts">
import { computed } from 'vue';
import type { GridComponentData } from '@/types/layout-components';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const gridData = computed((): Partial<GridComponentData> => props.data ?? {});

const gridStyle = computed(() => {
    const d = gridData.value;
    const style: Record<string, string> = {
        display: 'grid',
        gap: d.gap ?? '1rem',
    };
    if (d.columns) {
        style.gridTemplateColumns = d.columns;
    }
    if (d.rowGap) {
        style.rowGap = d.rowGap;
    }
    if (d.columnGap) {
        style.columnGap = d.columnGap;
    }
    return style;
});
</script>

<template>
    <div
        v-if="designMode"
        class="grid-block-design min-h-[2rem] w-full rounded border-2 border-dashed border-primary/50 bg-primary/5 py-2"
    >
        <span class="mb-1 block px-2 text-xs font-medium text-primary">Grid</span>
        <!-- Design mode: slot contains [drop zone, draggable, drop zone] from LayoutBlock; do NOT apply grid here so the draggable gets full width and can show its own grid. -->
        <div class="grid-block-inner grid-block-inner-design min-h-0 min-w-0 flex-1 flex flex-col px-2">
            <slot />
        </div>
    </div>
    <div v-else class="grid-block min-h-[2rem] w-full" :style="gridStyle">
        <slot />
    </div>
</template>
