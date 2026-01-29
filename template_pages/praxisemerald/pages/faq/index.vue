<script setup lang="ts">

import Accordion from "~/components/ui/Accordion.vue";
import animationHeader from '~/components/ui/HeaderAnimation.vue'
import { motion } from 'motion-v'

const faqs = [
  {
    q: "Wie vereinbare ich einen Termin?",
    a: "Nutzen Sie unser Online-Formular oder rufen Sie uns an. Für Akutfälle bieten wir täglich eine Akutsprechstunde an.",
  },
  {
    q: "Welche Unterlagen soll ich mitbringen?",
    a: "Versichertenkarte, ggf. Überweisung, Medikamentenliste und relevante Vorbefunde.",
  },
  {
    q: "Wie erhalte ich Rezepte oder Überweisungen?",
    a: "Bestellen Sie telefonisch oder per E-Mail vor. Abholung am Folgetag in der Praxis.",
  },
  {
    q: "Bieten Sie Reisemedizin an?",
    a: "Ja, inklusive Impfberatung. Bitte bringen Sie Ihren Impfausweis mit.",
  },
]
</script>


<template>
  <section class="mx-auto max-w-3xl px-4 py-12 sm:px-6 flex flex-col gap-8">

    <animationHeader title="Häufige Fragen" subtitle="Antworten auf die meistgestellten Fragen unserer Patienten." />

    <div class="flex flex-col gap-6">
      <motion.div v-for="(faq, i) in faqs" :key="faq.q" :initial="{ opacity: 0, y: 30 }"
        :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true, amount: 0.3 }"
        :transition="{ duration: 0.8, ease: 'easeOut', delay: i * 0.15 }">
        <Accordion :question="faq.q" :answer="faq.a" />
      </motion.div>
    </div>
  </section>
</template>