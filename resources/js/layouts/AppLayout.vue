<script setup lang="ts">
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import PinUnlockOverlay from '@/components/PinUnlockOverlay.vue';
import { MainLayout } from '@/components/layout';
import { useInactivityLock } from '@/composables/useInactivityLock';
import { dashboard } from '@/routes';
import { index as billingIndex } from '@/routes/billing';
import { index as sitesIndex } from '@/routes/sites';
import { index as adminTemplatesIndex } from '@/routes/admin/templates';
import { index as adminCustomersIndex } from '@/routes/admin/customers';
import {
    LayoutGrid,
    Globe,
    FileText,
    Users,
    Package,
    Repeat,
    Archive,
    Mail,
    MessageCircle,
    Settings,
    Shield,
    PackageCheck,
    GitBranch,
    HardDrive,
} from 'lucide-vue-next';
import { index as supportIndex } from '@/routes/support';
import modules from '@/routes/modules';
import type { BreadcrumbItem, NavItem } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const isAdmin = computed(() => (page.props.auth?.user as { is_admin?: boolean })?.is_admin ?? false);
const openTicketsCount = computed(() => (page.props.auth as { openTicketsCount?: number })?.openTicketsCount ?? 0);
const activeUserModules = computed(() => (page.props.auth as { activeUserModules?: string[] })?.activeUserModules ?? []);
const adminOpenTicketsCount = computed(
    () => (page.props.auth as { adminOpenTicketsCount?: number })?.adminOpenTicketsCount ?? 0,
);
const brandFeatures = computed(() => (page.props.brandFeatures as Record<string, boolean>) ?? {});
const brand = computed(() => page.props.brand as { themeColors?: Record<string, string> } | null);
const { isLocked, unlock } = useInactivityLock();

const brandThemeStyle = computed(() => {
    const colors = brand.value?.themeColors;
    if (!colors || typeof colors !== 'object') return undefined;
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(colors)) {
        if (value) vars[`--${key.replace(/_/g, '-')}`] = value;
    }
    return Object.keys(vars).length ? vars : undefined;
});

const sidebarItems = computed<NavItem[]>(() => {
    const supportItem: NavItem = {
        title: 'Support',
        href: supportIndex().url,
        icon: MessageCircle,
        ...(openTicketsCount.value > 0 && { badge: openTicketsCount.value }),
    };
    const items: NavItem[] = [
        { title: 'Dashboard', href: dashboard().url, icon: LayoutGrid },
        ...(brandFeatures.value.sites_editor !== false
            ? [{ title: 'Meine Sites', href: sitesIndex().url, icon: Globe }]
            : []),
        { title: 'Meine Rechnungen', href: billingIndex().url, icon: FileText },
        { title: 'Meine Domains', href: '/domains', icon: Globe },
        ...(brandFeatures.value.webspace !== false
            ? [{ title: 'Meine Webspaces', href: '/webspace-accounts', icon: HardDrive }]
            : []),
        ...(brandFeatures.value.gaming === true
            ? [{ title: 'Meine Game Server', href: '/gaming-accounts', icon: HardDrive }]
            : []),
        supportItem,
    ];
    if (activeUserModules.value.length > 0) {
        const moduleChildren: NavItem[] = [];
        if (activeUserModules.value.includes('newsletter')) {
            moduleChildren.push({
                title: 'Newsletter',
                href: modules.newsletter.index.url(),
                icon: Mail,
            });
        }
        if (activeUserModules.value.includes('contactform')) {
            moduleChildren.push({
                title: 'Kontaktformular',
                href: modules.contact.index.url(),
                icon: MessageCircle,
            });
        }
        if (moduleChildren.length > 0) {
            items.push({
                title: 'Module',
                icon: PackageCheck,
                children: moduleChildren,
            });
        }
    }
    if (isAdmin.value) {
        items.push({
            title: 'Admin',
            icon: Shield,
            children: [
                {
                    title: 'Übersicht',
                    icon: LayoutGrid,
                    children: [
                        { title: 'Dashboard (Admin)', href: '/admin', icon: LayoutGrid },
                        { title: 'Aktivitätslog', href: '/admin/activity-log', icon: LayoutGrid },
                    ],
                },
                {
                    title: 'Vertrieb',
                    icon: FileText,
                    children: [
                        { title: 'Rechnungen', href: '/admin/invoices', icon: FileText },
                        { title: 'Domains', href: '/admin/domains', icon: Globe },
                        { title: 'TLD-Preise', href: '/admin/domains/tld-pricelist', icon: Globe },
                        { title: 'Mahnungen', href: '/admin/dunning-letters', icon: FileText },
                        { title: 'Abos', href: '/admin/subscriptions', icon: Repeat },
                        { title: 'Produkte', href: '/admin/products', icon: Package },
                    ],
                },
                {
                    title: 'Hosting',
                    icon: PackageCheck,
                    children: [
                        { title: 'Hosting-Server', href: '/admin/hosting-servers', icon: GitBranch },
                        { title: 'Hosting-Pläne', href: '/admin/hosting-plans', icon: Package },
                        ...(brandFeatures.value.webspace !== false
                            ? [{ title: 'Webspace-Accounts', href: '/admin/webspace-accounts', icon: LayoutGrid }]
                            : []),
                        ...(brandFeatures.value.gaming === true
                            ? [{ title: 'Game-Server-Accounts', href: '/admin/gaming-accounts', icon: LayoutGrid }]
                            : []),
                    ],
                },
                {
                    title: 'Inhalte',
                    icon: Globe,
                    children: [
                        { title: 'Sites', href: '/admin/sites', icon: Globe },
                        { title: 'Templates', href: adminTemplatesIndex().url, icon: LayoutGrid },
                    ],
                },
                {
                    title: 'Marketing',
                    icon: Mail,
                    children: [
                        { title: 'Rabattcodes', href: '/admin/discount-codes', icon: Package },
                        { title: 'Gutscheine', href: '/admin/vouchers', icon: Package },
                        { title: 'E-Mails', href: '/admin/emails', icon: Mail },
                    ],
                },
                {
                    title: 'Support',
                    icon: MessageCircle,
                    children: [
                        {
                            title: 'Tickets',
                            href: '/admin/tickets',
                            icon: MessageCircle,
                            ...(adminOpenTicketsCount.value > 0 && { badge: adminOpenTicketsCount.value }),
                        },
                    ],
                },
                {
                    title: 'System',
                    icon: Settings,
                    children: [
                        { title: 'Einstellungen', href: '/admin/settings', icon: Settings },
                        { title: 'Kunden', href: adminCustomersIndex().url, icon: Users },
                        { title: 'Legacy-Migration', href: '/admin/legacy-migration', icon: Archive },
                    ],
                },
            ],
        });
    }
    return items;
});
</script>

<template>
    <div :style="brandThemeStyle">
        <MainLayout :sidebar-items="sidebarItems" :breadcrumbs="breadcrumbs">
            <slot />
            <PinUnlockOverlay
                v-if="isLocked"
                @unlocked="unlock"
            />
        </MainLayout>
    </div>
</template>
