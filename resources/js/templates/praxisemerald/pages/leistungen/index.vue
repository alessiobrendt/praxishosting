<script setup lang="ts">
import { CheckCircle2, HeartPulse, Syringe, FlaskConical, Activity } from 'lucide-vue-next';
import { motion } from 'motion-v';
import HeaderAnimation from '@/templates/praxisemerald/components/ui/HeaderAnimation.vue';

const groups = [
    {
        title: 'Vorsorge & Prävention',
        items: [
            'Gesundheits-Check-up (ab 18/35 Jahren)',
            'Krebsvorsorge (Haut, Darm, Prostata)',
            'Hautkrebsscreening',
            'Beratung zu Lebensstil, Ernährung und Bewegung',
        ],
        icon: CheckCircle2,
    },
    {
        title: 'Impfungen',
        items: [
            'Standardimpfungen (STIKO-Empfehlungen)',
            'Auffrischungsimpfungen',
            'Reiseimpfberatung',
            'Grippe- und COVID-19-Impfung',
        ],
        icon: Syringe,
    },
    {
        title: 'Diagnostik',
        items: [
            'EKG, ggf. Belastungs-EKG',
            'Langzeit-Blutdruckmessung',
            'Lungenfunktion (Spirometrie)',
            'Laboruntersuchungen',
        ],
        icon: FlaskConical,
    },
    {
        title: 'Behandlungen',
        items: [
            'Therapie akuter und chronischer Erkrankungen',
            'Wundversorgung',
            'Infusionen',
            'Disease-Management-Programme (DMP)',
        ],
        icon: HeartPulse,
    },
    {
        title: 'Beratung',
        items: ['Impfberatung', 'Reisemedizin', 'Schmerztherapie', 'Zweitmeinung'],
        icon: Activity,
    },
];
</script>

<template>
    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <HeaderAnimation
            title="Unsere Leistungen"
            subtitle="Umfassende medizinische Versorgung für Ihre Gesundheit"
        />

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div
                v-for="(g, i) in groups"
                :key="g.title"
                :initial="{ opacity: 0, y: 30 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.3 }"
                :transition="{ duration: 0.8, ease: 'easeOut', delay: i * 0.15 }"
                :while-hover="{ scale: 1.1 }"
                class="rounded-lg border bg-white p-5 shadow-sm"
            >
                <div class="mb-3 flex items-center gap-2">
                    <component :is="g.icon" class="h-5 w-5 text-emerald-700" aria-hidden="true" />
                    <h2 class="text-lg font-semibold text-slate-900">{{ g.title }}</h2>
                </div>
                <ul class="list-inside list-disc space-y-1 text-slate-700">
                    <li v-for="item in g.items" :key="item" class="text-sm">{{ item }}</li>
                </ul>
            </motion.div>
        </div>
    </section>
</template>
