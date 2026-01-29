<script setup lang="ts">

import { ref } from 'vue'
const pending = ref(false);
import Button from '~/components/ui/Button.vue';
import Captcha from '~/components/ui/Captcha.vue';
import { motion } from 'motion-v'
const a = Math.floor(Math.random() * 10) + 1;
const b = Math.floor(Math.random() * 10) + 1;

</script>

<template>
  <form class="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
    <motion.div
      :initial="{ opacity: 0, y: 30 }"
      :whileInView="{ opacity: 1, y: 0 }"
      :viewport="{ once: true, amount: 0.3 }"
      :transition="{ duration: 0.7, ease: 'easeOut', delay: 0 }"
      class="grid gap-4 sm:grid-cols-2"
    >
      <div>
        <label for="name" class="mb-1 block text-sm font-medium text-slate-900">
          Name
        </label>
        <input id="name" name="name" type="text" autocomplete="name" required
          class="block w-full rounded-md border px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2" />
      </div>
      <div>
        <label for="email" class="mb-1 block text-sm font-medium text-slate-900">
          E-Mail
        </label>
        <input id="email" name="email" type="email" autocomplete="email" required
          class="block w-full rounded-md border px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2" />
      </div>
      <div>
        <label for="phone" class="mb-1 block text-sm font-medium text-slate-900">
          Telefon
        </label>
        <input id="phone" name="phone" type="tel" autocomplete="tel"
          class="block w-full rounded-md border px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2" />
      </div>
      <div class="sm:col-span-2">
        <label for="subject" class="mb-1 block text-sm font-medium text-slate-900">
          Betreff
        </label>
        <input id="subject" name="subject" type="text" required
          class="block w-full rounded-md border px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2" />
      </div>
      <div class="sm:col-span-2">
        <label for="message" class="mb-1 block text-sm font-medium text-slate-900">
          Nachricht
        </label>
        <textarea id="message" name="message" rows="5" required
          class="block w-full rounded-md border px-3 py-2 text-sm outline-none ring-emerald-600 focus:ring-2" />
      </div>
    </motion.div>

    <motion.div
      :initial="{ opacity: 0, y: 30 }"
      :whileInView="{ opacity: 1, y: 0 }"
      :viewport="{ once: true, amount: 0.3 }"
      :transition="{ duration: 0.7, ease: 'easeOut', delay: 0.15 }"
    >
      <Captcha :a="a" :b="b" />
    </motion.div>

    <motion.div
      :initial="{ opacity: 0, y: 30 }"
      :whileInView="{ opacity: 1, y: 0 }"
      :viewport="{ once: true, amount: 0.3 }"
      :transition="{ duration: 0.7, ease: 'easeOut', delay: 0.3 }"
      class="flex items-center justify-between gap-3"
    >
      <p class="text-xs text-slate-600">
        Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer
        <a class="underline hover:text-emerald-700" href="">
          Datenschutzerklärung
        </a>
        zu.
      </p>
      <Button type="submit" :disabled="pending" class="bg-emerald-600 hover:bg-emerald-700 w-[16rem]">
        {{ pending ? "Senden..." : "Nachricht senden" }}
      </Button>
    </motion.div>
  </form>
</template>