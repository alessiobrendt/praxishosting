<script setup lang="ts">
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import { User, Lock, Shield, ShieldCheck, Palette } from 'lucide-vue-next';
import type { NavItem } from '@/types';

const page = usePage();
const { isCurrentUrl } = useCurrentUrl();

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profil',
        href: '/settings/profile',
        icon: User,
    },
    {
        title: 'Passwort',
        href: '/settings/password',
        icon: Lock,
    },
    {
        title: 'Sicherheit',
        href: '/settings/security',
        icon: ShieldCheck,
    },
    {
        title: 'Zwei-Faktor-Authentifizierung',
        href: '/settings/two-factor',
        icon: Shield,
    },
    {
        title: 'Erscheinungsbild',
        href: '/settings/appearance',
        icon: Palette,
    },
];
</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col lg:flex-row lg:space-x-12">
            <aside class="w-full max-w-xs lg:w-64">
                <nav class="flex flex-col space-y-1" aria-label="Settings">
                    <Link
                        v-for="item in sidebarNavItems"
                        :key="toUrl(item.href)"
                        :href="item.href"
                    >
                        <Button
                            variant="ghost"
                            :class="[
                                'w-full justify-start',
                                isCurrentUrl(item.href) && 'bg-gray-100 dark:bg-gray-800',
                            ]"
                        >
                            <component :is="item.icon" class="mr-2 h-4 w-4" />
                            {{ item.title }}
                        </Button>
                    </Link>
                </nav>
            </aside>

            <Separator class="my-6 lg:hidden" />

            <div class="flex-1 md:max-w-2xl">
                <section class="max-w-xl space-y-6">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>
