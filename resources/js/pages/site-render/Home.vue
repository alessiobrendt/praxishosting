<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { Head } from '@inertiajs/vue3';
import HeroSection from '@/components/site/HeroSection.vue';
import AboutSection from '@/components/site/AboutSection.vue';
import HoursSection from '@/components/site/HoursSection.vue';
import CTASection from '@/components/site/CTASection.vue';
import { getTemplateEntry } from '@/templates/template-registry';

type Props = {
    site: { id?: number; name: string; slug: string; favicon_url?: string };
    templateSlug?: string;
    pageData?: Record<string, unknown>;
    colors: Record<string, string>;
    generalInformation: Record<string, unknown>;
    designMode?: boolean;
    /** Resolved page slug (e.g. index, notfallinformationen) when using multi-page support. */
    pageSlug?: string;
    /** Canonical URL for this page. */
    canonicalUrl?: string;
};

const props = defineProps<Props>();

const pageData = computed(() => props.pageData ?? {});
const colors = computed(() => props.colors ?? {});
const seo = computed(() => (pageData.value.seo as Record<string, string> | undefined) ?? {});

const canonicalUrl = computed(
    () => (props.canonicalUrl as string) || (typeof window !== 'undefined' ? window.location.href : ''),
);
const faviconUrl = computed(() => props.site?.favicon_url ?? '');
const robotsContent = computed(() => (seo.value.robots as string) || 'index, follow');

const schemaOrgData = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: (seo.value.meta_title as string) || (props.generalInformation?.name as string) || props.site?.name,
    description: (seo.value.meta_description as string) || undefined,
    url: canonicalUrl.value,
}));

const globalFonts = computed(() => (pageData.value.global_fonts as { heading?: string; body?: string } | undefined) ?? {});
const globalButtonStyle = computed(
    () => (pageData.value.global_button_style as { variant?: string; radius?: string; size?: string } | undefined) ?? {},
);

const rootStyle = computed(() => {
    const c = colors.value;
    const fonts = globalFonts.value;
    const btn = globalButtonStyle.value;
    return {
        '--primary': c.primary,
        '--primary-hover': c.primaryHover,
        '--primary-light': c.primaryLight,
        '--primary-dark': c.primaryDark,
        '--secondary': c.secondary,
        '--tertiary': c.tertiary,
        '--quaternary': c.quaternary,
        '--quinary': c.quinary,
        '--font-heading': fonts.heading || 'inherit',
        '--font-body': fonts.body || 'inherit',
        '--button-variant': btn.variant || 'default',
        '--button-radius': btn.radius || 'md',
        '--button-size': btn.size || 'default',
    };
});

const templateEntry = computed(() => getTemplateEntry(props.templateSlug));

const layoutComponent = computed(() => {
    const e = templateEntry.value;
    if (!e) return null;
    if (typeof e.Layout === 'function') {
        return defineAsyncComponent(e.Layout as () => Promise<{ default: import('vue').Component }>);
    }
    return e.Layout;
});
</script>

<template>
    <div
        class="min-h-screen bg-background site-render"
        :style="rootStyle"
    >
        <Head :title="(seo.meta_title as string) || (generalInformation?.name as string) || site.name">
            <meta
                name="robots"
                :content="robotsContent"
            >
            <meta
                v-if="seo.meta_description"
                name="description"
                :content="seo.meta_description"
            >
            <link
                v-if="canonicalUrl"
                rel="canonical"
                :href="canonicalUrl"
            >
            <link
                v-if="faviconUrl"
                rel="icon"
                :href="faviconUrl"
            >
            <meta
                v-if="seo.og_title"
                property="og:title"
                :content="seo.og_title"
            >
            <meta
                v-if="seo.og_description"
                property="og:description"
                :content="seo.og_description"
            >
            <meta
                v-if="seo.og_image"
                property="og:image"
                :content="seo.og_image"
            >
            <meta
                v-if="seo.twitter_card || seo.og_image"
                name="twitter:card"
                :content="(seo.twitter_card as string) || 'summary_large_image'"
            >
            <meta
                v-if="seo.twitter_title || seo.og_title || seo.meta_title"
                name="twitter:title"
                :content="(seo.twitter_title as string) || (seo.og_title as string) || (seo.meta_title as string)"
            >
            <meta
                v-if="seo.twitter_description || seo.og_description || seo.meta_description"
                name="twitter:description"
                :content="(seo.twitter_description as string) || (seo.og_description as string) || (seo.meta_description as string)"
            >
            <meta
                v-if="seo.twitter_image || seo.og_image"
                name="twitter:image"
                :content="(seo.twitter_image as string) || (seo.og_image as string)"
            >
            <script
                type="application/ld+json"
                v-html="JSON.stringify(schemaOrgData)"
            />
        </Head>

        <template v-if="templateEntry && layoutComponent">
            <component
                :is="layoutComponent"
                :page-data="pageData"
                :colors="colors"
                :general-information="generalInformation"
                :site="site"
                :design-mode="designMode"
                :global-button-style="globalButtonStyle"
            />
        </template>
        <template v-else>
            <header class="border-b border-sidebar-border bg-card">
                <div class="container mx-auto px-4 py-4">
                    <h1 class="text-xl font-semibold" style="color: var(--primary)">
                        {{ (generalInformation?.name as string) ?? site.name }}
                    </h1>
                </div>
            </header>
            <main>
                <HeroSection v-if="pageData?.hero" :data="pageData.hero as Record<string, unknown>" />
                <AboutSection v-if="pageData?.about" :data="pageData.about as Record<string, unknown>" />
                <HoursSection v-if="pageData?.hours" :data="pageData.hours as Record<string, unknown>" />
                <CTASection v-if="pageData?.cta" :data="pageData.cta as Record<string, unknown>" />
            </main>
        </template>
    </div>
</template>
