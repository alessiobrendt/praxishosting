<script setup lang="ts">
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import PinUnlockOverlay from '@/components/PinUnlockOverlay.vue';
import { MainLayout } from '@/components/layout';
import { useInactivityLock } from '@/composables/useInactivityLock';
import { dashboard } from '@/routes';
import { index as sitesIndex } from '@/routes/sites';
import { index as adminTemplatesIndex } from '@/routes/admin/templates';
import { index as adminCustomersIndex } from '@/routes/admin/customers';
import { LayoutGrid, Globe, Users } from 'lucide-vue-next';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import type { BreadcrumbItem, NavItem } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const page = usePage();
const isAdmin = computed(() => (page.props.auth?.user as { is_admin?: boolean })?.is_admin ?? false);
const { isCurrentUrl } = useCurrentUrl();
const { isLocked, unlock } = useInactivityLock();

const sidebarItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [
        { title: 'Dashboard', href: dashboard().url, icon: LayoutGrid, active: isCurrentUrl(dashboard().url) },
        { title: 'Meine Sites', href: sitesIndex().url, icon: Globe, active: isCurrentUrl(sitesIndex().url) },
    ];
    if (isAdmin.value) {
        items.push(
            { title: 'Templates', href: adminTemplatesIndex().url, icon: LayoutGrid, active: isCurrentUrl(adminTemplatesIndex().url) },
            { title: 'Kunden', href: adminCustomersIndex().url, icon: Users, active: isCurrentUrl(adminCustomersIndex().url) },
        );
    }
    return items;
});
</script>

<template>
    <MainLayout :sidebar-items="sidebarItems" :breadcrumbs="breadcrumbs">
        <slot />
        <PinUnlockOverlay
            v-if="isLocked"
            @unlocked="unlock"
        />
    </MainLayout>
</template>
