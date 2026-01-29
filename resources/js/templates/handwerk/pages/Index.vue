<script setup lang="ts">
const props = defineProps<{
    pageData: Record<string, unknown>;
}>();

const pageData = props.pageData;

const colors = (pageData?.colors as Record<string, string>) ?? {};
const hero = (pageData?.hero as Record<string, unknown>) ?? {};
const services = (pageData?.services as Array<{ title?: string; shortDesc?: string; icon?: string }>) ?? [];
const about = (pageData?.about as Record<string, string>) ?? {};
const contact = (pageData?.contact as Record<string, string>) ?? {};

const heroHeading = () => (hero?.heading as string) ?? '';
const heroText = () => (hero?.text as string) ?? '';
const heroButtons = () => (Array.isArray(hero?.buttons) ? hero.buttons : []) as Array<{ text: string; href: string; variant: string }>;
const heroImage = () => (hero?.image as { src?: string; alt?: string }) ?? { src: '', alt: '' };
</script>

<template>
    <!-- Hero: full-width band with primary background -->
    <section id="hero" aria-labelledby="hero-heading" class="relative overflow-hidden">
        <div
            class="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2"
            :style="{ backgroundColor: colors.primary ?? '#0d9488' }"
        >
            <div class="relative z-10 text-white">
                <h1
                    id="hero-heading"
                    class="text-3xl font-extrabold uppercase tracking-tight sm:text-4xl md:text-5xl"
                >
                    {{ heroHeading() }}
                </h1>
                <p class="mt-4 max-w-lg text-lg leading-relaxed text-white/95">
                    {{ heroText() }}
                </p>
                <div class="mt-8 flex flex-wrap gap-3">
                    <a
                        v-for="(button, index) in heroButtons()"
                        :key="index"
                        :href="button.href"
                        class="inline-flex rounded border-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition-all"
                        :class="button.variant === 'outline' ? 'border-white bg-transparent text-white hover:bg-white hover:text-inherit' : 'border-white bg-white text-inherit hover:bg-white/90'"
                        :style="button.variant !== 'outline' ? { color: colors.primaryDark ?? colors.primary } : {}"
                    >
                        {{ button.text }}
                    </a>
                </div>
            </div>
            <div v-if="heroImage().src" class="relative z-10">
                <div class="overflow-hidden rounded-lg border-2 border-white/30 shadow-xl">
                    <img
                        :src="heroImage().src"
                        :alt="heroImage().alt ?? ''"
                        loading="eager"
                        class="h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- Services: list with left accent border -->
    <section id="leistungen" aria-labelledby="services-heading" class="border-t-2 border-stone-200 bg-white py-14">
        <div class="mx-auto max-w-5xl px-4 sm:px-6">
            <h2
                id="services-heading"
                class="text-2xl font-bold uppercase tracking-tight"
                :style="{ color: colors.secondary }"
            >
                {{ (pageData?.services_heading as string) ?? 'Unsere Leistungen' }}
            </h2>
            <ul class="mt-10 space-y-0">
                <li
                    v-for="(service, index) in services"
                    :key="index"
                    class="flex gap-6 border-b border-stone-200 py-6 first:pt-0"
                >
                    <span
                        class="block h-full w-1 shrink-0 rounded-full"
                        :style="{ backgroundColor: colors.primary }"
                        aria-hidden="true"
                    />
                    <div>
                        <h3 class="font-bold" :style="{ color: colors.primaryDark ?? colors.primary }">
                            {{ service.title }}
                        </h3>
                        <p class="mt-1 text-stone-600">
                            {{ service.shortDesc }}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </section>

    <!-- About: block with background band -->
    <section id="ueber-uns" aria-labelledby="about-heading" class="py-14" :style="{ backgroundColor: colors.primaryLight ?? '#ccfbf1' }">
        <div class="mx-auto max-w-5xl px-4 sm:px-6">
            <h2
                id="about-heading"
                class="text-2xl font-bold uppercase tracking-tight"
                :style="{ color: colors.secondary }"
            >
                {{ about.heading ?? 'Über uns' }}
            </h2>
            <p class="mt-6 max-w-3xl text-lg leading-relaxed" :style="{ color: colors.tertiary }">
                {{ about.text }}
            </p>
        </div>
    </section>

    <!-- Contact: boxed CTA -->
    <section
        id="kontakt"
        aria-labelledby="contact-heading"
        class="border-t-2 border-stone-200 bg-stone-100 py-14"
    >
        <div class="mx-auto max-w-5xl px-4 sm:px-6">
            <div
                class="rounded-xl border-2 p-8 shadow-lg"
                :style="{ borderColor: colors.primary, backgroundColor: 'white' }"
            >
                <h2
                    id="contact-heading"
                    class="text-2xl font-bold uppercase tracking-tight"
                    :style="{ color: colors.secondary }"
                >
                    {{ contact.heading ?? 'Kontakt' }}
                </h2>
                <p class="mt-4 text-stone-600">
                    {{ contact.text }}
                </p>
                <div class="mt-6 flex flex-wrap gap-6">
                    <a
                        v-if="contact.phone"
                        :href="`tel:${contact.phone}`"
                        class="font-bold"
                        :style="{ color: colors.primary }"
                    >
                        {{ contact.phone }}
                    </a>
                    <a
                        v-if="contact.email"
                        :href="`mailto:${contact.email}`"
                        class="font-bold"
                        :style="{ color: colors.primary }"
                    >
                        {{ contact.email }}
                    </a>
                </div>
                <p v-if="contact.address" class="mt-2 text-sm text-stone-600">
                    {{ contact.address }}
                </p>
                <a
                    v-if="contact.buttonText && contact.buttonHref"
                    :href="contact.buttonHref"
                    class="mt-6 inline-flex rounded border-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:opacity-95"
                    :style="{ backgroundColor: colors.primary, borderColor: colors.primary }"
                >
                    {{ contact.buttonText }}
                </a>
            </div>
        </div>
    </section>
</template>
