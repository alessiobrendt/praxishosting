<script setup lang="ts">
import { motion } from 'motion-v';
import HeaderAnimation from '@/templates/praxisemerald/components/ui/HeaderAnimation.vue';

const posts = [
    {
        title: 'Grippeschutzimpfung: Jetzt Termin sichern',
        date: '2025-09-01',
        excerpt: 'Schützen Sie sich in der kommenden Saison – wir impfen ab sofort.',
        img: '/images/placeholder.svg',
    },
    {
        title: 'Neue Sprechzeiten am Donnerstag',
        date: '2025-08-15',
        excerpt: 'Zusätzliche Nachmittagssprechstunde von 15:00–18:00 Uhr.',
        img: '/images/placeholder.svg',
    },
    {
        title: 'Sommerhitze: Tipps zum Kreislauf-Schutz',
        date: '2025-07-10',
        excerpt: 'Ausreichend trinken, Mittagshitze meiden, Medikamente prüfen.',
        img: '/images/placeholder.svg',
    },
];
</script>

<template>
    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 @sm:px-6">
        <HeaderAnimation
            title="Aktuelles"
            subtitle="Neuigkeiten und wichtige Informationen aus unserer Praxis."
        />

        <ul class="grid grid-cols-1 gap-6 md:grid-cols-2 @md:grid-cols-2 lg:grid-cols-3 @lg:grid-cols-3">
            <motion.li
                v-for="(p, i) in posts"
                :key="p.title"
                :initial="{ opacity: 0, y: 30 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.3 }"
                :transition="{ duration: 0.8, ease: 'easeOut', delay: i * 0.15 }"
                :while-hover="{ scale: 1.1 }"
                class="rounded-lg border bg-white p-4 shadow-sm"
            >
                <div class="relative aspect-[3/2]">
                    <img
                        :src="p.img || '/images/placeholder.svg'"
                        :alt="p.title"
                        class="h-full w-full object-cover rounded-t-lg"
                    />
                </div>
                <div class="p-4">
                    <p class="text-xs text-slate-500">{{ new Date(p.date).toLocaleDateString('de-DE') }}</p>
                    <h2 class="mt-1 text-lg font-semibold text-slate-900">{{ p.title }}</h2>
                    <p class="mt-1 text-sm text-slate-700">{{ p.excerpt }}</p>
                    <a href="#" class="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline">
                        Mehr lesen
                    </a>
                </div>
            </motion.li>
        </ul>
    </section>
</template>
