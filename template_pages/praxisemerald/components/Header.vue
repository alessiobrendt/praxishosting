<script setup lang="ts">
import { NuxtLink } from '#components';
import Button from '~/components/ui/Button.vue';

import MobileNav from '~/components/MobileNav.vue'

const links = [
    { href: "/", label: "Startseite" },
    { href: "/team", label: "Team" },
    { href: "/leistungen", label: "Leistungen" },
    { href: "/patienteninformationen", label: "Patienteninformationen" },
    { href: "/faq", label: "FAQ" },
    { href: "/aktuelles", label: "Aktuelles" },
    { href: "/notfallinformationen", label: "Notfall" },
    { href: "/kontakt", label: "Kontakt" },
];
</script>

<template>


    <header
        class="fixed inset-x-0 top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <a href="/" class="flex items-center gap-2" aria-label="Zur Startseite">
                <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white">
                    <NuxtImg src="/images/logo.png" alt="Empfangsbereich der Praxis Mustermann" fill
                        class="object-cover h-5 w-5" loading="lazy" priority="true" width="32" height="32" />
                </span>
                
                <span class="font-semibold">Praxis Mustermann</span>
            </a>
            <div aria-label="Hauptnavigation" class="hidden lg:block">
                <ul class="flex items-center gap-4">
                    <li>
                        <NuxtLink v-for="link in links" :key="link.href" :to="link.href" :class="{
                            'text-emerald-600': $route.path === link.href,
                            'text-slate-700': !($route.path === link.href)
                        }"
                            class="rounded px-2 py-1 text-sm font-medium transition-colors hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
                            {{ link.label }}
                        </NuxtLink>
                    </li>
                </ul>
            </div>
            <div class="flex items-center gap-4">
                <Button variant="default" size="sm" class="hidden sm:inline-flex">
                    <a href="">Termin vereinbaren</a>
                </Button>
                <MobileNav :links="links"/>
            </div>
        </div>
    </header>
</template>