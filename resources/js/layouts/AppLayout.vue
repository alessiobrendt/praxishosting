<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';
import {
    Globe,
    FileText,
    Package,
    Mail,
    MessageCircle,
    PackageCheck,
    HardDrive,
    LogOut,
    User,
    HelpCircle,
    Settings,
} from 'lucide-vue-next';
import { computed } from 'vue';
import DashboardIcon from '@/components/icons/DashboardIcon.vue';
import { MainLayout } from '@/components/layout';
import PinUnlockOverlay from '@/components/PinUnlockOverlay.vue';
import { useInactivityLock } from '@/composables/useInactivityLock';
import { dashboard } from '@/routes';
import { index as billingIndex } from '@/routes/billing';
import modules from '@/routes/modules';
import { index as sitesIndex } from '@/routes/sites';
import { create as sitesCreate } from '@/routes/sites';
import { index as supportIndex } from '@/routes/support';
import type { BreadcrumbItem, NavItem } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const openTicketsCount = computed(() => (page.props.auth as { openTicketsCount?: number })?.openTicketsCount ?? 0);
const activeUserModules = computed(() => (page.props.auth as { activeUserModules?: string[] })?.activeUserModules ?? []);
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
    if (colors.primary_dark && !colors.primary) {
        vars['--primary'] = colors.primary_dark;
    }
    if (colors.primary_dark && !colors.primary_hover) {
        vars['--primary-hover'] = colors.primary_dark;
    }
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
        { title: 'Dashboard', href: dashboard().url, icon: DashboardIcon },
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
