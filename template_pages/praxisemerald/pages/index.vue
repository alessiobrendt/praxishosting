<script setup lang="ts">
import HoursTable from '~/components/ui/hours-table.vue';
import Button from '~/components/ui/Button.vue';

import { HeartPulse, ShieldCheck, Stethoscope, Syringe, Clock } from 'lucide-vue-next';

import { motion } from 'motion-v'

// JSON-Datenstruktur - alle Inhalte der Seite
const pageData = {
    colors: {
        primary: "#059669",        // emerald-600
        primaryHover: "#047857",   // emerald-700
        primaryLight: "#ecfdf5",   // emerald-50
        primaryDark: "#065f46",    // emerald-800 (für Text auf hellem Hintergrund)
        secondary: "#0f172a",       // slate-900
        tertiary: "#334155",        // slate-700
        quaternary: "#f8fafc",      // slate-50
        quinary: "#f1f5f9",         // slate-100
    },
    hero: {
        heading: "Willkommen in der Praxis Mustermann",
        text: "Ihre hausärztliche Versorgung mit Herz und Verstand – persönlich, modern und nah.",
        buttons: [
            {
                text: "Termin anfragen",
                href: "",
                variant: "default"
            },
            {
                text: "Unsere Leistungen",
                href: "/leistungen",
                variant: "outline"
            }
        ],
        image: {
            src: "/images/image1.webp",
            alt: "Behandlungszimmer der Praxis Mustermann"
        }
    },
    about: {
        heading: "Kurzvorstellung",
        text: "In unserer Praxis steht der Mensch im Mittelpunkt. Wir verbinden moderne Diagnostik mit individueller Betreuung und nehmen uns Zeit für Ihre Anliegen.",
        features: [
            {
                icon: "Stethoscope",
                title: "Allgemeinmedizin",
                desc: "Hausärztliche Versorgung, akute und chronische Erkrankungen."
            },
            {
                icon: "Syringe",
                title: "Impfungen",
                desc: "Beratung und Durchführung aller empfohlenen Impfungen."
            },
            {
                icon: "ShieldCheck",
                title: "Vorsorge",
                desc: "Gesundheits-Check-ups, Krebsfrüherkennung, Hautkrebsscreening."
            },
            {
                icon: "HeartPulse",
                title: "Diagnostik",
                desc: "EKG, Langzeit-Blutdruck, Spirometrie, Laboruntersuchungen."
            }
        ]
    },
    hours: {
        heading: "Öffnungszeiten",
        icon: "Clock",
        infoText: "Bitte vereinbaren Sie nach Möglichkeit einen Termin. Akutsprechstunde täglich vormittags.",
        hours: [
            { day: "Montag", hours: "08:00–12:00, 15:00–18:00" },
            { day: "Dienstag", hours: "08:00–12:00" },
            { day: "Mittwoch", hours: "08:00–12:00" },
            { day: "Donnerstag", hours: "08:00–12:00, 15:00–18:00" },
            { day: "Freitag", hours: "08:00–12:00" },
            { day: "Samstag", hours: "geschlossen" },
            { day: "Sonntag", hours: "geschlossen" }
        ]
    },
    cta: {
        heading: "Neu bei uns?",
        text: "Hier finden Sie Informationen für Ihren ersten Besuch, Anfahrt und was Sie mitbringen sollten.",
        links: [
            {
                text: "Patienteninformationen",
                href: "/patienteninformationen",
                variant: "primary"
            },
            {
                text: "Leistungen ansehen",
                href: "/leistungen",
                variant: "secondary"
            }
        ],
        image: {
            src: "/images/image2.webp",
            alt: "Empfangsbereich der Praxis Mustermann"
        }
    }
};

const components = {
    Stethoscope,
    Syringe,
    ShieldCheck,
    HeartPulse,
    Clock
};

type FeatureIcon = keyof typeof components;

</script>

<template>
    <!-- Hero Section -->
    <section aria-labelledby="hero-heading" class="relative">
        <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
            <div>
                <motion.h1 
                    :initial="{ opacity: 0, x: 30 }" 
                    :whileInView="{ opacity: 1, x: 0 }"
                    :viewport="{ once: true, amount: 0.3 }" 
                    :transition="{ duration: 0.8, ease: 'easeOut' }"
                    id="hero-heading"
                    :style="{ color: pageData.colors.secondary }"
                    class="text-3xl font-bold tracking-tight sm:text-4xl">
                    {{ pageData.hero.heading }}
                </motion.h1>

                <motion.p 
                    :initial="{ opacity: 0, x: 30 }" 
                    :whileInView="{ opacity: 1, x: 0 }"
                    :viewport="{ once: true, amount: 0.3 }" 
                    :transition="{ duration: 0.8, ease: 'easeOut', delay: 0.2 }"
                    :style="{ color: pageData.colors.tertiary }"
                    class="mt-4">
                    {{ pageData.hero.text }}
                </motion.p>

                <div class="mt-6 flex flex-wrap gap-3">
                    <motion.div 
                        v-for="(button, index) in pageData.hero.buttons" 
                        :key="index"
                        :whileHover="{ scale: 1.1 }" 
                        :whilePress="{ scale: 0.8 }">
                        <Button :variant="button.variant as 'default' | 'outline'">
                            <a :href="button.href"
                            :class="button.variant === 'default' ? 'text-white' : 'text-black'">{{ button.text }}</a>
                        </Button>
                    </motion.div>
                </div>
            </div>
            <div class="relative">
                <motion.div 
                    :initial="{ opacity: 0, y: 30 }" 
                    :whileInView="{ opacity: 1, y: 0 }"
                    :viewport="{ once: true, amount: 0.3 }" 
                    :transition="{ duration: 0.8, ease: 'easeOut' }" 
                    :whileHover="{ scale: 1.05 }"
                    class="relative aspect-[4/3] overflow-hidden rounded-lg border shadow-sm">
                    <NuxtImg 
                        :src="pageData.hero.image.src" 
                        :alt="pageData.hero.image.alt" 
                        fill 
                        loading="eager"
                        class="object-cover w-full h-full" 
                        priority="true" />
                </motion.div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <motion.section 
        :initial="{ opacity: 0, y: 30 }" 
        :whileInView="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.3 }" 
        :transition="{ duration: 0.8, ease: 'easeOut' }">
        <section aria-labelledby="about-heading" class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div class="grid grid-cols-1 items-start gap-8 md:grid-cols-[1.2fr_.8fr]">
                <div>
                    <h2 id="about-heading" :style="{ color: pageData.colors.secondary }" class="text-2xl font-semibold">
                        {{ pageData.about.heading }}
                    </h2>
                    <p :style="{ color: pageData.colors.tertiary }" class="mt-4">
                        {{ pageData.about.text }}
                    </p>
                    <div class="mt-6 grid gap-4 sm:grid-cols-2">
                        <div 
                            v-for="(feature, index) in pageData.about.features" 
                            :key="index"
                            class="flex items-start gap-3 rounded-lg border bg-white p-4 shadow-sm">
                            <component 
                                :is="components[feature.icon as FeatureIcon]" 
                                :style="{ color: pageData.colors.primaryDark }"
                                class="mt-0.5 h-5 w-5"
                                aria-hidden="true" />
                            <div>
                                <h3 class="font-medium">{{ feature.title }}</h3>
                                <p :style="{ color: pageData.colors.tertiary }" class="text-sm">{{ feature.desc }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <aside aria-labelledby="hours-heading" class="space-y-4">
                    <h2 id="hours-heading" :style="{ color: pageData.colors.secondary }" class="flex items-center gap-2 text-xl font-semibold">
                        <component 
                            :is="components[pageData.hours.icon as FeatureIcon]" 
                            :style="{ color: pageData.colors.primaryDark }"
                            class="h-5 w-5" 
                            aria-hidden="true" />
                        {{ pageData.hours.heading }}
                    </h2>
                    <HoursTable :hours="pageData.hours.hours" />
                    <div 
                        :style="{ backgroundColor: pageData.colors.primaryLight, color: pageData.colors.primaryDark }"
                        class="rounded-md border p-3 text-sm">
                        {{ pageData.hours.infoText }}
                    </div>
                </aside>
            </div>
        </section>
    </motion.section>

    <!-- CTA Section -->
    <motion.section 
        :initial="{ opacity: 0, y: 30 }" 
        :whileInView="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.3 }" 
        :transition="{ duration: 0.8, ease: 'easeOut' }">
        <section aria-labelledby="cta-heading" :style="{ backgroundColor: pageData.colors.quaternary }" class="border-t">
            <div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6">
                <h2 id="cta-heading" :style="{ color: pageData.colors.secondary }" class="text-2xl font-semibold">
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
                        :style="link.variant === 'primary' 
                            ? { backgroundColor: pageData.colors.primary, color: '#ffffff' }
                            : { color: pageData.colors.secondary }"
                        :class="link.variant === 'primary' 
                            ? 'rounded-md px-4 py-2 hover:transition-colors' 
                            : 'rounded-md border px-4 py-2 hover:transition-colors'"
                        @mouseenter="link.variant === 'primary' ? $event.target.style.backgroundColor = pageData.colors.primaryHover : $event.target.style.backgroundColor = pageData.colors.quinary"
                        @mouseleave="link.variant === 'primary' ? $event.target.style.backgroundColor = pageData.colors.primary : $event.target.style.backgroundColor = 'transparent'">
                        {{ link.text }}
                    </a>
                </div>
                <div class="relative mt-6 w-xs overflow-hidden rounded-lg border">
                    <NuxtImg 
                        :src="pageData.cta.image.src" 
                        :alt="pageData.cta.image.alt" 
                        fill
                        class="object-cover" 
                        loading="lazy" 
                        priority="true" />
                </div>
            </div>
        </section>
    </motion.section>
</template>