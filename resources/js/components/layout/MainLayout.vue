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

provide('isSidebarCollapsed', isSidebarCollapsed);
</script>

<template>
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar :items="sidebarItems" :user="user" v-model:collapsed="isSidebarCollapsed" />
        <div class="flex flex-1 flex-col transition-modern-slow" :class="isSidebarCollapsed ? 'ml-20' : 'ml-64'">
            <Header :breadcrumbs="breadcrumbs" :user="user" />
            <main class="flex-1 p-6">
                <slot />
            </main>
        </div>
    </div>
</template>
