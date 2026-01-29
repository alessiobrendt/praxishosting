<script setup lang="ts">
import { NuxtImg } from '#components';

import Button from '~/components/ui/Button.vue';

import { motion } from "motion-v"


</script>

<template>
  <section aria-labelledby="hero-heading" class="relative">
    <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
      <div>

        <motion.h1 :initial="{ opacity: 0, x: 30 }" :whileInView="{ opacity: 1, x: 0 }"
          :viewport="{ once: true, amount: 0.3 }" :transition="{ duration: 0.8, ease: 'easeOut' }"
          class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Willkommen in der Praxis Mustermann
        </motion.h1>

        <motion.p :initial="{ opacity: 0, x: 30 }" :whileInView="{ opacity: 1, x: 0 }"
          :viewport="{ once: true, amount: 0.3 }" :transition="{ duration: 0.8, ease: 'easeOut', delay: 0.2 }"
          class="mt-4 text-slate-700">
          Ihre hausärztliche Versorgung mit Herz und Verstand – persönlich, modern und nah.</motion.p>

        <div class="mt-6 flex flex-wrap gap-3">
          <motion.div :whileHover="{ scale: 1.1 }" :whilePress="{ scale: 0.8 }">
            <Button variant="default">
              <a href="">Termin anfragen</a>
            </Button>
          </motion.div>
          <motion.div :whileHover="{ scale: 1.1 }" :whilePress="{ scale: 0.8 }">
            <Button variant="outline">
              <a href="/leistungen" class="text-black">Unsere Leistungen</a>
            </Button>
          </motion.div>

        </div>
      </div>
      <div class="relative">



        <motion.div :initial="{ opacity: 0, y: 30 }" :whileInView="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, amount: 0.3 }" :transition="{ duration: 0.8, ease: 'easeOut' }" :whileHover="{ scale: 1.05 }"
          class="relative aspect-[4/3] overflow-hidden rounded-lg border shadow-sm">
          <NuxtImg src="/images/image1.webp" alt="Behandlungszimmer der Praxis Mustermann" fill loading="eager"
            class="object-cover w-full h-full" priority="true" />
        </motion.div>


      </div>
    </div>
  </section>
</template>