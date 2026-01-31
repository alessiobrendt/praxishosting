<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { Head } from '@inertiajs/vue3';
import HeroSection from '@/components/site/HeroSection.vue';
import AboutSection from '@/components/site/AboutSection.vue';
import HoursSection from '@/components/site/HoursSection.vue';
import CTASection from '@/components/site/CTASection.vue';
import { getTemplateEntry } from '@/templates/template-registry';

type Props = {
    site: { id: number; name: string; slug: string };
    templateSlug?: string;
    pageData?: Record<string, unknown>;
    colors: Record<string, string>;
    generalInformation: Record<string, unknown>;
    designMode?: boolean;
    /** Resolved page slug (e.g. index, notfallinformationen) when using multi-page support. */
    pageSlug?: string;
};

const props = defineProps<Props>();

const pageData = computed(() => props.pageData ?? {});
const colors = computed(() => props.colors ?? {});

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
        :style="{
            '--primary': colors.primary,
            '--primary-hover': colors.primaryHover,
            '--primary-light': colors.primaryLight,
            '--primary-dark': colors.primaryDark,
            '--secondary': colors.secondary,
            '--tertiary': colors.tertiary,
            '--quaternary': colors.quaternary,
            '--quinary': colors.quinary,
        }"
    >
        <Head :title="site.name" />

        <template v-if="templateEntry && layoutComponent">
            <component
                :is="layoutComponent"
                :page-data="pageData"
                :colors="colors"
                :general-information="generalInformation"
                :site="site"
                :design-mode="designMode"
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
