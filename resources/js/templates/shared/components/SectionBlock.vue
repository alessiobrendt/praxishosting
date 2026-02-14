<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, inject } from 'vue';
import type { SectionComponentData, SectionJustify, SectionAlign } from '@/types/layout-components';
import {
    hasResponsiveValues,
    getEffectiveDataAtBreakpoint,
    generateResponsiveCSS,
    generateResponsiveContainerCSS,
} from '@/lib/responsive-styles';

const usePreviewContainerQueries = inject<boolean>('usePreviewContainerQueries', false);

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const sectionData = computed((): Partial<SectionComponentData> => props.data ?? {});

const sectionId = ref(`section-${Math.random().toString(36).substring(2, 11)}`);

const hasResponsive = computed(() => hasResponsiveValues(props.data as Record<string, unknown>));

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

const paddingLeft = computed(() => {
    const d = hasResponsive.value
        ? getEffectiveDataAtBreakpoint(props.data as Record<string, unknown>, 'desktop')
        : (props.data as Record<string, unknown>);
    const val = d.paddingLeft;
    if (val === '__custom__' || !val) return hasPadding.value ? '1rem' : '0';
    return val as string;
});
const paddingRight = computed(() => {
    const d = hasResponsive.value
        ? getEffectiveDataAtBreakpoint(props.data as Record<string, unknown>, 'desktop')
        : (props.data as Record<string, unknown>);
    const val = d.paddingRight;
    if (val === '__custom__' || !val) return hasPadding.value ? '1rem' : '0';
    return val as string;
});

const flexStyle = computed(() => {
    const d = props.data as Record<string, unknown>;
    const usesNewFormat = hasResponsive.value && !!(d.responsive && typeof d.responsive === 'object');
    const style: Record<string, string> = {
        display: 'flex',
        flexWrap: (d.wrap !== false ? 'wrap' : 'nowrap') as string,
    };
    if (!usesNewFormat) {
        style.flexDirection = (d.direction as string) === 'row' ? 'row' : 'column';
        style.gap = (d.gap as string) ?? '1rem';
        style.justifyContent = mapJustify(d.justify as SectionJustify | undefined);
        style.alignItems = mapAlign(d.align as SectionAlign | undefined);
    } else {
        const mobile = getEffectiveDataAtBreakpoint(d, 'mobile');
        style.flexDirection = (mobile.direction as string) === 'row' ? 'row' : 'column';
        style.gap = (mobile.gap as string) ?? '1rem';
        style.justifyContent = mapJustify(mobile.justify as SectionJustify | undefined);
        style.alignItems = mapAlign(mobile.align as SectionAlign | undefined);
    }
    return style;
});

const sectionStyle = computed(() => {
    const d = hasResponsive.value
        ? getEffectiveDataAtBreakpoint(props.data as Record<string, unknown>, 'desktop')
        : (props.data as Record<string, unknown>);
    const bg = d.backgroundColor as string | undefined;
    if (!bg || bg.trim() === '') return {};
    return { backgroundColor: bg };
});

const responsiveFlexCSS = computed(() => {
    if (!hasResponsive.value) return '';

    const d = props.data as Record<string, unknown>;
    const usesNewFormat = !!(d.responsive && typeof d.responsive === 'object');
    if (!usesNewFormat) return '';

    const selector = `.section-block-responsive[data-section-id="${sectionId.value}"] .section-flex`;
    const directionMap = (dir: string | undefined): string => (dir === 'row' ? 'row' : 'column');
    const mobile = getEffectiveDataAtBreakpoint(d, 'mobile');
    const tablet = getEffectiveDataAtBreakpoint(d, 'tablet');
    const desktop = getEffectiveDataAtBreakpoint(d, 'desktop');

    const parts: string[] = [];
    const baseDirection = directionMap(mobile.direction as string | undefined);
    parts.push(
        usePreviewContainerQueries
            ? generateResponsiveContainerCSS(selector, 'flex-direction', {
                  base: baseDirection,
                  md: directionMap(tablet.direction as string | undefined),
                  lg: directionMap(desktop.direction as string | undefined),
              })
            : generateResponsiveCSS(selector, 'flex-direction', {
                  base: baseDirection,
                  md: directionMap(tablet.direction as string | undefined),
                  lg: directionMap(desktop.direction as string | undefined),
              })
    );
    const baseGap = (mobile.gap as string) ?? '1rem';
    parts.push(
        usePreviewContainerQueries
            ? generateResponsiveContainerCSS(selector, 'gap', {
                  base: baseGap,
                  md: (tablet.gap as string) ?? baseGap,
                  lg: (desktop.gap as string) ?? baseGap,
              })
            : generateResponsiveCSS(selector, 'gap', {
                  base: baseGap,
                  md: (tablet.gap as string) ?? baseGap,
                  lg: (desktop.gap as string) ?? baseGap,
              })
    );
    parts.push(
        usePreviewContainerQueries
            ? generateResponsiveContainerCSS(selector, 'justify-content', {
                  base: mapJustify(mobile.justify as SectionJustify | undefined),
                  md: mapJustify(tablet.justify as SectionJustify | undefined),
                  lg: mapJustify(desktop.justify as SectionJustify | undefined),
              })
            : generateResponsiveCSS(selector, 'justify-content', {
                  base: mapJustify(mobile.justify as SectionJustify | undefined),
                  md: mapJustify(tablet.justify as SectionJustify | undefined),
                  lg: mapJustify(desktop.justify as SectionJustify | undefined),
              })
    );
    parts.push(
        usePreviewContainerQueries
            ? generateResponsiveContainerCSS(selector, 'align-items', {
                  base: mapAlign(mobile.align as SectionAlign | undefined),
                  md: mapAlign(tablet.align as SectionAlign | undefined),
                  lg: mapAlign(desktop.align as SectionAlign | undefined),
              })
            : generateResponsiveCSS(selector, 'align-items', {
                  base: mapAlign(mobile.align as SectionAlign | undefined),
                  md: mapAlign(tablet.align as SectionAlign | undefined),
                  lg: mapAlign(desktop.align as SectionAlign | undefined),
              })
    );
    return parts.join('\n');
});

const styleElement = ref<HTMLStyleElement | null>(null);

function injectStyles(): void {
    if (!hasResponsive.value || !responsiveFlexCSS.value) {
        removeStyles();
        return;
    }
    if (!styleElement.value) {
        styleElement.value = document.createElement('style');
        styleElement.value.setAttribute('data-section-responsive', sectionId.value);
        document.head.appendChild(styleElement.value);
    }
    styleElement.value.textContent = responsiveFlexCSS.value;
}

function removeStyles(): void {
    if (styleElement.value) {
        styleElement.value.remove();
        styleElement.value = null;
    }
}

onMounted(() => {
    if (hasResponsive.value) injectStyles();
});

onUnmounted(removeStyles);

watch([hasResponsive, responsiveFlexCSS], () => {
    if (hasResponsive.value) injectStyles();
    else removeStyles();
});
</script>

<template>
    <div
        v-if="designMode"
        :id="(sectionData.anchor as string) || undefined"
        :class="[
            'section-block-design min-h-[2rem] w-full rounded border-2 border-dashed border-primary/50 bg-primary/5 py-2',
            hasResponsive && 'section-block-responsive',
        ]"
        :data-section-id="hasResponsive ? sectionId : undefined"
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
        :id="(sectionData.anchor as string) || undefined"
        :class="[
            'section-block min-h-[2rem] w-full',
            hasResponsive && 'section-block-responsive',
            {
                'py-6 sm:py-6 @sm:py-6': hasPadding,
                'mx-auto max-w-6xl': isBoxed,
            },
        ]"
        :data-section-id="hasResponsive ? sectionId : undefined"
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
