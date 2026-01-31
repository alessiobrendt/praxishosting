<script setup lang="ts">
import { computed } from 'vue';
import type {
    FlexContainerComponentData,
    SectionJustify,
    SectionAlign,
} from '@/types/layout-components';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const flexData = computed((): Partial<FlexContainerComponentData> => props.data ?? {});

function mapJustify(v: SectionJustify | undefined): string {
    const map: Record<string, string> = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        'space-between': 'space-between',
        'space-around': 'space-around',
    };
    return map[v ?? 'start'] ?? 'flex-start';
}

function mapAlign(v: SectionAlign | undefined): string {
    const map: Record<string, string> = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        stretch: 'stretch',
    };
    return map[v ?? 'stretch'] ?? 'stretch';
}

const flexStyle = computed(() => ({
    display: 'flex',
    flexDirection: flexData.value.direction === 'row' ? 'row' : 'column',
    flexWrap: flexData.value.wrap !== false ? 'wrap' : 'nowrap',
    gap: flexData.value.gap ?? '1rem',
    justifyContent: mapJustify(flexData.value.justify),
    alignItems: mapAlign(flexData.value.align),
}));
</script>

<template>
    <div
        v-if="designMode"
        class="flex-container-block-design min-h-[2rem] w-full rounded border-2 border-dashed border-primary/50 bg-primary/5 py-2"
    >
        <span class="mb-1 block px-2 text-xs font-medium text-primary">Flex</span>
        <div class="flex-container-inner min-h-0 min-w-0 flex-1 px-2" :style="flexStyle">
            <slot />
        </div>
    </div>
    <div v-else class="flex-container-block min-h-[2rem] w-full" :style="flexStyle">
        <slot />
    </div>
</template>
