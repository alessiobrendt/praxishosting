<script setup lang="ts">
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { cn } from '@/lib/utils';
import AppLogo from '@/components/AppLogo.vue';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAppearance } from '@/composables/useAppearance';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { Moon, Sun, Menu, X } from 'lucide-vue-next';

interface NavItem {
    title: string;
    href: string;
    icon: any;
    active?: boolean;
}

interface Props {
    items: NavItem[];
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
});

const emit = defineEmits<{
    (e: 'update:collapsed', value: boolean): void;
}>();

const isCollapsed = computed({
    get: () => props.collapsed,
    set: (value) => emit('update:collapsed', value),
});

const { appearance, updateAppearance } = useAppearance();
const { isCurrentUrl } = useCurrentUrl();

const toggleTheme = () => {
    const newAppearance = appearance.value === 'dark' ? 'light' : 'dark';
    updateAppearance(newAppearance);
};

const sidebarClasses = computed(() =>
    cn(
        'fixed left-0 top-0 z-40 h-screen transition-modern-slow',
        'bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950',
        'border-r border-gray-200 dark:border-gray-800',
        'shadow-modern-lg',
        isCollapsed.value ? 'w-20' : 'w-64',
    ),
);
</script>

<template>
    <aside :class="sidebarClasses">
        <div class="flex h-full flex-col">
            <!-- Header -->
            <div class="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
                <div v-if="!isCollapsed" class="flex items-center gap-2">
                    <AppLogo class="h-8" />
                </div>
                <button
                    @click="isCollapsed = !isCollapsed"
                    class="rounded-lg p-2 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Menu v-if="isCollapsed" class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <X v-else class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 space-y-1 overflow-y-auto p-4">
                <Link
                    v-for="item in items"
                    :key="item.href"
                    :href="item.href"
                    :class="cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-modern',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        (item.active || isCurrentUrl(item.href)) && 'gradient-primary text-white shadow-emerald',
                        !(item.active || isCurrentUrl(item.href)) && 'text-gray-700 dark:text-gray-300',
                        isCollapsed && 'justify-center',
                    )"
                >
                    <component :is="item.icon" class="h-5 w-5 shrink-0" />
                    <span v-if="!isCollapsed">{{ item.title }}</span>
                </Link>
            </nav>

            <!-- Footer -->
            <div class="border-t border-gray-200 p-4 dark:border-gray-800">
                <div v-if="!isCollapsed && user" class="mb-4 flex items-center gap-3">
                    <Avatar :name="user.name" :src="user.avatar" size="sm" />
                    <div class="flex-1 min-w-0">
                        <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {{ user.name }}
                        </p>
                        <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                            {{ user.email }}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        @click="toggleTheme"
                        class="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-modern hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        :class="isCollapsed && 'px-2'"
                    >
                        <Sun v-if="appearance === 'dark'" class="h-4 w-4" />
                        <Moon v-else class="h-4 w-4" />
                        <span v-if="!isCollapsed">Theme</span>
                    </button>
                </div>
            </div>
        </div>
    </aside>
</template>
