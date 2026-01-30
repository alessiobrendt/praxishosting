<script setup lang="ts">
import { computed } from 'vue';
import type { SectionComponentData, SectionJustify, SectionAlign } from '@/types/layout-components';

const props = defineProps<{
    data: Record<string, unknown>;
}>();

const sectionData = computed((): Partial<SectionComponentData> => props.data ?? {});

const hasPadding = computed(() => sectionData.value.padding !== false);

const isBoxed = computed(() => sectionData.value.contentWidth === 'boxed');

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
    flexDirection: sectionData.value.direction === 'row' ? 'row' : 'column',
    flexWrap: sectionData.value.wrap !== false ? 'wrap' : 'nowrap',
    gap: sectionData.value.gap ?? '1rem',
    justifyContent: mapJustify(sectionData.value.justify),
    alignItems: mapAlign(sectionData.value.align),
}));
</script>

<template>
    <section
        class="section-block min-h-[2rem] w-full"
        :class="{
            'px-4 py-6 sm:px-6': hasPadding,
            'mx-auto max-w-6xl': isBoxed,
        }"
    >
        <div
            class="section-flex min-h-0 min-w-0 flex-1"
            :style="flexStyle"
        >
            <slot />
        </div>
    </section>
</template>
