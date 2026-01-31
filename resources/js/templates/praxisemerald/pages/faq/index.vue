<script setup lang="ts">
import { motion } from 'motion-v';
import Accordion from '@/templates/praxisemerald/components/ui/Accordion.vue';
import HeaderAnimation from '@/templates/praxisemerald/components/ui/HeaderAnimation.vue';

const faqs = [
    {
        q: 'Wie vereinbare ich einen Termin?',
        a: 'Nutzen Sie unser Online-Formular oder rufen Sie uns an. Für Akutfälle bieten wir täglich eine Akutsprechstunde an.',
    },
    {
        q: 'Welche Unterlagen soll ich mitbringen?',
        a: 'Versichertenkarte, ggf. Überweisung, Medikamentenliste und relevante Vorbefunde.',
    },
    {
        q: 'Wie erhalte ich Rezepte oder Überweisungen?',
        a: 'Bestellen Sie telefonisch oder per E-Mail vor. Abholung am Folgetag in der Praxis.',
    },
    {
        q: 'Bieten Sie Reisemedizin an?',
        a: 'Ja, inklusive Impfberatung. Bitte bringen Sie Ihren Impfausweis mit.',
    },
];
</script>

<template>
    <section class="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
        <HeaderAnimation
            title="Häufige Fragen"
            subtitle="Antworten auf die meistgestellten Fragen unserer Patienten."
        />

        <div class="flex flex-col gap-6">
            <motion.div
                v-for="(faq, i) in faqs"
                :key="faq.q"
                :initial="{ opacity: 0, y: 30 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.3 }"
                :transition="{ duration: 0.8, ease: 'easeOut', delay: i * 0.15 }"
            >
                <Accordion :question="faq.q" :answer="faq.a" />
            </motion.div>
        </div>
    </section>
</template>
