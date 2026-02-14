/**
 * Page-related logic extracted from useDesignerStore.
 * Handles site/template page lists, labels, SEO, active state, add/delete/switch.
 */

import { computed, type Ref, type ComputedRef } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';
import type { SitePageData } from '@/types/site-page-data';

const PAGE_SLUGS = ['index', 'notfallinformationen', 'patienteninformationen'] as const;
const PAGE_SLUG_LABELS: Record<(typeof PAGE_SLUGS)[number], string> = {
    index: 'Startseite',
    notfallinformationen: 'Notfallinformationen',
    patienteninformationen: 'Patienteninformationen',
};

export type PageSlug = (typeof PAGE_SLUGS)[number];

export type TemplatePageFromSite = {
    id: number;
    name: string;
    slug: string;
    order: number;
    data?: Record<string, unknown> | null;
};

export type TemplatePageFromApi = {
    id: number;
    name: string;
    slug: string;
    order: number;
    data: Record<string, unknown> | null;
};

export type DesignerPagesContext = {
    props: { site?: { template?: { pages?: TemplatePageFromSite[] } } };
    fullCustomPageData: Ref<Record<string, unknown>>;
    currentPageSlug: Ref<string>;
    pageData: Ref<SitePageData | Record<string, unknown>>;
    templatePagesLocal: Ref<TemplatePageFromApi[]>;
    isTemplateMode: ComputedRef<boolean>;
    templateDefaultColors: ComputedRef<Record<string, string>>;
    pushHistory: () => void;
    pushPreviewDraft: () => void;
    mergePageDataForSlug: (slug: string, custom: Record<string, unknown>) => SitePageData | Record<string, unknown>;
    defaultLayoutComponents: () => LayoutComponentEntry[];
    selectedModuleId: Ref<string | null>;
    addPageModalOpen: Ref<boolean>;
    newPageName: Ref<string>;
    newPageSlug: Ref<string>;
};

const defaultColors = {
    primary: '#059669',
} as const;

export function useDesignerPages(ctx: DesignerPagesContext) {
    const sitePagesList = computed(() => {
        const templatePages = ((ctx.props.site?.template?.pages ?? []) as TemplatePageFromSite[]).filter(Boolean);
        const customPages = (
            (ctx.fullCustomPageData.value.custom_pages as { slug: string; name: string; order: number }[] | undefined) ??
            []
        ).filter(Boolean);
        const withSource = [
            ...templatePages.map((p) => ({ slug: p.slug, name: p.name, order: p.order, isCustom: false })),
            ...customPages.map((p) => ({ slug: p.slug, name: p.name, order: p.order, isCustom: true })),
        ];
        return withSource.sort((a, b) => a.order - b.order);
    });

    const templatePagesList = computed(() =>
        [...ctx.templatePagesLocal.value]
            .filter((p): p is TemplatePageFromApi => p != null && typeof p.slug === 'string')
            .sort((a, b) => a.order - b.order),
    );

    const currentPageSeo = computed(() => {
        const meta = (ctx.fullCustomPageData.value.pages_meta as Record<
            string,
            { seo?: Record<string, string> }
        > | undefined)?.[ctx.currentPageSlug.value];
        return (meta?.seo ?? {}) as Record<string, string>;
    });

    function getPageLabel(slug: string): string {
        if (PAGE_SLUG_LABELS[slug as PageSlug]) return PAGE_SLUG_LABELS[slug as PageSlug];
        const custom =
            (ctx.fullCustomPageData.value.custom_pages as { slug: string; name: string }[] | undefined) ?? [];
        return custom.find((p) => p.slug === slug)?.name ?? slug;
    }

    function isCustomPage(slug: string): boolean {
        const custom = (ctx.fullCustomPageData.value.custom_pages as { slug: string }[] | undefined) ?? [];
        return custom.some((p) => p.slug === slug);
    }

    function getPageSourceBadge(slug: string): 'Vorlage' | 'Eigene Anpassung' {
        const custom = ctx.fullCustomPageData.value;
        if (slug === 'index') {
            const layout = custom.layout_components;
            return Array.isArray(layout) && layout.length > 0 ? 'Eigene Anpassung' : 'Vorlage';
        }
        const pages = custom.pages as Record<string, { layout_components?: unknown[] }> | undefined;
        const page = pages?.[slug];
        const layout = page?.layout_components;
        return Array.isArray(layout) && layout.length > 0 ? 'Eigene Anpassung' : 'Vorlage';
    }

    function isPageActive(slug: string): boolean {
        if (slug === 'index') return true;
        const meta = (ctx.fullCustomPageData.value.pages_meta as Record<string, { active?: boolean }> | undefined)?.[
            slug
        ];
        return (meta?.active ?? true) === true;
    }

    function setPageSeo(
        slug: string,
        seo: Partial<{
            meta_title: string;
            meta_description: string;
            og_title: string;
            og_description: string;
            og_image: string;
            robots: string;
            twitter_card: string;
            twitter_title: string;
            twitter_description: string;
            twitter_image: string;
        }>,
    ): void {
        if (ctx.isTemplateMode.value) return;
        ctx.pushHistory();
        const meta = {
            ...((ctx.fullCustomPageData.value.pages_meta as Record<
                string,
                { active?: boolean; seo?: Record<string, string> }
            >) ?? {}),
        };
        meta[slug] = { ...meta[slug], seo: { ...(meta[slug]?.seo ?? {}), ...seo } };
        ctx.fullCustomPageData.value = { ...ctx.fullCustomPageData.value, pages_meta: meta };
        ctx.pageData.value = ctx.mergePageDataForSlug(ctx.currentPageSlug.value as PageSlug, ctx.fullCustomPageData.value);
        ctx.pushPreviewDraft();
    }

    function setPageActive(slug: string, active: boolean): void {
        if (slug === 'index') return;
        ctx.pushHistory();
        const meta = {
            ...((ctx.fullCustomPageData.value.pages_meta as Record<string, { active?: boolean }>) ?? {}),
        };
        meta[slug] = { ...meta[slug], active };
        ctx.fullCustomPageData.value = { ...ctx.fullCustomPageData.value, pages_meta: meta };
        ctx.pushPreviewDraft();
    }

    function slugify(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');
    }

    function switchPage(slug: string): void {
        if (ctx.isTemplateMode.value) {
            const page = ctx.templatePagesLocal.value.find((p) => p.slug === slug);
            if (page) {
                ctx.currentPageSlug.value = slug;
                if (!page.data) page.data = {};
                const data = page.data as Record<string, unknown>;
                if (!Array.isArray(data.layout_components))
                    data.layout_components = ctx.defaultLayoutComponents();
                const stored = (data.colors ?? {}) as Record<string, string>;
                const isStale = stored.primary === defaultColors.primary;
                data.colors = isStale
                    ? { ...ctx.templateDefaultColors.value }
                    : { ...ctx.templateDefaultColors.value, ...stored };
                ctx.pageData.value = data as SitePageData;
            }
        } else {
            ctx.currentPageSlug.value = slug as PageSlug;
            ctx.pageData.value = ctx.mergePageDataForSlug(slug as PageSlug, ctx.fullCustomPageData.value);
        }
        ctx.selectedModuleId.value = null;
    }

    function addCustomPage(): void {
        const name = ctx.newPageName.value.trim();
        const slug = (ctx.newPageSlug.value.trim() || slugify(name)).toLowerCase().replace(/[^a-z0-9\-]/g, '');
        if (!name || !slug) return;
        const customPages =
            (ctx.fullCustomPageData.value.custom_pages as { slug: string; name: string; order: number }[]) ?? [];
        if (customPages.some((p) => p.slug === slug)) return;
        const templatePages = (ctx.props.site?.template?.pages ?? []) as TemplatePageFromSite[];
        const maxOrder = Math.max(0, ...templatePages.map((p) => p.order), ...customPages.map((p) => p.order));
        ctx.pushHistory();
        const newCustomPages = [...customPages, { slug, name, order: maxOrder + 1 }];
        const pages = { ...((ctx.fullCustomPageData.value.pages as Record<string, unknown>) ?? {}) };
        pages[slug] = { layout_components: ctx.defaultLayoutComponents() };
        ctx.fullCustomPageData.value = {
            ...ctx.fullCustomPageData.value,
            custom_pages: newCustomPages,
            pages,
        };
        ctx.addPageModalOpen.value = false;
        switchPage(slug);
        ctx.pushPreviewDraft();
    }

    function deletePage(slug: string): void {
        if (slug === 'index') return;
        ctx.pushHistory();
        if (isCustomPage(slug)) {
            const customPages =
                (ctx.fullCustomPageData.value.custom_pages as { slug: string; name: string; order: number }[]) ?? [];
            ctx.fullCustomPageData.value.custom_pages = customPages.filter((p) => p.slug !== slug);
            const pages = { ...((ctx.fullCustomPageData.value.pages as Record<string, unknown>) ?? {}) };
            delete pages[slug];
            ctx.fullCustomPageData.value = { ...ctx.fullCustomPageData.value, pages };
            if (ctx.currentPageSlug.value === slug) switchPage('index');
        } else {
            setPageActive(slug, false);
            if (ctx.currentPageSlug.value === slug) switchPage('index');
        }
        ctx.pushPreviewDraft();
    }

    return {
        sitePagesList,
        templatePagesList,
        currentPageSeo,
        getPageLabel,
        isCustomPage,
        getPageSourceBadge,
        isPageActive,
        setPageSeo,
        setPageActive,
        addCustomPage,
        deletePage,
        switchPage,
    };
}
