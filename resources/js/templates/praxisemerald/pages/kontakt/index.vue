<script setup lang="ts">
import { MapPin, Phone, Mail, Clock } from 'lucide-vue-next';
import { motion } from 'motion-v';
import ContactForm from '@/templates/praxisemerald/components/ui/ContactForm.vue';
import HeaderAnimation from '@/templates/praxisemerald/components/ui/HeaderAnimation.vue';
import HoursTable from '@/templates/praxisemerald/components/ui/HoursTable.vue';
</script>

<template>
    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 @sm:px-6">
        <HeaderAnimation
            title="Kontaktieren Sie uns"
            subtitle="Wir sind für Sie da. Senden Sie uns eine Nachricht oder besuchen Sie uns."
        />

        <div class="grid grid-cols-1 gap-8 md:grid-cols-[1fr_.8fr] @md:grid-cols-[1fr_.8fr]">
            <div class="space-y-6">
                <motion.div
                    :initial="{ opacity: 0, y: 30 }"
                    :while-in-view="{ opacity: 1, y: 0 }"
                    :viewport="{ once: true, amount: 0.3 }"
                    :transition="{ duration: 0.8, ease: 'easeOut', delay: 0 }"
                    class="rounded-lg border bg-white p-4 shadow-sm"
                >
                    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2 @sm:grid-cols-2">
                        <motion.div
                            :initial="{ opacity: 0, x: -30 }"
                            :while-in-view="{ opacity: 1, x: 0 }"
                            :viewport="{ once: true, amount: 0.3 }"
                            :transition="{ duration: 0.6, ease: 'easeOut', delay: 0 }"
                        >
                            <dt class="flex items-center gap-2 text-sm font-medium text-slate-900">
                                <MapPin class="h-4 w-4 text-primary" aria-hidden="true" />
                                Adresse
                            </dt>
                            <dd class="mt-1 text-sm text-slate-700">Musterstraße 1, 12345 Musterstadt</dd>
                        </motion.div>
                        <motion.div
                            :initial="{ opacity: 0, x: -30 }"
                            :while-in-view="{ opacity: 1, x: 0 }"
                            :viewport="{ once: true, amount: 0.3 }"
                            :transition="{ duration: 0.6, ease: 'easeOut', delay: 0.07 }"
                        >
                            <dt class="flex items-center gap-2 text-sm font-medium text-slate-900">
                                <Phone class="h-4 w-4 text-primary" aria-hidden="true" />
                                Telefon
                            </dt>
                            <dd class="mt-1 text-sm">
                                <a href="tel:+491234567890" class="text-slate-700 underline">+49 123 4567890</a>
                            </dd>
                        </motion.div>
                        <motion.div
                            :initial="{ opacity: 0, x: -30 }"
                            :while-in-view="{ opacity: 1, x: 0 }"
                            :viewport="{ once: true, amount: 0.3 }"
                            :transition="{ duration: 0.6, ease: 'easeOut', delay: 0.14 }"
                        >
                            <dt class="flex items-center gap-2 text-sm font-medium text-slate-900">
                                <Mail class="h-4 w-4 text-primary" aria-hidden="true" />
                                E-Mail
                            </dt>
                            <dd class="mt-1 text-sm">
                                <a href="mailto:info@praxis-mustermann.de" class="text-slate-700 underline">
                                    info@praxis-mustermann.de
                                </a>
                            </dd>
                        </motion.div>
                        <motion.div
                            :initial="{ opacity: 0, x: -30 }"
                            :while-in-view="{ opacity: 1, x: 0 }"
                            :viewport="{ once: true, amount: 0.3 }"
                            :transition="{ duration: 0.6, ease: 'easeOut', delay: 0.21 }"
                        >
                            <dt class="flex items-center gap-2 text-sm font-medium text-slate-900">
                                <Clock class="h-4 w-4 text-primary" aria-hidden="true" />
                                Öffnungszeiten
                            </dt>
                            <dd class="mt-1 text-sm text-slate-700">Mo–Fr 08:00–12:00, Di/Do 15:00–18:00</dd>
                        </motion.div>
                    </dl>
                </motion.div>
                <motion.div
                    :initial="{ opacity: 0, y: 30 }"
                    :while-in-view="{ opacity: 1, y: 0 }"
                    :viewport="{ once: true, amount: 0.3 }"
                    :transition="{ duration: 0.8, ease: 'easeOut', delay: 0.15 }"
                >
                    <ContactForm />
                </motion.div>
            </div>

            <aside class="space-y-4">
                <motion.div
                    :initial="{ opacity: 0, y: 30 }"
                    :while-in-view="{ opacity: 1, y: 0 }"
                    :viewport="{ once: true, amount: 0.3 }"
                    :transition="{ duration: 0.8, ease: 'easeOut', delay: 0.3 }"
                    class="overflow-hidden rounded-md border"
                >
                    <iframe
                        title="Anfahrt zur Praxis"
                        src="https://www.google.com/maps?q=Musterstra%C3%9Fe%201%2C%2012345%20Musterstadt&output=embed"
                        class="h-72 w-full"
                        loading="lazy"
                    />
                </motion.div>
                <motion.div
                    :initial="{ opacity: 0, y: 30 }"
                    :while-in-view="{ opacity: 1, y: 0 }"
                    :viewport="{ once: true, amount: 0.3 }"
                    :transition="{ duration: 0.8, ease: 'easeOut', delay: 0.45 }"
                >
                    <HoursTable />
                </motion.div>
            </aside>
        </div>
    </section>
</template>
