<script setup lang="ts">
import { computed, inject, ref, onMounted, onUnmounted, watch } from 'vue';
import type {
    FlexContainerComponentData,
    SectionJustify,
    SectionAlign,
} from '@/types/layout-components';
import { generateResponsiveCSS, generateResponsiveContainerCSS, hasResponsiveValues } from '@/lib/responsive-styles';

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
    
    const d = flexData.value;
    if (!d.directionSm && !d.directionMd && !d.directionLg && !d.directionXl) return '';
    
    const selector = `.flex-container-block-responsive[data-flex-id="${flexId.value}"]`;
    
    const directionMap = (dir: string | undefined): string => {
        return dir === 'row' ? 'row' : 'column';
    };
    
    const baseDirection = directionMap(d.direction || 'column');
    const config = {
        base: baseDirection,
        sm: d.directionSm ? directionMap(d.directionSm) : undefined,
        md: d.directionMd ? directionMap(d.directionMd) : undefined,
        lg: d.directionLg ? directionMap(d.directionLg) : undefined,
        xl: d.directionXl ? directionMap(d.directionXl) : undefined,
    };
    return usePreviewContainerQueries
        ? generateResponsiveContainerCSS(selector, 'flex-direction', config)
        : generateResponsiveCSS(selector, 'flex-direction', config);
});

// Generate responsive CSS for gap
const responsiveGapCSS = computed(() => {
    if (!hasResponsive.value) return '';
    
    const d = flexData.value;
    // Only generate gap CSS if there are responsive gap values
    if (!d.gapSm && !d.gapMd && !d.gapLg && !d.gapXl) return '';
    
    const selector = `.flex-container-block-responsive[data-flex-id="${flexId.value}"]`;
    const baseGap = d.gap || '1rem';
    const config = {
        base: baseGap,
        sm: d.gapSm,
        md: d.gapMd,
        lg: d.gapLg,
        xl: d.gapXl,
    };
    return usePreviewContainerQueries
        ? generateResponsiveContainerCSS(selector, 'gap', config)
        : generateResponsiveCSS(selector, 'gap', config);
});

// Generate responsive CSS for justify
const responsiveJustifyCSS = computed(() => {
    if (!hasResponsive.value) return '';
    
    const d = flexData.value;
    if (!d.justifySm && !d.justifyMd && !d.justifyLg && !d.justifyXl) return '';
    
    const selector = `.flex-container-block-responsive[data-flex-id="${flexId.value}"]`;
    const baseJustify = mapJustify(d.justify || 'start');
    const config = {
        base: baseJustify,
        sm: d.justifySm ? mapJustify(d.justifySm) : undefined,
        md: d.justifyMd ? mapJustify(d.justifyMd) : undefined,
        lg: d.justifyLg ? mapJustify(d.justifyLg) : undefined,
        xl: d.justifyXl ? mapJustify(d.justifyXl) : undefined,
    };
    return usePreviewContainerQueries
        ? generateResponsiveContainerCSS(selector, 'justify-content', config)
        : generateResponsiveCSS(selector, 'justify-content', config);
});

// Generate responsive CSS for align
const responsiveAlignCSS = computed(() => {
    if (!hasResponsive.value) return '';
    
    const d = flexData.value;
    if (!d.alignSm && !d.alignMd && !d.alignLg && !d.alignXl) return '';
    
    const selector = `.flex-container-block-responsive[data-flex-id="${flexId.value}"]`;
    const baseAlign = mapAlign(d.align || 'stretch');
    const config = {
        base: baseAlign,
        sm: d.alignSm ? mapAlign(d.alignSm) : undefined,
        md: d.alignMd ? mapAlign(d.alignMd) : undefined,
        lg: d.alignLg ? mapAlign(d.alignLg) : undefined,
        xl: d.alignXl ? mapAlign(d.alignXl) : undefined,
    };
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
