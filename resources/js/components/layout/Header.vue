<script setup lang="ts">
import { computed, inject } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import { useMediaQuery } from '@vueuse/core';
import { logout } from '@/routes';
import { index as billingIndex } from '@/routes/billing';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import { Bell, Search, Settings, LogOut, Menu, Wallet, FileText, Mail, Gift } from 'lucide-vue-next';
import type { Ref } from 'vue';
import type { BreadcrumbItem } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const isMobile = useMediaQuery('(max-width: 1023px)');
const openMobileSidebar = inject<() => void>('openMobileSidebar', () => {});
const isSidebarCollapsed = inject<Ref<boolean> | null>('isSidebarCollapsed', null);
const toggleSidebarCollapsed = inject<() => void>('toggleSidebarCollapsed', () => {});

function onSidebarToggle() {
    if (isMobile.value) {
        openMobileSidebar();
    } else {
        toggleSidebarCollapsed();
    }
}

const page = usePage();
const showBalance = computed(
    () =>
        (page.props.brandFeatures as Record<string, boolean> | undefined)?.prepaid_balance === true &&
        typeof (page.props.auth as { customerBalance?: number })?.customerBalance === 'number',
);
const customerBalance = computed(
    () => (page.props.auth as { customerBalance?: number })?.customerBalance ?? 0,
);

const headerClasses = computed(() =>
    cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80',
        'px-6 shadow-modern',
    ),
);
</script>

<template>
    <header :class="headerClasses">
        <div class="flex flex-1 items-center gap-4">
            <button
                type="button"
                class="-ml-2 rounded-lg p-2 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800 lg:ml-0"
                :aria-label="isSidebarCollapsed?.value ? 'Sidebar aufklappen' : (isMobile ? 'Menü öffnen' : 'Sidebar einklappen')"
                @click.stop="onSidebarToggle"
            >
                <Menu class="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <Breadcrumb v-if="breadcrumbs.length > 0" :items="breadcrumbs" />
        </div>

        <div class="flex items-center gap-2">
            <!-- Guthaben (Prepaid) -->
            <Link
                v-if="showBalance"
                :href="billingIndex.url()"
                class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-modern hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
                <Wallet class="h-4 w-4 text-primary" />
                <span class="hidden sm:inline">Guthaben:</span>
                <span class="font-semibold">{{ customerBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €</span>
            </Link>

            <!-- Search -->
            <button class="rounded-lg p-2 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800">
                <Search class="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            <!-- Notifications -->
            <button class="relative rounded-lg p-2 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <!-- User Menu -->
            <Dropdown v-if="user" align="right">
                <template #trigger="{ isOpen }">
                    <button
                        class="flex items-center gap-2 rounded-lg p-1.5 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Avatar :name="user.name" :src="user.avatar" size="sm" />
                    </button>
                </template>
                <DropdownItem>
                    <div class="px-2 py-1.5">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {{ user.name }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ user.email }}
                        </p>
                    </div>
                </DropdownItem>
                <DropdownItem>
                    <Link href="/settings/profile" class="flex items-center gap-2">
                        <Settings class="h-4 w-4" />
                        Einstellungen
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link :href="billingIndex.url()" class="flex items-center gap-2">
                        <FileText class="h-4 w-4" />
                        Guthaben & Rechnungen
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link href="/billing/redeem-voucher" class="flex items-center gap-2">
                        <Gift class="h-4 w-4" />
                        Gutscheincode einlösen
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link href="/account/postfach" class="flex items-center gap-2">
                        <Mail class="h-4 w-4" />
                        Postfach
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <button
                        type="button"
                        class="flex w-full items-center gap-2 text-left text-red-600 dark:text-red-400"
                        @click="() => router.post(logout.url())"
                    >
                        <LogOut class="h-4 w-4" />
                        Abmelden
                    </button>
                </DropdownItem>
            </Dropdown>
        </div>
    </header>
</template>
