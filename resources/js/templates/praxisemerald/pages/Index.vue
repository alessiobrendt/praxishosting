<script setup lang="ts">
import { computed } from 'vue';
import HoursTable from '@/templates/praxisemerald/components/ui/HoursTable.vue';
import Button from '@/templates/praxisemerald/components/ui/Button.vue';
import { HeartPulse, ShieldCheck, Stethoscope, Syringe, Clock } from 'lucide-vue-next';
import type { SitePageData } from '@/types/site-page-data';

const props = defineProps<{
    pageData: SitePageData;
}>();

const pageData = props.pageData;

/** Show the inline Hero only when no Hero is rendered via layout_components (avoids duplicate Hero). */
const showInlineHero = computed(() => !pageData.layout_components?.some((c) => c.type === 'hero'));

const components = {
    Stethoscope,
    Syringe,
    ShieldCheck,
    HeartPulse,
    Clock,
};

type FeatureIcon = keyof typeof components;
</script>

<template>
    <!-- Hero Section (only when not already rendered via layout_components) -->
    <section v-if="showInlineHero" aria-labelledby="hero-heading" class="relative">
        <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
            <div>
                <h1
                    id="hero-heading"
                    :style="{ color: pageData.colors.secondary }"
                    class="text-3xl font-bold tracking-tight sm:text-4xl"
                >
                    {{ pageData.hero.heading }}
                </h1>

                <p :style="{ color: pageData.colors.tertiary }" class="mt-4">
                    {{ pageData.hero.text }}
                </p>

                <div class="mt-6 flex flex-wrap gap-3">
                    <div v-for="(button, index) in pageData.hero.buttons" :key="index">
                        <Button :variant="(button.variant as 'default' | 'outline') ?? 'default'">
                            <a
                                :href="button.href"
                                :class="button.variant === 'default' ? 'text-white' : 'text-black'"
                            >
                                {{ button.text }}
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
            <div class="relative">
                <div class="relative aspect-[4/3] overflow-hidden rounded-lg border shadow-sm">
                    <img
                        :src="pageData.hero.image.src"
                        :alt="pageData.hero.image.alt"
                        loading="eager"
                        class="object-cover w-full h-full"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section>
        <section aria-labelledby="about-heading" class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div class="grid grid-cols-1 items-start gap-8 md:grid-cols-[1.2fr_.8fr]">
                <div>
                    <h2
                        id="about-heading"
                        :style="{ color: pageData.colors.secondary }"
                        class="text-2xl font-semibold"
                    >
                        {{ pageData.about.heading }}
                    </h2>
                    <p :style="{ color: pageData.colors.tertiary }" class="mt-4">
                        {{ pageData.about.text }}
                    </p>
                    <div class="mt-6 grid gap-4 sm:grid-cols-2">
                        <div
                            v-for="(feature, index) in pageData.about.features"
                            :key="index"
                            class="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm"
                        >
                            <component
                                :is="components[feature.icon as FeatureIcon]"
                                :style="{ color: pageData.colors.primaryDark }"
                                class="mt-0.5 h-5 w-5"
                                aria-hidden="true"
                            />
                            <div>
                                <h3 class="font-medium">{{ feature.title }}</h3>
                                <p :style="{ color: pageData.colors.tertiary }" class="text-sm">
                                    {{ feature.desc }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <aside aria-labelledby="hours-heading" class="space-y-4">
                    <h2
                        id="hours-heading"
                        :style="{ color: pageData.colors.secondary }"
                        class="flex items-center gap-2 text-xl font-semibold"
                    >
                        <component
                            :is="components[pageData.hours.icon as FeatureIcon]"
                            :style="{ color: pageData.colors.primaryDark }"
                            class="h-5 w-5"
                            aria-hidden="true"
                        />
                        {{ pageData.hours.heading }}
                    </h2>
                    <HoursTable :hours="pageData.hours.hours" />
                    <div
                        :style="{
                            backgroundColor: pageData.colors.primaryLight,
                            color: pageData.colors.primaryDark,
                        }"
                        class="rounded-md border p-3 text-sm"
                    >
                        {{ pageData.hours.infoText }}
                    </div>
                </aside>
            </div>
        </section>
    </section>

    <!-- CTA Section -->
    <section>
        <section
            aria-labelledby="cta-heading"
            :style="{ backgroundColor: pageData.colors.quaternary }"
            class="border-t"
        >
            <div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6">
                <h2
                    id="cta-heading"
                    :style="{ color: pageData.colors.secondary }"
                    class="text-2xl font-semibold"
                >
                    {{ pageData.cta.heading }}
                </h2>
                <p :style="{ color: pageData.colors.tertiary }" class="max-w-2xl">
                    {{ pageData.cta.text }}
                </p>
                <div class="flex flex-wrap items-center justify-center gap-3">
                    <a
                        v-for="(link, index) in pageData.cta.links"
                        :key="index"
                        :href="link.href"
                        :style="
                            link.variant === 'primary'
                                ? { backgroundColor: pageData.colors.primary, color: '#ffffff' }
                                : { color: pageData.colors.secondary }
                        "
                        :class="
                            link.variant === 'primary'
                                ? 'rounded-md px-4 py-2 hover:transition-colors'
                                : 'rounded-md border px-4 py-2 hover:transition-colors'
                        "
                        @mouseenter="
                            link.variant === 'primary'
                                ? ($event.target as HTMLElement).style.setProperty(
                                      'background-color',
                                      pageData.colors.primaryHover,
                                  )
                                : ($event.target as HTMLElement).style.setProperty(
                                      'background-color',
                                      pageData.colors.quinary,
                                  )
                        "
                        @mouseleave="
                            link.variant === 'primary'
                                ? ($event.target as HTMLElement).style.setProperty(
                                      'background-color',
                                      pageData.colors.primary,
                                  )
                                : ($event.target as HTMLElement).style.setProperty(
                                      'background-color',
                                      'transparent',
                                  )
                        "
                    >
                        {{ link.text }}
                    </a>
                </div>
                <div class="relative mt-6 w-xs overflow-hidden rounded-lg border">
                    <img
                        :src="pageData.cta.image.src"
                        :alt="pageData.cta.image.alt"
                        loading="lazy"
                        class="object-cover w-full h-full"
                    />
                </div>
            </div>
        </section>
    </section>
</template>
