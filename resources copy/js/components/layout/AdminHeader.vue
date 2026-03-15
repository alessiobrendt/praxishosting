<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3';
import { useMediaQuery } from '@vueuse/core';
import { LogOut, Menu, Settings } from 'lucide-vue-next';
import { computed, inject } from 'vue';
import type { Ref } from 'vue';
import { Avatar } from '@/components/ui/avatar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import { dashboard } from '@/routes';
import profile from '@/routes/profile';
import type { BreadcrumbItem } from '@/types';

type GroupLabelWithColor = { label: string; color: string | null };

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    user?: {
        name: string;
        email: string;
        avatar?: string;
        group_labels?: string[];
    };
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});

const isMobile = useMediaQuery('(max-width: 1023px)');
const openMobileSidebar = inject<() => void>('openMobileSidebar', () => {});
const isSidebarCollapsed = inject<Ref<boolean> | null>('isSidebarCollapsed', null);
const toggleSidebarCollapsed = inject<() => void>('toggleSidebarCollapsed', () => {});

function onSidebarToggle() {
    if (isMobile.value) {
        openMobileSidebar();
    } else {
        toggleSidebarCollapsed();
    }
}

const page = usePage();
const authData = computed(() => page.props.auth as { group_labels?: string[]; group_labels_with_colors?: GroupLabelWithColor[] });
const groupLabelsWithColors = computed((): GroupLabelWithColor[] => {
    const withColors = authData.value?.group_labels_with_colors;
    if (withColors?.length) return withColors;
    const labels = authData.value?.group_labels ?? props.user?.group_labels ?? [];
    return labels.map((label: string) => ({ label, color: null }));
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
            <button
                type="button"
                class="-ml-2 rounded-lg p-2 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800 lg:ml-0"
                :aria-label="isSidebarCollapsed ? 'Sidebar aufklappen' : (isMobile ? 'Menü öffnen' : 'Sidebar einklappen')"
                @click.stop="onSidebarToggle"
            >
                <Menu class="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <Breadcrumb v-if="breadcrumbs.length > 0" :items="breadcrumbs" />
        </div>

        <div class="flex items-center gap-3">
            <Dropdown v-if="user" align="right">
                <template #trigger="{ isOpen: _isOpen }">
                    <button
                        class="flex items-center gap-2 rounded-lg p-1.5 pr-2 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Avatar :name="user.name" :src="user.avatar" size="sm" />
                        <div class="hidden text-left xl:block">
                            <p class="mb-0 leading-tight font-medium text-gray-900 dark:text-gray-100">
                                {{ user.name }}
                            </p>
                            <div v-if="groupLabelsWithColors.length > 0" class="mt-1 flex flex-wrap gap-1">
                                <span
                                    v-for="g in groupLabelsWithColors"
                                    :key="g.label"
                                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-modern"
                                    :class="g.color ? '' : 'bg-primary/10 text-primary'"
                                    :style="g.color ? { backgroundColor: `${g.color}1a`, color: g.color } : undefined"
                                >
                                    {{ g.label }}
                                </span>
                            </div>
                        </div>
                    </button>
                </template>
                <DropdownItem>
                    <Link :href="dashboard().url" class="flex items-center gap-2">
                        Zum Kundenbereich
                    </Link>
                </DropdownItem>
                <DropdownItem>
                    <Link :href="profile.edit.url()" class="flex items-center gap-2">
                        <Settings class="h-4 w-4" />
                        Einstellungen
                    </Link>
                </DropdownItem>
                <div class="my-1 border-t border-gray-200 dark:border-gray-700" />
                <DropdownItem>
                    <button
                        type="button"
                        class="flex w-full items-center gap-2 text-left text-red-600 dark:text-red-400"
                        @click="() => router.post(logout.url())"
                    >
                        <LogOut class="h-4 w-4" />
                        Abmelden
                    </button>
                </DropdownItem>
            </Dropdown>
        </div>
    </header>
</template>
