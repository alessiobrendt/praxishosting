<script setup lang="ts">
import { NuxtImg } from '#components';
import InfoSection from '~/components/ui/InfoSection.vue';
import { MapPin, ParkingCircle, FileText, Info } from 'lucide-vue-next';
import animationHeader from '~/components/ui/HeaderAnimation.vue'
import { motion } from 'motion-v'

const infos = [
  {
    title: "Anfahrt",
    icon: MapPin,
    content: [
      "Adresse: Musterstraße 1, 12345 Musterstadt",
      "ÖPNV: Linie 1/2, Haltestelle Musterplatz, 200 m Fußweg."
    ]
  },
  {
    title: "Parkmöglichkeiten",
    icon: ParkingCircle,
    content: [
      "Parkhaus Musterplatz (1 h kostenlos) und Kurzzeitparkplätze vor der Praxis."
    ]
  },
  {
    title: "Vorbereitung",
    icon: FileText,
    content: [
      "Versichertenkarte und ggf. Überweisungsschein mitbringen.",
      "Medikamentenliste und relevante Vorbefunde.",
      "Nüchtern erscheinen für bestimmte Blutuntersuchungen."
    ],
    isList: true
  },
  {
    title: "Praxisregeln",
    icon: Info,
    content: [
      "Bitte Terminvereinbarung vorab; bei Akutfällen kurze telefonische Anmeldung.",
      "Mund-Nasen-Schutz bei Infektzeichen empfohlen."
    ],
    isList: true
  }
];
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <animationHeader title="Patienteninformationen" subtitle="Wichtige Hinweise für Ihren Besuch in unserer Praxis." />

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div class="space-y-4">
        <motion.div v-for="(info, i) in infos" :key="info.title" :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true, amount: 0.3 }"
          :transition="{ duration: 0.8, ease: 'easeOut', delay: i * 0.15 }">
          <InfoSection :title="info.title" :icon="info.icon">
            <template v-if="info.isList">
              <ul class="list-inside list-disc space-y-1">
                <li v-for="item in info.content" :key="item">{{ item }}</li>
              </ul>
            </template>
            <template v-else>
              <p v-for="item in info.content" :key="item">{{ item }}</p>
            </template>
          </InfoSection>
        </motion.div>
      </div>
      <div class="space-y-4">

        <motion.div :initial="{ opacity: 0, y: 30 }" :whileInView="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.3 }" :transition="{ duration: 0.8, ease: 'easeOut' }"
          :hover="{ scale: 1.05 }" class="overflow-hidden rounded-md border">
          <iframe title="Karte zur Praxis Mustermann"
            src="https://www.google.com/maps?q=Musterstra%C3%9Fe%201%2C%2012345%20Musterstadt&output=embed"
            class="h-64 w-full" loading="lazy" />
        </motion.div>
        <motion.div :initial="{ opacity: 0, y: 30 }" :whileInView="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.3 }" :transition="{ duration: 0.8, ease: 'easeOut' }"
          :hover="{ scale: 1.05 }" class="relative overflow-hidden rounded-md border">
          <NuxtImg src="/images/placeholder.svg" alt="Barrierefreier Zugang zur Praxis" width="800" height="400"
            sizes="(max-width: 768px) 100vw, 50vw" class="h-auto w-full object-cover" />
        </motion.div>
      </div>
    </div>
  </section>
</template>