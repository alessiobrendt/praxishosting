<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import type { GridComponentData } from '@/types/layout-components';
import { generateResponsiveCSS, hasResponsiveValues } from '@/lib/responsive-styles';

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const gridData = computed((): Partial<GridComponentData> => props.data ?? {});

// Generate unique ID for this grid instance
const gridId = ref(`grid-${Math.random().toString(36).substring(2, 11)}`);

const hasPadding = computed(() => gridData.value.padding !== false);

const paddingLeft = computed(() => {
    const val = gridData.value.paddingLeft;
    if (val === '__custom__' || !val) return hasPadding.value ? '1rem' : '0';
    return val;
});
const paddingRight = computed(() => {
    const val = gridData.value.paddingRight;
    if (val === '__custom__' || !val) return hasPadding.value ? '1rem' : '0';
    return val;
});

const hasResponsive = computed(() => hasResponsiveValues(props.data));

const gridStyle = computed(() => {
    const d = gridData.value;
    const style: Record<string, string> = {
        display: 'grid',
    };
    
    // When responsive is active, don't set columns/gap in inline styles
    // They will be handled by CSS media queries to avoid specificity issues
    if (!hasResponsive.value) {
        // Non-responsive: set everything in inline styles
        style.gap = d.gap ?? '1rem';
        if (d.columns) {
            style.gridTemplateColumns = d.columns;
        } else {
            style.gridTemplateColumns = 'repeat(2, 1fr)';
        }
    }
    // If responsive is active, columns and gap are handled by CSS media queries only
    
    if (d.rowGap) {
        style.rowGap = d.rowGap;
    }
    if (d.columnGap) {
        style.columnGap = d.columnGap;
    }
    
    return style;
});

// Generate responsive CSS for columns
const responsiveColumnsCSS = computed(() => {
    if (!hasResponsive.value) return '';
    
    const d = gridData.value;
    const selector = `.grid-block-responsive[data-grid-id="${gridId.value}"]`;
    
    // Always set base (mobile) - use columns if set, otherwise default to 1fr
    const baseColumns = d.columns || '1fr';
    
    return generateResponsiveCSS(selector, 'grid-template-columns', {
        base: baseColumns,
        sm: d.columnsSm,
        md: d.columnsMd,
        lg: d.columnsLg,
        xl: d.columnsXl,
    });
});

// Generate responsive CSS for gap
const responsiveGapCSS = computed(() => {
    if (!hasResponsive.value) return '';
    
    const d = gridData.value;
    // Only generate gap CSS if there are responsive gap values
    if (!d.gapSm && !d.gapMd && !d.gapLg && !d.gapXl) return '';
    
    const selector = `.grid-block-responsive[data-grid-id="${gridId.value}"]`;
    
    // Always set base (mobile) - use gap if set, otherwise default to 1rem
    const baseGap = d.gap || '1rem';
    
    return generateResponsiveCSS(selector, 'gap', {
        base: baseGap,
        sm: d.gapSm,
        md: d.gapMd,
        lg: d.gapLg,
        xl: d.gapXl,
    });
});

// Inject styles into head dynamically
const styleElement = ref<HTMLStyleElement | null>(null);

function injectStyles(): void {
    if (!hasResponsive.value || (!responsiveColumnsCSS.value && !responsiveGapCSS.value)) {
        removeStyles();
        return;
    }

    const css = `${responsiveColumnsCSS.value}\n${responsiveGapCSS.value}`;
    
    if (!styleElement.value) {
        styleElement.value = document.createElement('style');
        styleElement.value.setAttribute('data-grid-responsive', gridId.value);
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

watch([hasResponsive, responsiveColumnsCSS, responsiveGapCSS], () => {
    if (hasResponsive.value) {
        injectStyles();
    } else {
        removeStyles();
    }
});
</script>

<template>
    <div
        v-if="designMode"
        class="grid-block-design min-h-[2rem] w-full rounded border-2 border-dashed border-primary/50 bg-primary/5 py-2"
    >
        <span class="mb-1 block px-2 text-xs font-medium text-primary">Grid</span>
        <!-- Design mode: slot contains [drop zone, draggable, drop zone] from LayoutBlock; do NOT apply grid here so the draggable gets full width and can show its own grid. -->
        <div
            class="grid-block-inner grid-block-inner-design min-h-0 min-w-0 flex-1 flex flex-col"
            :style="{
                paddingLeft: paddingLeft,
                paddingRight: paddingRight,
            }"
        >
            <slot />
        </div>
    </div>
    <div
        v-else
        :class="hasResponsive ? 'grid-block grid-block-responsive min-h-[2rem] w-full' : 'grid-block min-h-[2rem] w-full'"
        :data-grid-id="hasResponsive ? gridId : undefined"
        :style="{
            ...gridStyle,
            paddingLeft: paddingLeft,
            paddingRight: paddingRight,
        }"
    >
        <slot />
    </div>
</template>
