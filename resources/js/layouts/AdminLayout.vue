<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';
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
    PackageCheck,
    GitBranch,
    Activity,
} from 'lucide-vue-next';
import { computed } from 'vue';
import { MainLayout } from '@/components/layout';
import AdminHeader from '@/components/layout/AdminHeader.vue';
import PinUnlockOverlay from '@/components/PinUnlockOverlay.vue';
import { useInactivityLock } from '@/composables/useInactivityLock';
import { index as adminCustomersIndex } from '@/routes/admin/customers';
import { index as adminTemplatesIndex } from '@/routes/admin/templates';
import type { BreadcrumbItem, NavItem } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const adminOpenTicketsCount = computed(
    () => (page.props.auth as { adminOpenTicketsCount?: number })?.adminOpenTicketsCount ?? 0,
);
const impersonating = computed(() => (page.props.auth as { impersonating?: boolean })?.impersonating ?? false);
const brandFeatures = computed(() => (page.props.brandFeatures as Record<string, boolean>) ?? {});
const userPermissions = computed(() => (page.props.auth as { userPermissions?: string[] })?.userPermissions ?? []);
const hasPermission = (key: string): boolean =>
    userPermissions.value.includes('*') || userPermissions.value.includes(key);
/** Show menu item if user has full permission or at least view permission. */
const hasPermissionOrView = (baseKey: string): boolean =>
    hasPermission(baseKey) || hasPermission(`${baseKey}.view`);

const sidebarItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [];
    if (hasPermissionOrView('admin.dashboard') || hasPermissionOrView('admin.activity-log')) {
        items.push({
            title: 'Übersicht',
            icon: LayoutGrid,
            children: [
                ...(hasPermissionOrView('admin.dashboard') ? [{ title: 'Dashboard (Admin)', href: '/admin', icon: LayoutGrid }] : []),
                ...(hasPermissionOrView('admin.activity-log') ? [{ title: 'Aktivitätslog', href: '/admin/activity-log', icon: LayoutGrid }] : []),
            ].filter(Boolean) as NavItem[],
        });
    }
    if (hasPermissionOrView('admin.invoices') || hasPermissionOrView('admin.domains') || hasPermissionOrView('admin.dunning-letters') || hasPermissionOrView('admin.subscriptions') || hasPermissionOrView('admin.products')) {
        const vertrieb: NavItem[] = [];
        if (hasPermissionOrView('admin.invoices')) vertrieb.push({ title: 'Rechnungen', href: '/admin/invoices', icon: FileText });
        if (hasPermissionOrView('admin.domains')) vertrieb.push({ title: 'Domains', href: '/admin/domains', icon: Globe });
        if (hasPermissionOrView('admin.domains')) vertrieb.push({ title: 'TLD-Preise', href: '/admin/domains/tld-pricelist', icon: Globe });
        if (hasPermissionOrView('admin.dunning-letters')) vertrieb.push({ title: 'Mahnungen', href: '/admin/dunning-letters', icon: FileText });
        if (hasPermissionOrView('admin.subscriptions')) vertrieb.push({ title: 'Abos', href: '/admin/subscriptions', icon: Repeat });
        if (hasPermissionOrView('admin.products')) vertrieb.push({ title: 'Produkte', href: '/admin/products', icon: Package });
        if (vertrieb.length > 0) {
            items.push({ title: 'Vertrieb', icon: FileText, children: vertrieb });
        }
    }
    const hostingChildren: NavItem[] = [];
    if (hasPermissionOrView('admin.hosting-servers')) hostingChildren.push({ title: 'Hosting-Server', href: '/admin/hosting-servers', icon: GitBranch });
    if (hasPermissionOrView('admin.hosting-plans')) hostingChildren.push({ title: 'Hosting-Pläne', href: '/admin/hosting-plans', icon: Package });
    if (hasPermissionOrView('admin.webspace-accounts') && brandFeatures.value.webspace !== false) hostingChildren.push({ title: 'Webspace-Accounts', href: '/admin/webspace-accounts', icon: LayoutGrid });
    if (hasPermissionOrView('admin.gaming-accounts') && brandFeatures.value.gaming === true) hostingChildren.push({ title: 'Game-Server-Accounts', href: '/admin/gaming-accounts', icon: LayoutGrid });
    if (hostingChildren.length > 0) {
        items.push({ title: 'Hosting', icon: PackageCheck, children: hostingChildren });
    }
    if (hasPermissionOrView('admin.settings') || hasPermissionOrView('admin.hosting-servers')) {
        items.push({
            title: 'Monitoring',
            icon: Activity,
            children: [
                { title: 'Ziele', href: '/admin/monitoring', icon: Activity },
            ],
        });
    }
    if (hasPermissionOrView('admin.sites') || hasPermissionOrView('admin.templates')) {
        const inhalte: NavItem[] = [];
        if (hasPermissionOrView('admin.sites')) inhalte.push({ title: 'Sites', href: '/admin/sites', icon: Globe });
        if (hasPermissionOrView('admin.templates')) inhalte.push({ title: 'Templates', href: adminTemplatesIndex().url, icon: LayoutGrid });
        if (inhalte.length > 0) items.push({ title: 'Inhalte', icon: Globe, children: inhalte });
    }
    if (hasPermissionOrView('admin.discount-codes') || hasPermissionOrView('admin.vouchers') || hasPermissionOrView('admin.emails')) {
        const marketing: NavItem[] = [];
        if (hasPermissionOrView('admin.discount-codes')) marketing.push({ title: 'Rabattcodes', href: '/admin/discount-codes', icon: Package });
        if (hasPermissionOrView('admin.vouchers')) marketing.push({ title: 'Gutscheine', href: '/admin/vouchers', icon: Package });
        if (hasPermissionOrView('admin.emails')) marketing.push({ title: 'E-Mails', href: '/admin/emails', icon: Mail });
        if (marketing.length > 0) items.push({ title: 'Marketing', icon: Mail, children: marketing });
    }
    if (hasPermissionOrView('admin.tickets')) {
        items.push({
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
        });
    }
    if (hasPermissionOrView('admin.settings') || hasPermissionOrView('admin.jobs-monitor') || hasPermissionOrView('admin.cron-statistics') || hasPermissionOrView('admin.customers') || hasPermissionOrView('admin.groups') || hasPermissionOrView('admin.permissions') || hasPermissionOrView('admin.legacy-migration')) {
        const system: NavItem[] = [];
        system.push({ title: 'API', href: '/admin/api', icon: Settings });
        if (hasPermissionOrView('admin.settings')) system.push({ title: 'Einstellungen', href: '/admin/settings', icon: Settings });
        if (hasPermissionOrView('admin.jobs-monitor')) system.push({ title: 'Jobs-Monitor', href: '/admin/jobs-monitor', icon: Settings });
        if (hasPermissionOrView('admin.cron-statistics')) system.push({ title: 'Cron / Worker-Statistik', href: '/admin/cron-statistics', icon: Settings });
        if (hasPermissionOrView('admin.customers')) system.push({ title: 'Kunden', href: adminCustomersIndex().url, icon: Users });
        if (hasPermissionOrView('admin.groups')) system.push({ title: 'Gruppen', href: '/admin/groups', icon: Users });
        if (hasPermissionOrView('admin.permissions')) system.push({ title: 'Berechtigungen', href: '/admin/permissions', icon: Settings });
        if (hasPermissionOrView('admin.legacy-migration')) system.push({ title: 'Legacy-Migration', href: '/admin/legacy-migration', icon: Archive });
        if (system.length > 0) items.push({ title: 'System', icon: Settings, children: system });
    }
    return items;
});

const brand = computed(
    () => page.props.brand as { themeColors?: Record<string, string>; seo?: Record<string, string> } | null,
);
const brandThemeStyle = computed(() => {
    const colors = brand.value?.themeColors;
    if (!colors || typeof colors !== 'object') return undefined;
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(colors)) {
        if (value) vars[`--${key.replace(/_/g, '-')}`] = value;
    }
    if (colors.primary_dark && !colors.primary) {
        vars['--primary'] = colors.primary_dark;
    }
    if (colors.primary_dark && !colors.primary_hover) {
        vars['--primary-hover'] = colors.primary_dark;
    }
    // Header, sidebar, focus ring and accent use same brand primary
    const primary = vars['--primary'] ?? colors.primary ?? colors.primary_dark;
    if (primary) {
        vars['--sidebar-primary'] = primary;
        vars['--sidebar-primary-foreground'] = '#ffffff';
        vars['--ring'] = primary;
        vars['--accent'] = primary;
        vars['--accent-foreground'] = '#ffffff';
        vars['--sidebar-ring'] = primary;
    }
    return Object.keys(vars).length ? vars : undefined;
});
const brandSeo = computed(() => brand.value?.seo ?? null);
const { isLocked, unlock } = useInactivityLock();
</script>

<template>
    <div :style="brandThemeStyle">
        <Head v-if="brandSeo">
            <link
                v-if="brandSeo.favicon_url"
                rel="icon"
                :href="brandSeo.favicon_url"
                :type="brandSeo.favicon_url?.toLowerCase().endsWith('.svg') ? 'image/svg+xml' : undefined"
            />
            <meta v-if="brandSeo.meta_description" name="description" :content="brandSeo.meta_description" />
            <meta v-if="brandSeo.meta_robots" name="robots" :content="brandSeo.meta_robots" />
            <meta v-if="brandSeo.theme_color" name="theme-color" :content="brandSeo.theme_color" />
        </Head>
        <div
            v-if="impersonating"
            class="flex flex-wrap items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
        >
            <span>Sie sind angemeldet als {{ (page.props.auth?.user as { name?: string })?.name ?? 'Kunde' }}.</span>
            <a
                href="/impersonate/leave"
                class="inline-flex items-center gap-1 rounded border border-amber-600 bg-amber-500 px-2 py-1 text-amber-900 hover:bg-amber-400 dark:border-amber-500 dark:bg-amber-600 dark:text-white dark:hover:bg-amber-500"
            >
                Impersonation beenden
            </a>
        </div>
        <MainLayout
            :sidebar-items="sidebarItems"
            :breadcrumbs="breadcrumbs"
            :header-component="AdminHeader"
        >
            <slot />
            <PinUnlockOverlay
                v-if="isLocked"
                @unlocked="unlock"
            />
        </MainLayout>
    </div>
</template>
