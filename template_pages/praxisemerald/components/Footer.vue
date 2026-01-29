<script setup lang="ts">
import { Clock, Mail, Phone, MapPin } from 'lucide-vue-next';
import { motion } from 'motion-v'
</script>

<template>
    <footer class="mt-16 border-t bg-slate-50">
        <motion.div
            :initial="{ opacity: 0, y: 40 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :viewport="{ once: true, amount: 0.2 }"
            :transition="{ duration: 0.8, ease: 'easeOut' }"
            class="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6"
        >
            <motion.div
                :initial="{ opacity: 0, x: -30 }"
                :whileInView="{ opacity: 1, x: 0 }"
                :viewport="{ once: true, amount: 0.2 }"
                :transition="{ duration: 0.7, ease: 'easeOut', delay: 0 }"
            >
                <h3 class="text-sm font-semibold text-slate-900">Praxis Mustermann</h3>
                <p class="mt-2 text-sm text-slate-700">
                    Ihre Hausarztpraxis für Allgemeinmedizin, Vorsorge und Impfungen.
                </p>
                <div class="mt-4 space-y-2 text-sm text-slate-700">
                    <p class="flex items-center gap-2">
                        <MapPin class="h-4 w-4 text-emerald-700" aria-hidden="true" />
                        Musterstraße 1, 12345 Musterstadt
                    </p>
                    <p class="flex items-center gap-2">
                        <Phone class="h-4 w-4 text-emerald-700" aria-hidden="true" />
                        <a href="tel:+491234567890" class="hover:underline">
                            +49 123 4567890
                        </a>
                    </p>
                    <p class="flex items-center gap-2">
                        <Mail class="h-4 w-4 text-emerald-700" aria-hidden="true" />
                        <a href="mailto:info@praxis-mustermann.de" class="hover:underline">
                            info@praxis-mustermann.de
                        </a>
                    </p>
                    <p class="flex items-center gap-2">
                        <Clock class="h-4 w-4 text-emerald-700" aria-hidden="true" />
                        Mo–Fr 08:00–12:00, Di/Do 15:00–18:00
                    </p>
                </div>
            </motion.div>
            <motion.div
                :initial="{ opacity: 0, y: 30 }"
                :whileInView="{ opacity: 1, y: 0 }"
                :viewport="{ once: true, amount: 0.2 }"
                :transition="{ duration: 0.7, ease: 'easeOut', delay: 0.1 }"
            >
                <h3 class="text-sm font-semibold text-slate-900">Seiten</h3>
                <ul class="mt-2 space-y-2 text-sm">
                    <li>
                        <a href="/leistungen" class="hover:underline">
                            Leistungen
                        </a>
                    </li>
                    <li>
                        <a href="/team" class="hover:underline">
                            Team
                        </a>
                    </li>
                    <li>
                        <a href="/faq" class="hover:underline">
                            FAQ
                        </a>
                    </li>
                    <li>
                        <a href="/aktuelles" class="hover:underline">
                            Aktuelles
                        </a>
                    </li>
                    <li>
                        <a href="/kontakt" class="hover:underline">
                            Kontakt
                        </a>
                    </li>
                </ul>
            </motion.div>
            <motion.div
                :initial="{ opacity: 0, x: 30 }"
                :whileInView="{ opacity: 1, x: 0 }"
                :viewport="{ once: true, amount: 0.2 }"
                :transition="{ duration: 0.7, ease: 'easeOut', delay: 0.2 }"
            >
                <h3 class="text-sm font-semibold text-slate-900">Rechtliches</h3>
                <ul class="mt-2 space-y-2 text-sm">
                    <li>
                        <a href="" class="hover:underline">
                            Impressum
                        </a>
                    </li>
                    <li>
                        <a href="" class="hover:underline">
                            Datenschutz
                        </a>
                    </li>
                </ul>
            </motion.div>
        </motion.div>
        <motion.div
            :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :viewport="{ once: true, amount: 0.2 }"
            :transition="{ duration: 0.7, ease: 'easeOut', delay: 0.3 }"
            class="border-t"
        >
            <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                <p class="text-xs text-slate-600">© {{ new Date().getFullYear() }} Praxis Mustermann</p>
                <p class="text-xs text-slate-600">Erstellt mit Nuxt.js und Tailwind CSS von <a
                        href="https://www.linkedin.com/in/alessio-brendt-8000b52b9/?originalSubdomain=de">Alessio
                        Brendt</a></p>
            </div>
        </motion.div>
    </footer>
</template>