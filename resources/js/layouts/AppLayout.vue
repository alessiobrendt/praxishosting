<script setup lang="ts">
import { computed } from 'vue';
import { Head, usePage } from '@inertiajs/vue3';
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
    LogOut,
    User,
    HelpCircle,
} from 'lucide-vue-next';
import { index as supportIndex } from '@/routes/support';
import { create as sitesCreate } from '@/routes/sites';
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
const impersonating = computed(() => (page.props.auth as { impersonating?: boolean })?.impersonating ?? false);
const brandFeatures = computed(() => (page.props.brandFeatures as Record<string, boolean>) ?? {});
const brand = computed(
    () => page.props.brand as { themeColors?: Record<string, string>; seo?: Record<string, string> } | null,
);
const currentUrl = computed(() => (page.props.currentUrl as string) || '');
const brandSeo = computed(() => brand.value?.seo ?? null);
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

const discordInviteUrl = computed(() => (page.props.discordInviteUrl as string | null) ?? null);

const sidebarItems = computed<NavItem[]>(() => {
    const supportTicketsItem: NavItem = {
        title: 'Support Tickets',
        href: supportIndex().url,
        icon: MessageCircle,
        ...(openTicketsCount.value > 0 && { badge: openTicketsCount.value }),
    };
    const helpSupportChildren: NavItem[] = [];
    if (discordInviteUrl.value) {
        helpSupportChildren.push({
            title: 'Hilfe der Community',
            href: discordInviteUrl.value,
            icon: MessageCircle,
            external: true,
        });
    }
    helpSupportChildren.push(supportTicketsItem);

    const items: NavItem[] = [
        { title: 'Dashboard', href: dashboard().url, icon: LayoutGrid },
        ...(brandFeatures.value.sites_editor !== false
            ? [
                  {
                      title: 'Seiten',
                      icon: Globe,
                      children: [
                          { title: 'Seite bestellen', href: sitesCreate().url, icon: Package },
                          { title: 'Meine Seiten', href: sitesIndex().url, icon: Globe },
                      ],
                  },
              ]
            : []),
        {
            title: 'Domains',
            icon: Globe,
            children: [
                { title: 'Domain bestellen', href: '/domains/search', icon: Globe },
                { title: 'Domain Portfolio', href: '/domains', icon: FileText },
            ],
        },
        ...(brandFeatures.value.webspace !== false
            ? [
                  {
                      title: 'Webspaces',
                      icon: HardDrive,
                      children: [
                          { title: 'Plesk-Webspace bestellen', href: '/webspace/checkout', icon: Package },
                          { title: 'Deine Plesk-Webspaces', href: '/webspace-accounts', icon: HardDrive },
                      ],
                  },
              ]
            : []),
        ...(brandFeatures.value.gaming === true
            ? [
                  {
                      title: 'Gameserver',
                      icon: HardDrive,
                      children: [
                          { title: 'Gameserver bestellen', href: '/gaming/checkout', icon: Package },
                          { title: 'Deine Gameserver', href: '/gaming-accounts', icon: HardDrive },
                      ],
                  },
              ]
            : []),
        {
            title: 'Hilfe und Support',
            icon: HelpCircle,
            children: helpSupportChildren,
        },
        {
            title: 'Account',
            icon: User,
            children: [
                { title: 'Einstellungen', href: '/settings/profile', icon: Settings },
                { title: 'Guthaben & Rechnungen', href: billingIndex().url, icon: FileText },
                { title: 'Gutscheincode einlösen', href: '/billing/redeem-voucher', icon: Package },
                { title: 'Postfach', href: '/account/postfach', icon: Mail },
            ],
        },
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
                        { title: 'Jobs-Monitor', href: '/admin/jobs-monitor', icon: Settings },
                        { title: 'Cron / Worker-Statistik', href: '/admin/cron-statistics', icon: Settings },
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
            <link v-if="currentUrl" rel="canonical" :href="currentUrl" />
            <meta v-if="currentUrl" property="og:url" :content="currentUrl" />
            <meta v-if="brandSeo.og_type" property="og:type" :content="brandSeo.og_type" />
            <meta v-if="brandSeo.og_site_name" property="og:site_name" :content="brandSeo.og_site_name" />
            <meta v-if="brandSeo.og_title" property="og:title" :content="brandSeo.og_title" />
            <meta v-if="brandSeo.og_description" property="og:description" :content="brandSeo.og_description" />
            <meta v-if="brandSeo.og_image" property="og:image" :content="brandSeo.og_image" />
            <meta v-if="brandSeo.og_locale" property="og:locale" :content="brandSeo.og_locale" />
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
                <LogOut class="h-3.5 w-3.5" />
                Impersonation beenden
            </a>
        </div>
        <MainLayout :sidebar-items="sidebarItems" :breadcrumbs="breadcrumbs">
            <slot />
            <PinUnlockOverlay
                v-if="isLocked"
                @unlocked="unlock"
            />
        </MainLayout>
    </div>
</template>
