<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Avatar } from '@/components/ui/avatar';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import { Bell, Search, Settings, LogOut } from 'lucide-vue-next';

import type { BreadcrumbItem } from '@/types';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

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
            <Breadcrumb v-if="breadcrumbs.length > 0" :items="breadcrumbs" />
        </div>

        <div class="flex items-center gap-2">
            <!-- Search -->
            <button class="rounded-lg p-2 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800">
                <Search class="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            <!-- Notifications -->
            <button class="relative rounded-lg p-2 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <!-- User Menu -->
            <Dropdown v-if="user" align="right">
                <template #trigger="{ isOpen }">
                    <button
                        class="flex items-center gap-2 rounded-lg p-1.5 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Avatar :name="user.name" :src="user.avatar" size="sm" />
                    </button>
                </template>
                <DropdownItem>
                    <div class="px-2 py-1.5">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {{ user.name }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ user.email }}
                        </p>
                    </div>
                </DropdownItem>
                <DropdownItem>
                    <Link href="/settings/profile" class="flex items-center gap-2">
                        <Settings class="h-4 w-4" />
                        Settings
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link href="/logout" class="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <LogOut class="h-4 w-4" />
                        Logout
                    </Link>
                </DropdownItem>
            </Dropdown>
        </div>
    </header>
</template>
