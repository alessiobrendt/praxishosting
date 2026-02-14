/**
 * Color-related logic extracted from useDesignerStore.
 * Handles active/preview colors, setPageColors, color picker.
 */

import { ref, computed, nextTick, type Ref, type ComputedRef } from 'vue';
import type { SitePageDataColors } from '@/types/site-page-data';
import type { SitePageData } from '@/types/site-page-data';

export type DesignerColorsContext = {
    pageData: Ref<SitePageData | Record<string, unknown>>;
    fullCustomPageData: Ref<Record<string, unknown>>;
    currentPageSlug: Ref<string>;
    templateDefaultColors: ComputedRef<Record<string, string>>;
    isTemplateMode: ComputedRef<boolean>;
    pushHistory: () => void;
    pushPreviewDraft: () => void;
    mergePageDataForSlug: (slug: string, custom: Record<string, unknown>) => SitePageData | Record<string, unknown>;
};

export function useDesignerColors(ctx: DesignerColorsContext) {
    const colorPickerKey = ref<keyof SitePageDataColors | null>(null);
    const colorInputRef = ref<HTMLInputElement | null>(null);

    const activeColors = computed((): Record<string, string> => {
        const c = (ctx.pageData.value as SitePageData).colors;
        const fallback = ctx.templateDefaultColors.value;
        if (!c || typeof c !== 'object') return { ...fallback };
        return { ...fallback, ...c };
    });

    const previewColors = computed(() => {
        const c = (ctx.pageData.value as SitePageData).colors ?? {};
        const fallback = ctx.templateDefaultColors.value;
        return {
            '--primary': c.primary ?? fallback.primary,
            '--primary-hover': c.primaryHover ?? fallback.primaryHover,
            '--primary-light': c.primaryLight ?? fallback.primaryLight,
            '--primary-dark': c.primaryDark ?? fallback.primaryDark,
            '--secondary': c.secondary ?? fallback.secondary,
            '--tertiary': c.tertiary ?? fallback.tertiary,
            '--quaternary': c.quaternary ?? fallback.quaternary,
            '--quinary': c.quinary ?? fallback.quinary,
        };
    });

    function setPageColors(colors: Partial<SitePageDataColors>): void {
        if (ctx.isTemplateMode.value) {
            const data = ctx.pageData.value as Record<string, unknown>;
            if (!data.colors || typeof data.colors !== 'object') data.colors = { ...ctx.templateDefaultColors.value };
            (data.colors as Record<string, string>) = {
                ...(data.colors as Record<string, string>),
                ...colors,
            };
            return;
        }
        ctx.pushHistory();
        const prev = (ctx.fullCustomPageData.value.colors ?? {}) as Record<string, string>;
        ctx.fullCustomPageData.value = {
            ...ctx.fullCustomPageData.value,
            colors: { ...ctx.templateDefaultColors.value, ...prev, ...colors },
        };
        ctx.pageData.value = ctx.mergePageDataForSlug(
            ctx.currentPageSlug.value as 'index' | 'notfallinformationen' | 'patienteninformationen',
            ctx.fullCustomPageData.value,
        );
    }

    function openColorPicker(key: keyof SitePageDataColors): void {
        colorPickerKey.value = key;
        nextTick(() => {
            const el = colorInputRef.value;
            if (el) {
                el.value = activeColors.value[key] ?? '#000000';
                el.click();
            }
        });
    }

    function onColorInput(e: Event): void {
        const key = colorPickerKey.value;
        const value = (e.target as HTMLInputElement).value;
        if (key) setPageColors({ [key]: value });
        colorPickerKey.value = null;
    }

    return {
        activeColors,
        previewColors,
        setPageColors,
        openColorPicker,
        onColorInput,
        colorPickerKey,
        colorInputRef,
    };
}
