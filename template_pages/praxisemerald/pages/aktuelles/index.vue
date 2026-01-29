<script setup lang="ts">

import animationHeader from '~/components/ui/HeaderAnimation.vue'
import { motion } from 'motion-v'

const posts = [
  {
    title: "Grippeschutzimpfung: Jetzt Termin sichern",
    date: "2025-09-01",
    excerpt: "Schützen Sie sich in der kommenden Saison – wir impfen ab sofort.",
    img: "/images/placeholder.svg",
  },
  {
    title: "Neue Sprechzeiten am Donnerstag",
    date: "2025-08-15",
    excerpt: "Zusätzliche Nachmittagssprechstunde von 15:00–18:00 Uhr.",
    img: "/images/placeholder.svg",
  },
  {
    title: "Sommerhitze: Tipps zum Kreislauf-Schutz",
    date: "2025-07-10",
    excerpt: "Ausreichend trinken, Mittagshitze meiden, Medikamente prüfen.",
    img: "/images/placeholder.svg",
  },
]

</script>


<template>

  <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">

    <animationHeader title="Aktuelles" subtitle="Neuigkeiten und wichtige Informationen aus unserer Praxis." />

    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">


      <motion.li :initial="{ opacity: 0, y: 30 }" :whileInView="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, amount: 0.3 }" :transition="{ duration: 0.8, ease: 'easeOut', delay: i * 0.15 }"
        :whileHover="{ scale: 1.1 }" v-for="(p, i) in posts" :key="p.title"
        class="rounded-lg border bg-white p-4 shadow-sm">


        <div className="relative aspect-[3/2]">
          <NuxtImg :src="p.img || '/images/placeholder.svg'" :alt="p.title" fill sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover" />
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-500">{{ new Date(p.date).toLocaleDateString("de-DE") }}</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{{ p.title }}</h2>
          <p className="mt-1 text-sm text-slate-700">{{ p.excerpt }}</p>
          <Link href="#" className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline">
          Mehr lesen
          </Link>
        </div>
      </motion.li>
    </ul>
  </section>


</template>