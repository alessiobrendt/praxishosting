<script setup lang="ts">
import { computed } from 'vue';
import type { SectionComponentData, SectionJustify, SectionAlign } from '@/types/layout-components';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const sectionData = computed((): Partial<SectionComponentData> => props.data ?? {});

const hasPadding = computed(() => sectionData.value.padding !== false);

const isBoxed = computed(() => sectionData.value.contentWidth === 'boxed');

const paddingLeft = computed(() => sectionData.value.paddingLeft ?? (hasPadding.value ? '1rem' : '0'));
const paddingRight = computed(() => sectionData.value.paddingRight ?? (hasPadding.value ? '1rem' : '0'));

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

const sectionStyle = computed(() => {
    const bg = sectionData.value.backgroundColor;
    if (!bg || bg.trim() === '') return {};
    return { backgroundColor: bg };
});
</script>

<template>
    <div
        v-if="designMode"
        class="section-block-design min-h-[2rem] w-full rounded border-2 border-dashed border-primary/50 bg-primary/5 py-2"
        :style="sectionStyle"
    >
        <span class="mb-1 block px-2 text-xs font-medium text-primary">Bereich</span>
        <div
            class="section-flex min-h-0 min-w-0 flex-1 px-2"
            :style="{
                ...flexStyle,
                paddingLeft: paddingLeft,
                paddingRight: paddingRight,
            }"
        >
            <slot />
        </div>
    </div>
    <section
        v-else
        class="section-block min-h-[2rem] w-full"
        :class="{
            'py-6 sm:py-6 @sm:py-6': hasPadding,
            'mx-auto max-w-6xl': isBoxed,
        }"
        :style="{
            paddingLeft: paddingLeft,
            paddingRight: paddingRight,
            ...sectionStyle,
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
