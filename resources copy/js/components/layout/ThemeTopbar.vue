<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { useMediaQuery } from '@vueuse/core';
import {
    LogOut,
    Menu,
    Sun,
    Moon,
    Monitor,
    Settings,
    Bell,
    User,
    Wallet,
    FileText,
    Mail,
    Gift,
    Lock,
} from 'lucide-vue-next';
import { inject, watch } from 'vue';
import type { Ref } from 'vue';
import { Avatar } from '@/components/ui/avatar';
import { useAppearance } from '@/composables/useAppearance';
import { logout } from '@/routes';
import { index as billingIndex } from '@/routes/billing';
import profile from '@/routes/profile';
import { create as supportCreate } from '@/routes/support';
import type { BreadcrumbItem } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    customizerId?: string;
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
    customizerId: 'theme-customization',
});

const isMobile = useMediaQuery('(max-width: 1023px)');
const openMobileSidebar = inject<() => void>('openMobileSidebar', () => {});
const isSidebarCollapsed = inject<Ref<boolean> | null>('isSidebarCollapsed', null);
const toggleSidebarCollapsed = inject<() => void>('toggleSidebarCollapsed', () => {});

const { appearance, updateAppearance } = useAppearance();

watch(appearance, (value) => {
    updateAppearance(value);
}, { immediate: false });

function onSidebarToggle() {
    if (isMobile.value) {
        openMobileSidebar();
    } else {
        toggleSidebarCollapsed();
    }
}

function openCustomizer() {
    const el = document.querySelector(`#${props.customizerId}`);
    if (el && typeof (window as unknown as { HSOverlay?: { open: (el: Element) => void } }).HSOverlay?.open === 'function') {
        (window as unknown as { HSOverlay: { open: (el: Element) => void } }).HSOverlay.open(el);
    }
    el?.dispatchEvent(new CustomEvent('open'));
}
</script>

<template>
    <header class="app-header theme-topbar border-b border-default-200/80 bg-[var(--topbar-bg)] shadow-sm backdrop-blur-md dark:border-default-700/50">
        <div class="container-fluid flex h-full items-center justify-between gap-4">
            <!-- Left: logo (desktop) + menu toggle -->
            <div class="flex items-center gap-3">
                <div class="logo-topbar hidden md:block">
                    <Link class="logo-box flex items-center gap-2" href="/">
                        <div class="logo-light hidden">
                            <img alt="Logo" class="logo-lg h-7" src="/images/logo.png" />
                            <img alt="Logo" class="logo-sm h-7" src="/images/logo-sm.png" />
                        </div>
                        <div class="logo-dark flex items-center">
                            <img alt="Logo" class="logo-lg h-7" src="/images/logo.png" />
                            <img alt="Logo" class="logo-sm h-7 hidden" src="/images/logo-sm.png" />
                        </div>
                    </Link>
                </div>
                <button
                    id="button-toggle-menu"
                    type="button"
                    class="sidenav-toggle-button flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-colors hover:opacity-90"
                    aria-label="Menü umschalten"
                    @click="onSidebarToggle"
                >
                    <Menu class="size-5" />
                </button>
            </div>

            <!-- Right: theme, notifications, customizer, user -->
            <div class="flex items-center gap-1">
                <!-- Theme (Light/Dark/System) -->
                <div class="topbar-item hs-dropdown relative inline-flex [--auto-close:inside] [--placement:bottom-right]">
                    <button
                        type="button"
                        class="topbar-link hs-dropdown-toggle flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                        aria-expanded="false"
                        aria-haspopup="menu"
                        aria-label="Design wechseln"
                    >
                        <Sun v-if="appearance === 'light'" class="topbar-link-icon size-5" />
                        <Moon v-else-if="appearance === 'dark'" class="topbar-link-icon size-5" />
                        <Monitor v-else class="topbar-link-icon size-5" />
                    </button>
                    <div
                        class="hs-dropdown-menu theme-dropdown hidden min-w-40 rounded-xl border border-default-200 bg-white py-1 shadow-lg dark:border-default-700 dark:bg-neutral-800"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        <div class="theme-mode">
                            <input
                                id="topbar-dropdown-light"
                                v-model="appearance"
                                type="radio"
                                name="data-theme"
                                value="light"
                                class="peer invisible absolute size-0"
                            />
                            <label
                                for="topbar-dropdown-light"
                                class="dropdown-item flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 peer-checked:bg-default-100 dark:peer-checked:bg-default-800"
                            >
                                <Sun class="size-4" />
                                Light
                            </label>
                        </div>
                        <div class="theme-mode">
                            <input
                                id="topbar-dropdown-dark"
                                v-model="appearance"
                                type="radio"
                                name="data-theme"
                                value="dark"
                                class="peer invisible absolute size-0"
                            />
                            <label
                                for="topbar-dropdown-dark"
                                class="dropdown-item flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 peer-checked:bg-default-100 dark:peer-checked:bg-default-800"
                            >
                                <Moon class="size-4" />
                                Dark
                            </label>
                        </div>
                        <div class="theme-mode">
                            <input
                                id="topbar-dropdown-system"
                                v-model="appearance"
                                type="radio"
                                name="data-theme"
                                value="system"
                                class="peer invisible absolute size-0"
                            />
                            <label
                                for="topbar-dropdown-system"
                                class="dropdown-item flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 peer-checked:bg-default-100 dark:peer-checked:bg-default-800"
                            >
                                <Monitor class="size-4" />
                                System
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Notifications -->
                <div class="topbar-item hs-dropdown relative inline-flex [--auto-close:inside] [--placement:bottom-right]">
                    <button
                        type="button"
                        class="topbar-link hs-dropdown-toggle relative flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                        aria-expanded="false"
                        aria-haspopup="menu"
                        aria-label="Benachrichtigungen"
                    >
                        <Bell class="topbar-link-icon size-5" />
                    </button>
                    <div
                        class="hs-dropdown-menu theme-dropdown hidden min-w-80 rounded-xl border border-default-200 bg-white p-0 shadow-lg dark:border-default-700 dark:bg-neutral-800"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        <div class="border-default-200 flex items-center justify-between border-b px-4 py-3 dark:border-default-700">
                            <h6 class="text-sm font-semibold">Benachrichtigungen</h6>
                        </div>
                        <div class="p-6 text-center text-sm text-default-500">
                            Keine neuen Benachrichtigungen.
                        </div>
                    </div>
                </div>

                <!-- Customizer -->
                <div class="topbar-item btn-theme-setting">
                    <button
                        type="button"
                        class="topbar-link flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                        aria-label="Theme anpassen"
                        :data-hs-overlay="`#${props.customizerId}`"
                        @click="openCustomizer"
                    >
                        <Settings class="topbar-link-icon size-5" />
                    </button>
                </div>

                <!-- User dropdown -->
                <div
                    v-if="user"
                    class="topbar-item hs-dropdown relative ms-2 inline-flex items-center before:absolute before:start-0 before:top-1/2 before:h-5 before:w-px before:-translate-y-1/2 before:bg-default-300 before:content-[''] dark:before:bg-default-600 [--auto-close:inside] [--placement:bottom-right]"
                >
                    <button
                        type="button"
                        class="hs-dropdown-toggle topbar-link flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10 lg:gap-3 lg:px-3"
                        aria-expanded="false"
                        aria-haspopup="menu"
                        aria-label="Profil"
                    >
                        <Avatar :name="user.name" :src="user.avatar" size="sm" class="size-8 shrink-0 rounded-full" />
                        <div class="hidden flex-col items-start lg:flex">
                            <span class="pro-username text-sm font-medium">{{ user.name }}</span>
                            <span class="text-xs text-default-500">{{ user.email }}</span>
                        </div>
                    </button>
                    <div
                        class="hs-dropdown-menu theme-dropdown hidden min-w-52 rounded-xl border border-default-200 bg-white py-1 shadow-lg dark:border-default-700 dark:bg-neutral-800"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        <div class="px-3.5 py-2">
                            <p class="text-xs font-medium text-default-500">Willkommen, {{ user.name }}</p>
                        </div>
                        <Link
                            :href="profile.edit.url()"
                            class="dropdown-item flex items-center gap-2 rounded-lg px-3 py-2"
                        >
                            <User class="size-4 shrink-0" />
                            Einstellungen
                        </Link>
                        <Link
                            :href="billingIndex.url()"
                            class="dropdown-item flex items-center gap-2 rounded-lg px-3 py-2"
                        >
                            <Wallet class="size-4 shrink-0" />
                            Guthaben & Rechnungen
                        </Link>
                        <Link
                            :href="supportCreate.url()"
                            class="dropdown-item flex items-center gap-2 rounded-lg px-3 py-2"
                        >
                            <FileText class="size-4 shrink-0" />
                            Ticket erstellen
                        </Link>
                        <Link
                            href="/account/postfach"
                            class="dropdown-item flex items-center gap-2 rounded-lg px-3 py-2"
                        >
                            <Mail class="size-4 shrink-0" />
                            Postfach
                        </Link>
                        <Link
                            href="/billing/redeem-voucher"
                            class="dropdown-item flex items-center gap-2 rounded-lg px-3 py-2"
                        >
                            <Gift class="size-4 shrink-0" />
                            Gutscheincode einlösen
                        </Link>
                        <div class="dropdown-divider my-1" />
                        <Link
                            href="/auth/lock-screen"
                            class="dropdown-item flex items-center gap-2 rounded-lg px-3 py-2"
                        >
                            <Lock class="size-4 shrink-0" />
                            Bildschirm sperren
                        </Link>
                        <button
                            type="button"
                            class="dropdown-item flex w-full items-center gap-2 rounded-lg px-3 py-2 font-medium text-danger"
                            @click="() => router.post(logout().url())"
                        >
                            <LogOut class="size-4 shrink-0" />
                            Abmelden
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
