<script setup lang="ts">

import { motion } from 'motion-v'

defineProps<{
    title: string;
    subtitle: string;
}>();

</script>

<template>
    <header class="mb-8 max-w-3xl">
        <motion.h1 :initial="{ opacity: 0, x: 30 }" :whileInView="{ opacity: 1, x: 0 }"
            :viewport="{ once: true, amount: 0.3 }" :transition="{ duration: 0.8, ease: 'easeOut' }"
            class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {{ title }}
        </motion.h1>

        <motion.p :initial="{ opacity: 0, x: 30 }" :whileInView="{ opacity: 1, x: 0 }"
            :viewport="{ once: true, amount: 0.3 }" :transition="{ duration: 0.8, ease: 'easeOut' }"
            class="mt-3 text-slate-700">
            {{ subtitle }}
        </motion.p>
    </header>
</template>