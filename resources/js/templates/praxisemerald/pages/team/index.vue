<script setup lang="ts">
import { motion } from 'motion-v';
import HeaderAnimation from '@/templates/praxisemerald/components/ui/HeaderAnimation.vue';

const team = [
    {
        name: 'Dr. med. Anna Mustermann',
        role: 'Fachärztin für Allgemeinmedizin',
        bio: 'Schwerpunkte: Prävention, Impfmedizin und hausärztliche Versorgung.',
        img: '/images/placeholder.svg',
    },
    {
        name: 'Dr. med. Max Beispiel',
        role: 'Facharzt für Innere Medizin',
        bio: 'Schwerpunkte: Kardiologie, Stoffwechsel und chronische Erkrankungen.',
        img: '/images/placeholder.svg',
    },
    {
        name: 'Lisa Pflege',
        role: 'Medizinische Fachangestellte',
        bio: 'Anmeldung, Impfungen und Blutabnahmen.',
        img: '/images/placeholder.svg',
    },
    {
        name: 'Tom Assist',
        role: 'Praxisassistent',
        bio: 'Organisation, Diagnostikunterstützung, Patientenservice.',
        img: '/images/placeholder.svg',
    },
];
</script>

<template>
    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 @sm:px-6">
        <HeaderAnimation
            title="Unser Team"
            subtitle="Lernen Sie die Menschen hinter der Praxis kennen."
        />

        <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 @sm:grid-cols-2 lg:grid-cols-3 @lg:grid-cols-3">
            <motion.li
                v-for="(m, i) in team"
                :key="m.name"
                :initial="{ opacity: 0, y: 30 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.3 }"
                :transition="{ duration: 0.8, ease: 'easeOut', delay: i * 0.15 }"
                :while-hover="{ scale: 1.1 }"
                class="rounded-lg border bg-white p-4 shadow-sm"
            >
                <div class="relative aspect-square overflow-hidden rounded-md">
                    <img
                        :src="m.img || '/images/placeholder.svg'"
                        :alt="`Portrait von ${m.name}`"
                        class="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
                <h2 class="mt-4 text-lg font-semibold text-slate-900">{{ m.name }}</h2>
                <p class="text-sm text-emerald-700">{{ m.role }}</p>
                <p class="mt-2 text-sm text-slate-700">{{ m.bio }}</p>
            </motion.li>
        </ul>
    </section>
</template>
