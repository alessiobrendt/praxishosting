<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Bell, Key, Lock, Palette, Shield, ShieldCheck, User } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

const { isCurrentUrl } = useCurrentUrl();

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profil',
        href: '/settings/profile',
        icon: User,
    },
    {
        title: 'Benachrichtigungen',
        href: '/settings/notifications',
        icon: Bell,
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
    {
        title: 'API-Tokens',
        href: '/settings/api-tokens',
        icon: Key,
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

            <div class="min-w-0 flex-1">
                <section class="w-full space-y-6">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>
