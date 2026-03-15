/**
 * Font and button-style logic extracted from useDesignerStore.
 * Handles active global fonts, button style, setPageGlobalFonts, setPageGlobalButtonStyle, options.
 */

import { computed, type Ref, type ComputedRef } from 'vue';
import type { GlobalFonts, GlobalButtonStyle } from '@/types/site-page-data';
import type { SitePageData } from '@/types/site-page-data';

export type DesignerFontsContext = {
    pageData: Ref<SitePageData | Record<string, unknown>>;
    fullCustomPageData: Ref<Record<string, unknown>>;
    currentPageSlug: Ref<string>;
    isTemplateMode: ComputedRef<boolean>;
    pushHistory: () => void;
    mergePageDataForSlug: (slug: string, custom: Record<string, unknown>) => SitePageData | Record<string, unknown>;
    getPreviewColors: () => Record<string, string>;
};

const BUTTON_VARIANT_OPTIONS: { value: string; label: string }[] = [
    { value: '', label: 'Standard (Primary)' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'outline', label: 'Outline' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'link', label: 'Link' },
    { value: 'destructive', label: 'Destructive' },
];

const BUTTON_RADIUS_OPTIONS: { value: string; label: string }[] = [
    { value: '', label: 'Standard' },
    { value: 'none', label: 'Keine' },
    { value: 'sm', label: 'Klein' },
    { value: 'md', label: 'Mittel' },
    { value: 'lg', label: 'Groß' },
    { value: 'full', label: 'Voll (Pill)' },
];

const BUTTON_SIZE_OPTIONS: { value: string; label: string }[] = [
    { value: '', label: 'Standard' },
    { value: 'sm', label: 'Klein' },
    { value: 'lg', label: 'Groß' },
];

const FONT_OPTIONS: { value: string; label: string }[] = [
    { value: '', label: 'Standard (Sans)' },
    { value: 'var(--font-sans)', label: 'Instrument Sans (Theme)' },
    { value: 'ui-sans-serif, system-ui, sans-serif', label: 'System UI' },
    { value: 'ui-serif, Georgia, serif', label: 'Serif (Georgia)' },
    { value: 'ui-monospace, ui-sans-serif, monospace', label: 'Monospace' },
    { value: 'Georgia, "Times New Roman", Times, serif', label: 'Georgia' },
    { value: '"Helvetica Neue", Helvetica, Arial, sans-serif', label: 'Helvetica' },
    { value: 'Inter, ui-sans-serif, system-ui, sans-serif', label: 'Inter' },
    { value: '"Open Sans", ui-sans-serif, sans-serif', label: 'Open Sans' },
];

export function useDesignerFonts(ctx: DesignerFontsContext) {
    const activeGlobalFonts = computed((): GlobalFonts => {
        if (ctx.isTemplateMode.value) {
            const data = ctx.pageData.value as Record<string, unknown>;
            const f = data?.global_fonts;
            return (f && typeof f === 'object' ? { ...(f as GlobalFonts) } : {}) as GlobalFonts;
        }
        const f = ctx.fullCustomPageData.value.global_fonts;
        return (f && typeof f === 'object' ? { ...(f as GlobalFonts) } : {}) as GlobalFonts;
    });

    const activeGlobalButtonStyle = computed((): GlobalButtonStyle => {
        if (ctx.isTemplateMode.value) {
            const data = ctx.pageData.value as Record<string, unknown>;
            const b = data?.global_button_style;
            return (b && typeof b === 'object' ? { ...(b as GlobalButtonStyle) } : {}) as GlobalButtonStyle;
        }
        const b = ctx.fullCustomPageData.value.global_button_style;
        return (b && typeof b === 'object' ? { ...(b as GlobalButtonStyle) } : {}) as GlobalButtonStyle;
    });

    const previewStyles = computed(() => {
        const data = ctx.pageData.value as SitePageData & {
            global_fonts?: GlobalFonts;
            global_button_style?: GlobalButtonStyle;
        };
        const fonts = data?.global_fonts ?? {};
        const btn = data?.global_button_style ?? {};
        const colors = ctx.getPreviewColors();
        return {
            ...colors,
            '--font-heading': fonts.heading ?? 'inherit',
            '--font-body': fonts.body ?? 'inherit',
            '--button-variant': btn.variant ?? 'default',
            '--button-radius': btn.radius ?? 'md',
            '--button-size': btn.size ?? 'default',
        };
    });

    function setPageGlobalFonts(fonts: Partial<GlobalFonts>): void {
        if (ctx.isTemplateMode.value) {
            const data = ctx.pageData.value as Record<string, unknown>;
            if (!data.global_fonts || typeof data.global_fonts !== 'object') data.global_fonts = {};
            (data.global_fonts as Record<string, string>) = {
                ...(data.global_fonts as GlobalFonts),
                ...fonts,
            };
            return;
        }
        ctx.pushHistory();
        const prev = (ctx.fullCustomPageData.value.global_fonts ?? {}) as GlobalFonts;
        ctx.fullCustomPageData.value = {
            ...ctx.fullCustomPageData.value,
            global_fonts: { ...prev, ...fonts },
        };
        ctx.pageData.value = ctx.mergePageDataForSlug(
            ctx.currentPageSlug.value as 'index' | 'notfallinformationen' | 'patienteninformationen',
            ctx.fullCustomPageData.value,
        );
    }

    function setPageGlobalButtonStyle(style: Partial<GlobalButtonStyle>): void {
        if (ctx.isTemplateMode.value) {
            const data = ctx.pageData.value as Record<string, unknown>;
            if (!data.global_button_style || typeof data.global_button_style !== 'object')
                data.global_button_style = {};
            (data.global_button_style as Record<string, string>) = {
                ...(data.global_button_style as GlobalButtonStyle),
                ...style,
            };
            return;
        }
        ctx.pushHistory();
        const prev = (ctx.fullCustomPageData.value.global_button_style ?? {}) as GlobalButtonStyle;
        ctx.fullCustomPageData.value = {
            ...ctx.fullCustomPageData.value,
            global_button_style: { ...prev, ...style },
        };
        ctx.pageData.value = ctx.mergePageDataForSlug(
            ctx.currentPageSlug.value as 'index' | 'notfallinformationen' | 'patienteninformationen',
            ctx.fullCustomPageData.value,
        );
    }

    return {
        activeGlobalFonts,
        activeGlobalButtonStyle,
        previewStyles,
        setPageGlobalFonts,
        setPageGlobalButtonStyle,
        BUTTON_VARIANT_OPTIONS,
        BUTTON_RADIUS_OPTIONS,
        BUTTON_SIZE_OPTIONS,
        FONT_OPTIONS,
    };
}
