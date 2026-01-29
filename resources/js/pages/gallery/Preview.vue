<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link } from '@inertiajs/vue3';
import gallery from '@/routes/gallery';
import { home } from '@/routes';
import HeroSection from '@/components/site/HeroSection.vue';
import AboutSection from '@/components/site/AboutSection.vue';
import HoursSection from '@/components/site/HoursSection.vue';
import CTASection from '@/components/site/CTASection.vue';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-vue-next';

type TemplatePage = {
    id: number;
    name: string;
    slug: string;
    order: number;
    data: Record<string, unknown> | null;
};

type Template = {
    id: number;
    name: string;
    slug: string;
    colors: Record<string, string> | null;
    page_data: Record<string, unknown> | null;
    pages?: TemplatePage[];
};

type Props = {
    template: Template;
};

const props = defineProps<Props>();

const colors = computed(() => props.template.colors ?? {});
const pages = computed(() => props.template.pages ?? []);
const pageData = computed(() => {
    // Use pages if available, otherwise fallback to page_data
    if (pages.value.length > 0) {
        return null; // Pages will be rendered separately
    }
    return props.template.page_data ?? {};
});
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <Head :title="`Vorschau: ${template.name}`" />

        <header class="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 shadow-modern">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link :href="home().url" class="text-xl font-semibold gradient-primary bg-clip-text text-transparent">
                    PraxisHosting
                </Link>
                <div class="flex gap-4">
                    <Link :href="gallery.index().url">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft class="mr-2 h-4 w-4" />
                            Zur Galerie
                        </Button>
                    </Link>
                </div>
            </div>
        </header>

        <main
            class="site-preview"
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
            <!-- Render pages if available -->
            <template v-if="pages.length > 0">
                <template v-for="page in pages" :key="page.id">
                    <HeroSection v-if="page.data?.hero" :data="page.data.hero" />
                    <AboutSection v-if="page.data?.about" :data="page.data.about" />
                    <HoursSection v-if="page.data?.hours" :data="page.data.hours" />
                    <CTASection v-if="page.data?.cta" :data="page.data.cta" />
                </template>
            </template>
            <!-- Fallback to page_data for old templates -->
            <template v-else>
                <HeroSection v-if="pageData?.hero" :data="pageData.hero" />
                <AboutSection v-if="pageData?.about" :data="pageData.about" />
                <HoursSection v-if="pageData?.hours" :data="pageData.hours" />
                <CTASection v-if="pageData?.cta" :data="pageData.cta" />
            </template>
        </main>
    </div>
</template>
