<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { usePage } from '@inertiajs/vue3';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import type { BreadcrumbItem, NavItem } from '@/types';

interface Props {
    sidebarItems: NavItem[];
    breadcrumbs?: BreadcrumbItem[];
}

const props = defineProps<Props>();

const page = usePage();
const user = computed(() => page.props.auth?.user as any);
const isSidebarCollapsed = ref(false);
const isSidebarOpenMobile = ref(false);

function openMobileSidebar() {
    isSidebarOpenMobile.value = true;
}

function closeMobileSidebar() {
    isSidebarOpenMobile.value = false;
}

provide('isSidebarCollapsed', isSidebarCollapsed);
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
            <Header :breadcrumbs="breadcrumbs" :user="user" />
            <main class="flex-1 p-4 sm:p-6">
                <slot />
            </main>
        </div>
    </div>
</template>
