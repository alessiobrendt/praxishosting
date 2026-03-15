<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { ref, computed, provide, onMounted, watch } from 'vue';
import type { Component } from 'vue';
import type { BreadcrumbItem, NavItem } from '@/types';
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';

const SIDEBAR_COLLAPSED_KEY = 'app-sidebar-collapsed';

function loadSidebarCollapsed(): boolean {
    if (typeof localStorage === 'undefined') {
        return false;
    }
    try {
        const raw = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
        return raw === '1';
    } catch {
        return false;
    }
}

function saveSidebarCollapsed(value: boolean): void {
    try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, value ? '1' : '0');
    } catch {
        // ignore
    }
}

interface Props {
    sidebarItems: NavItem[];
    breadcrumbs?: BreadcrumbItem[];
    headerComponent?: Component;
}

const props = withDefaults(defineProps<Props>(), {
    headerComponent: () => Header,
});

const page = usePage();
const user = computed(() => page.props.auth?.user as any);
const isSidebarCollapsed = ref(false);
const isSidebarOpenMobile = ref(false);

onMounted(() => {
    isSidebarCollapsed.value = loadSidebarCollapsed();
});

watch(isSidebarCollapsed, (value) => {
    if (typeof localStorage !== 'undefined') {
        saveSidebarCollapsed(value);
    }
});

function openMobileSidebar() {
    isSidebarOpenMobile.value = true;
}

function closeMobileSidebar() {
    isSidebarOpenMobile.value = false;
}

function toggleSidebarCollapsed() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

function expandSidebar() {
    isSidebarCollapsed.value = false;
}

provide('isSidebarCollapsed', isSidebarCollapsed);
provide('toggleSidebarCollapsed', toggleSidebarCollapsed);
provide('expandSidebar', expandSidebar);
provide('isSidebarOpenMobile', computed(() => isSidebarOpenMobile.value));
provide('openMobileSidebar', openMobileSidebar);
provide('closeMobileSidebar', closeMobileSidebar);
</script>

<template>
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar
            :items="sidebarItems"
            :user="user"
            v-model:collapsed="isSidebarCollapsed"
            :mobile-open="isSidebarOpenMobile"
            @close-mobile="closeMobileSidebar"
        />
        <div
            class="flex flex-1 flex-col transition-modern-slow"
            :class="[
                'ml-0 lg:transition-[margin]',
                isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64',
            ]"
        >
            <component :is="props.headerComponent" :breadcrumbs="breadcrumbs" :user="user" />
            <main class="flex-1 p-4 sm:p-6">
                <slot />
            </main>
        </div>
    </div>
</template>
