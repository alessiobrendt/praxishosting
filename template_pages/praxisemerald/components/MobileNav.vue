<script setup lang="ts">
import { ref } from 'vue'
import { NuxtLink, NuxtImg } from '#components'
import Button from '~/components/ui/Button.vue'
import { motion } from 'motion-v'

const open = ref(false)

defineProps<{
  links: { href: string, label: string }[];
}>();
</script>

<template>
  <div class="lg:hidden pr-2">
    <!-- Burger Button -->
    <button
      @click="open = !open"
      class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      aria-label="Menü öffnen"
    >
      <span class="sr-only">Menü öffnen</span>
      <svg v-if="!open" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
      <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <!-- Overlay & Menu -->
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        @click="open = false"
      />
    </transition>
    <transition name="slide">
      <nav
        v-if="open"
        class="fixed inset-0 z-50 h-screen w-screen bg-white shadow-lg transition"
      >
        <div class="relative flex flex-col h-full">
          <!-- Close Button -->
          <button
            @click="open = false"
            class="absolute right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            aria-label="Menü schließen"
          >
            <span class="sr-only">Menü schließen</span>
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Logo & Praxisname -->
          <motion.a
            href="/"
            class="flex items-center gap-2 px-6 pt-6 pb-2"
            aria-label="Zur Startseite"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, ease: 'easeOut', delay: 0 }"
            @click="open = false"
          >
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white">
              <NuxtImg src="/images/logo.png" alt="Empfangsbereich der Praxis Mustermann" fill
                class="object-cover h-5 w-5" loading="lazy" priority="true" width="32" height="32" />
            </span>
            <span class="font-semibold text-lg">Praxis Mustermann</span>
          </motion.a>

          <!-- Navigation Links -->
          <ul class="flex flex-col gap-2 p-6 flex-1">
            <motion.li
              v-for="(link, i) in links"
              :key="link.href"
              :initial="{ opacity: 0, x: 30 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.5, ease: 'easeOut', delay: 0.1 + i * 0.07 }"
            >
              <NuxtLink
                :to="link.href"
                class="block rounded px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                @click="open = false"
              >
                {{ link.label }}
              </NuxtLink>
            </motion.li>
            <motion.li
              :initial="{ opacity: 0, x: 30 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.5, ease: 'easeOut', delay: 0.1 + links.length * 0.07 }"
              class="mt-4"
            >
              <Button variant="default" size="sm" class="w-full">
                <a href="">Termin vereinbaren</a>
              </Button>
            </motion.li>
          </ul>
        </div>
      </nav>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.25s; }
.slide-enter-from { transform: translateX(100%); }
.slide-leave-to { transform: translateX(100%); }
</style>