<script setup lang="ts">
import { AlertTriangle, Ambulance, Phone, Clock } from 'lucide-vue-next';
import { motion } from 'motion-v';
import Card from '@/templates/praxisemerald/components/ui/Card.vue';
import HeaderAnimation from '@/templates/praxisemerald/components/ui/HeaderAnimation.vue';

const notfallInfos = [
    {
        title: 'Rettungsdienst',
        icon: Ambulance,
        highlight: '112',
        desc: 'Bei lebensbedrohlichen Notfällen (z. B. Brustschmerzen, Atemnot, Bewusstlosigkeit).',
        href: 'tel:112',
    },
    {
        title: 'Ärztlicher Bereitschaftsdienst',
        icon: Phone,
        highlight: '116 117',
        desc: 'Außerhalb der Sprechzeiten bei nicht lebensbedrohlichen Beschwerden.',
        href: 'tel:116117',
    },
    {
        title: 'Giftnotruf',
        icon: Phone,
        highlight: '030 19240',
        desc: 'Bei Vergiftungen oder Verdacht.',
        href: 'tel:+493019240',
    },
];
</script>

<template>
    <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <HeaderAnimation
            title="Notfallinformationen"
            subtitle="Bei akuten, lebensbedrohlichen Beschwerden zögern Sie nicht, den Rettungsdienst zu rufen."
        />

        <div class="space-y-4">
            <motion.div
                v-for="(info, i) in notfallInfos"
                :key="info.title"
                :initial="{ opacity: 0, y: 30 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.3 }"
                :transition="{ duration: 0.8, ease: 'easeOut', delay: i * 0.15 }"
            >
                <Card
                    :title="info.title"
                    :icon="info.icon"
                    :highlight="info.highlight"
                    :desc="info.desc"
                    :href="info.href"
                />
            </motion.div>

            <motion.div
                :initial="{ opacity: 0, y: 30 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.3 }"
                :transition="{ duration: 0.8, ease: 'easeOut', delay: notfallInfos.length * 0.15 }"
            >
                <div class="rounded-lg border bg-yellow-50 p-4 text-sm text-yellow-900">
                    <p class="flex items-center gap-2">
                        <Clock class="h-4 w-4" aria-hidden="true" />
                        Notfallsprechstunde in der Praxis: täglich vormittags.
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
</template>
