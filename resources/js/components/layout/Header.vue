<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import { useMediaQuery } from '@vueuse/core';
import { LogOut, Menu, Wallet, FileText, Mail, Gift, Settings, PiggyBank } from 'lucide-vue-next';
import { computed, inject } from 'vue';
import type { Ref } from 'vue';
import { Avatar } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import { cn } from '@/lib/utils';
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
}

withDefaults(defineProps<Props>(), {
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
                :aria-label="isSidebarCollapsed ? 'Sidebar aufklappen' : (isMobile ? 'Menü öffnen' : 'Sidebar einklappen')"
                @click.stop="onSidebarToggle"
            >
                <Menu class="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <Breadcrumb v-if="breadcrumbs.length > 0" :items="breadcrumbs" />
        </div>

        <div class="flex items-center gap-2">
            <!-- User Menu: Profil, Name, Guthaben (wie Referenz) -->
            <Dropdown v-if="user" align="right">
                <template #trigger="{ isOpen: _isOpen }">
                    <button
                        class="flex items-center gap-2 rounded-lg p-1.5 pr-2 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Avatar :name="user.name" :src="user.avatar" size="sm" />
                        <div class="hidden text-left xl:block">
                            <p class="mb-0 leading-tight font-medium text-gray-900 dark:text-gray-100">
                                {{ user.name }}
                            </p>
                            <span
                                v-if="showBalance"
                                class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
                            >
                                <PiggyBank class="h-3.5 w-3.5 shrink-0" />
                                {{ customerBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} €
                            </span>
                        </div>
                    </button>
                </template>
                <DropdownItem>
                    <Link :href="profile.edit.url()" class="flex items-center gap-2">
                        <Settings class="h-4 w-4" />
                        Einstellungen
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link :href="billingIndex.url()" class="flex items-center gap-2">
                        <Wallet class="h-4 w-4" />
                        Guthaben aufladen
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link :href="supportCreate.url()" class="flex items-center gap-2">
                        <FileText class="h-4 w-4" />
                        Ticket erstellen
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link href="/account/postfach" class="flex items-center gap-2">
                        <Mail class="h-4 w-4" />
                        Postfach
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link href="/billing/redeem-voucher" class="flex items-center gap-2">
                        <Gift class="h-4 w-4" />
                        Gutscheincode einlösen
                    </Link>
                </DropdownItem>
                <div class="my-1 border-t border-gray-200 dark:border-gray-700" />
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
