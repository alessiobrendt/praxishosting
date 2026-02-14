<script setup lang="ts">
import { computed, inject, ref, onMounted, onUnmounted, watch } from 'vue';
import type {
    FlexContainerComponentData,
    SectionJustify,
    SectionAlign,
} from '@/types/layout-components';
import {
    generateResponsiveCSS,
    generateResponsiveContainerCSS,
    hasResponsiveValues,
    getEffectiveDataAtBreakpoint,
} from '@/lib/responsive-styles';

const usePreviewContainerQueries = inject<boolean>('usePreviewContainerQueries', false);

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const flexData = computed((): Partial<FlexContainerComponentData> => props.data ?? {});

// Generate unique ID for this flex container instance
const flexId = ref(`flex-${Math.random().toString(36).substring(2, 11)}`);

const hasPadding = computed(() => flexData.value.padding !== false);

const paddingLeft = computed(() => {
    const val = flexData.value.paddingLeft;
    if (val === '__custom__' || !val) return hasPadding.value ? '1rem' : '0';
    return val;
});
const paddingRight = computed(() => {
    const val = flexData.value.paddingRight;
    if (val === '__custom__' || !val) return hasPadding.value ? '1rem' : '0';
    return val;
});

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

const hasResponsive = computed(() => hasResponsiveValues(props.data));

const flexStyle = computed(() => {
    const d = flexData.value;
    const style: Record<string, string> = {
        display: 'flex',
        flexWrap: d.wrap !== false ? 'wrap' : 'nowrap',
    };
    
    // When responsive is active, don't set responsive properties in inline styles
    // They will be handled by CSS media queries to avoid specificity issues
    if (!hasResponsive.value) {
        // Non-responsive: set everything in inline styles
        style.flexDirection = d.direction === 'row' ? 'row' : 'column';
        style.gap = d.gap ?? '1rem';
        style.justifyContent = mapJustify(d.justify);
        style.alignItems = mapAlign(d.align);
    }
    // If responsive is active, direction/gap/justify/align are handled by CSS media queries only
    
    return style;
});

// Generate responsive CSS for direction
const responsiveDirectionCSS = computed(() => {
    if (!hasResponsive.value) return '';

    const d = props.data as Record<string, unknown>;
    const selector = `.flex-container-block-responsive[data-flex-id="${flexId.value}"]`;
    const usesNewFormat = !!(d.responsive && typeof d.responsive === 'object');

    const directionMap = (dir: string | undefined): string => (dir === 'row' ? 'row' : 'column');

    let config: { base?: string; sm?: string; md?: string; lg?: string; xl?: string };
    if (usesNewFormat) {
        const mobile = directionMap(getEffectiveDataAtBreakpoint(d, 'mobile').direction as string | undefined);
        const tablet = directionMap(getEffectiveDataAtBreakpoint(d, 'tablet').direction as string | undefined);
        const desktop = directionMap(getEffectiveDataAtBreakpoint(d, 'desktop').direction as string | undefined);
        config = { base: mobile, md: tablet, lg: desktop };
    } else {
        const fd = flexData.value;
        if (!fd.directionSm && !fd.directionMd && !fd.directionLg && !fd.directionXl) return '';
        config = {
            base: directionMap(fd.direction || 'column'),
            sm: fd.directionSm ? directionMap(fd.directionSm) : undefined,
            md: fd.directionMd ? directionMap(fd.directionMd) : undefined,
            lg: fd.directionLg ? directionMap(fd.directionLg) : undefined,
            xl: fd.directionXl ? directionMap(fd.directionXl) : undefined,
        };
    }
    return usePreviewContainerQueries
        ? generateResponsiveContainerCSS(selector, 'flex-direction', config)
        : generateResponsiveCSS(selector, 'flex-direction', config);
});

// Generate responsive CSS for gap
const responsiveGapCSS = computed(() => {
    if (!hasResponsive.value) return '';

    const d = props.data as Record<string, unknown>;
    const selector = `.flex-container-block-responsive[data-flex-id="${flexId.value}"]`;
    const usesNewFormat = !!(d.responsive && typeof d.responsive === 'object');

    let config: { base?: string; sm?: string; md?: string; lg?: string; xl?: string };
    if (usesNewFormat) {
        const baseGap = (d.gap as string) || '1rem';
        config = {
            base: (getEffectiveDataAtBreakpoint(d, 'mobile').gap as string) ?? baseGap,
            md: getEffectiveDataAtBreakpoint(d, 'tablet').gap as string | undefined,
            lg: (getEffectiveDataAtBreakpoint(d, 'desktop').gap as string) ?? baseGap,
        };
    } else {
        const fd = flexData.value;
        if (!fd.gapSm && !fd.gapMd && !fd.gapLg && !fd.gapXl) return '';
        config = {
            base: fd.gap || '1rem',
            sm: fd.gapSm,
            md: fd.gapMd,
            lg: fd.gapLg,
            xl: fd.gapXl,
        };
    }
    return usePreviewContainerQueries
        ? generateResponsiveContainerCSS(selector, 'gap', config)
        : generateResponsiveCSS(selector, 'gap', config);
});

// Generate responsive CSS for justify
const responsiveJustifyCSS = computed(() => {
    if (!hasResponsive.value) return '';

    const d = props.data as Record<string, unknown>;
    const selector = `.flex-container-block-responsive[data-flex-id="${flexId.value}"]`;
    const usesNewFormat = !!(d.responsive && typeof d.responsive === 'object');

    let config: { base?: string; sm?: string; md?: string; lg?: string; xl?: string };
    if (usesNewFormat) {
        const baseJustify = mapJustify(d.justify as string | undefined);
        config = {
            base: mapJustify(getEffectiveDataAtBreakpoint(d, 'mobile').justify as string | undefined) || baseJustify,
            md: mapJustify(getEffectiveDataAtBreakpoint(d, 'tablet').justify as string | undefined) as string | undefined,
            lg: mapJustify(getEffectiveDataAtBreakpoint(d, 'desktop').justify as string | undefined) || baseJustify,
        };
    } else {
        const fd = flexData.value;
        if (!fd.justifySm && !fd.justifyMd && !fd.justifyLg && !fd.justifyXl) return '';
        config = {
            base: mapJustify(fd.justify || 'start'),
            sm: fd.justifySm ? mapJustify(fd.justifySm) : undefined,
            md: fd.justifyMd ? mapJustify(fd.justifyMd) : undefined,
            lg: fd.justifyLg ? mapJustify(fd.justifyLg) : undefined,
            xl: fd.justifyXl ? mapJustify(fd.justifyXl) : undefined,
        };
    }
    return usePreviewContainerQueries
        ? generateResponsiveContainerCSS(selector, 'justify-content', config)
        : generateResponsiveCSS(selector, 'justify-content', config);
});

// Generate responsive CSS for align
const responsiveAlignCSS = computed(() => {
    if (!hasResponsive.value) return '';

    const d = props.data as Record<string, unknown>;
    const selector = `.flex-container-block-responsive[data-flex-id="${flexId.value}"]`;
    const usesNewFormat = !!(d.responsive && typeof d.responsive === 'object');

    let config: { base?: string; sm?: string; md?: string; lg?: string; xl?: string };
    if (usesNewFormat) {
        const baseAlign = mapAlign(d.align as string | undefined);
        config = {
            base: mapAlign(getEffectiveDataAtBreakpoint(d, 'mobile').align as string | undefined) || baseAlign,
            md: mapAlign(getEffectiveDataAtBreakpoint(d, 'tablet').align as string | undefined) as string | undefined,
            lg: mapAlign(getEffectiveDataAtBreakpoint(d, 'desktop').align as string | undefined) || baseAlign,
        };
    } else {
        const fd = flexData.value;
        if (!fd.alignSm && !fd.alignMd && !fd.alignLg && !fd.alignXl) return '';
        config = {
            base: mapAlign(fd.align || 'stretch'),
            sm: fd.alignSm ? mapAlign(fd.alignSm) : undefined,
            md: fd.alignMd ? mapAlign(fd.alignMd) : undefined,
            lg: fd.alignLg ? mapAlign(fd.alignLg) : undefined,
            xl: fd.alignXl ? mapAlign(fd.alignXl) : undefined,
        };
    }
    return usePreviewContainerQueries
        ? generateResponsiveContainerCSS(selector, 'align-items', config)
        : generateResponsiveCSS(selector, 'align-items', config);
});

// Inject styles into head dynamically
const styleElement = ref<HTMLStyleElement | null>(null);

function injectStyles(): void {
    if (
        !hasResponsive.value ||
        (!responsiveDirectionCSS.value &&
            !responsiveGapCSS.value &&
            !responsiveJustifyCSS.value &&
            !responsiveAlignCSS.value)
    ) {
        removeStyles();
        return;
    }

    const css = `${responsiveDirectionCSS.value}\n${responsiveGapCSS.value}\n${responsiveJustifyCSS.value}\n${responsiveAlignCSS.value}`;

    if (!styleElement.value) {
        styleElement.value = document.createElement('style');
        styleElement.value.setAttribute('data-flex-responsive', flexId.value);
        document.head.appendChild(styleElement.value);
    }

    styleElement.value.textContent = css;
}

function removeStyles(): void {
    if (styleElement.value) {
        styleElement.value.remove();
        styleElement.value = null;
    }
}

onMounted(() => {
    if (hasResponsive.value) {
        injectStyles();
    }
});

onUnmounted(() => {
    removeStyles();
});

watch(
    [hasResponsive, responsiveDirectionCSS, responsiveGapCSS, responsiveJustifyCSS, responsiveAlignCSS],
    () => {
        if (hasResponsive.value) {
            injectStyles();
        } else {
            removeStyles();
        }
    }
);
</script>

<template>
    <div
        v-if="designMode"
        class="flex-container-block-design min-h-[2rem] w-full rounded border-2 border-dashed border-primary/50 bg-primary/5 py-2"
    >
        <span class="mb-1 block px-2 text-xs font-medium text-primary">Flex</span>
        <div
            class="flex-container-inner min-h-0 min-w-0 flex-1"
            :style="{
                ...flexStyle,
                paddingLeft: paddingLeft,
                paddingRight: paddingRight,
            }"
        >
            <slot />
        </div>
    </div>
    <div
        v-else
        :class="
            hasResponsive
                ? 'flex-container-block flex-container-block-responsive min-h-[2rem] w-full'
                : 'flex-container-block min-h-[2rem] w-full'
        "
        :data-flex-id="hasResponsive ? flexId : undefined"
        :style="{
            ...flexStyle,
            paddingLeft: paddingLeft,
            paddingRight: paddingRight,
        }"
    >
        <slot />
    </div>
</template>
