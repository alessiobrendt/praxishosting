<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    BookOpen,
    Folder,
    Headphones,
    LayoutGrid,
    Globe,
    LayoutList,
    Package,
    Server,
    ShoppingBag,
    Users,
} from 'lucide-vue-next';
import { computed } from 'vue';
import DashboardIcon from '@/components/icons/DashboardIcon.vue';
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as adminCustomersIndex } from '@/routes/admin/customers';
import { index as adminTemplatesIndex } from '@/routes/admin/templates';
import { index as sitesIndex } from '@/routes/sites';
import { type NavItem } from '@/types';
import AppLogo from './AppLogo.vue';

const page = usePage();
const isAdmin = computed(() => (page.props.auth?.user as { is_admin?: boolean })?.is_admin ?? false);
const brandFeatures = computed(() => (page.props.brandFeatures as Record<string, boolean>) ?? {});

const mainNavItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [
        { title: 'Dashboard', href: dashboard().url, icon: DashboardIcon },
        { title: 'Meine Sites', href: sitesIndex().url, icon: Globe },
        { title: 'Webspace', href: '/webspace', icon: Server },
        { title: 'Meine Webspace-Accounts', href: '/webspace-accounts', icon: Package },
    ];
    if (brandFeatures.value.teamspeak === true) {
        items.push(
            { title: 'TeamSpeak', href: '/teamspeak', icon: Headphones },
            { title: 'Meine TeamSpeak-Server', href: '/teamspeak-accounts', icon: Headphones },
        );
    }
    if (isAdmin.value) {
        items.push(
            { title: 'Templates', href: adminTemplatesIndex().url, icon: LayoutGrid },
            { title: 'Kunden', href: adminCustomersIndex().url, icon: Users },
            { title: 'Produkte', href: '/admin/products', icon: ShoppingBag },
            { title: 'Hosting-Server', href: '/admin/hosting-servers', icon: Server },
            { title: 'Webspace-Pakete', href: '/admin/hosting-plans', icon: Package },
            { title: 'Webspace-Accounts', href: '/admin/webspace-accounts', icon: LayoutList },
        );
    }
    return items;
});

const footerNavItems: NavItem[] = [
    {
        title: 'Github Repo',
        href: 'https://github.com/laravel/vue-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#vue',
        icon: BookOpen,
    },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="dashboard().url">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
