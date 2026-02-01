<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Link } from '@inertiajs/vue3';
import { cn } from '@/lib/utils';
import AppLogo from '@/components/AppLogo.vue';
import { Avatar } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppearance } from '@/composables/useAppearance';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { Moon, Sun, Menu, X, ChevronDown, ChevronRight } from 'lucide-vue-next';
import type { NavItem } from '@/types';

const STORAGE_KEY = 'app-sidebar-open';

function loadStoredOpenKeys(): Set<string> {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
            const arr = JSON.parse(raw) as string[];
            return new Set(Array.isArray(arr) ? arr : []);
        }
    } catch {
        // ignore
    }
    return new Set();
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

const openGroupKeys = ref<Set<string>>(new Set());

const { appearance, updateAppearance } = useAppearance();
const { isCurrentUrl } = useCurrentUrl();

function hasActiveChild(item: NavItem): boolean {
    if (item.href && isCurrentUrl(item.href)) return true;
    if (item.children) return item.children.some((c) => hasActiveChild(c));
    return false;
}

onMounted(() => {
    const stored = loadStoredOpenKeys();
    props.items.forEach((item) => {
        if (item.children?.length && hasActiveChild(item)) {
            stored.add(item.title);
            item.children.forEach((child) => {
                if (child.children?.length && hasActiveChild(child)) {
                    stored.add(`${item.title}/${child.title}`);
                }
            });
        }
    });
    openGroupKeys.value = stored;
});

function isGroupOpen(key: string, item: NavItem): boolean {
    return openGroupKeys.value.has(key) || hasActiveChild(item);
}

function setGroupOpen(key: string, open: boolean): void {
    const next = new Set(openGroupKeys.value);
    if (open) {
        next.add(key);
        if (key.includes('/')) {
            next.add(key.split('/')[0] ?? '');
        }
    } else {
        next.delete(key);
    }
    openGroupKeys.value = next;
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
        // ignore
    }
}

function toggleTheme() {
    const newAppearance = appearance.value === 'dark' ? 'light' : 'dark';
    updateAppearance(newAppearance);
}

const sidebarClasses = computed(() =>
    cn(
        'fixed left-0 top-0 z-40 h-screen transition-modern-slow',
        'bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950',
        'border-r border-gray-200 dark:border-gray-800',
        'shadow-modern-lg',
        isCollapsed.value ? 'w-20' : 'w-64',
    ),
);

const linkClasses = (href: string) =>
    cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-modern',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isCurrentUrl(href) && 'gradient-primary text-white shadow-emerald',
        !isCurrentUrl(href) && 'text-gray-700 dark:text-gray-300',
        isCollapsed.value && 'justify-center',
    );

const groupTriggerClasses = (item: NavItem) =>
    cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-modern',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'text-gray-700 dark:text-gray-300',
        isCollapsed.value && 'justify-center',
    );
</script>

<template>
    <aside :class="sidebarClasses" aria-label="Hauptnavigation">
        <TooltipProvider :delay-duration="300">
            <div class="flex h-full flex-col">
            <!-- Header -->
            <div class="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
                <div v-if="!isCollapsed" class="flex items-center gap-2">
                    <AppLogo class="h-8" />
                </div>
                <button
                    type="button"
                    :aria-label="isCollapsed ? 'Sidebar öffnen' : 'Sidebar schließen'"
                    @click="isCollapsed = !isCollapsed"
                    class="rounded-lg p-2 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Menu v-if="isCollapsed" class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <X v-else class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 space-y-1 overflow-y-auto p-4">
                <template v-for="(item, idx) in items" :key="item.title + String(idx)">
                    <div
                        v-if="idx > 0 && item.children?.length && !isCollapsed"
                        class="my-3 border-t border-gray-200 dark:border-gray-700"
                        role="separator"
                        aria-hidden="true"
                    />
                    <!-- Leaf: direct link -->
                    <template v-if="!item.children?.length && item.href">
                        <Link
                            v-if="!isCollapsed"
                            :href="item.href"
                            :class="linkClasses(item.href)"
                            :aria-current="isCurrentUrl(item.href) ? 'page' : undefined"
                        >
                            <component :is="item.icon" v-if="item.icon" class="h-5 w-5 shrink-0" />
                            <span>{{ item.title }}</span>
                        </Link>
                        <Tooltip v-else>
                            <TooltipTrigger as-child>
                                <Link :href="item.href" :class="cn(linkClasses(item.href), 'flex justify-center')">
                                    <component :is="item.icon" v-if="item.icon" class="h-5 w-5 shrink-0" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" class="font-medium">
                                {{ item.title }}
                            </TooltipContent>
                        </Tooltip>
                    </template>

                    <!-- Group: collapsible with children -->
                    <template v-else-if="item.children?.length">
                        <Collapsible
                            v-if="!isCollapsed"
                            :key="`group-${item.title}`"
                            :open="isGroupOpen(item.title, item)"
                            class="group"
                            @update:open="(v) => setGroupOpen(item.title, v)"
                        >
                            <CollapsibleTrigger
                                :class="groupTriggerClasses(item)"
                                :aria-expanded="isGroupOpen(item.title, item)"
                                aria-label="Bereich aufklappen"
                            >
                                <component :is="item.icon" v-if="item.icon" class="h-5 w-5 shrink-0" />
                                <span>{{ item.title }}</span>
                                <ChevronDown
                                    class="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div class="ml-2 mt-1 space-y-0.5 border-l border-gray-200 pl-3 dark:border-gray-700">
                                    <template v-for="(child, cIdx) in item.children" :key="child.title + String(cIdx)">
                                        <!-- Nested group -->
                                        <template v-if="child.children?.length">
                                            <Collapsible
                                                :open="isGroupOpen(`${item.title}/${child.title}`, child)"
                                                class="group mt-1"
                                                @update:open="(v) => setGroupOpen(`${item.title}/${child.title}`, v)"
                                            >
                                                <CollapsibleTrigger
                                                    class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                                    :aria-expanded="isGroupOpen(`${item.title}/${child.title}`, child)"
                                                >
                                                    <ChevronRight
                                                        class="h-3.5 w-3.5 shrink-0 transition-transform group-data-[state=open]:rotate-90"
                                                    />
                                                    {{ child.title }}
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <div class="ml-3 mt-0.5 space-y-0.5 border-l border-gray-200 pl-2 dark:border-gray-700">
                                                        <Link
                                                            v-for="(sub, sIdx) in child.children"
                                                            :key="sub.title + String(sIdx)"
                                                            v-show="sub.href"
                                                            :href="sub.href!"
                                                            :class="[
                                                                'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-modern',
                                                                isCurrentUrl(sub.href!)
                                                                    ? 'gradient-primary text-white shadow-emerald'
                                                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                                                            ]"
                                                            :aria-current="isCurrentUrl(sub.href!) ? 'page' : undefined"
                                                        >
                                                            <component :is="sub.icon" v-if="sub.icon" class="h-3.5 w-3.5 shrink-0" />
                                                            {{ sub.title }}
                                                        </Link>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </template>
                                        <!-- Nested leaf -->
                                        <Link
                                            v-else-if="child.href"
                                            :href="child.href"
                                            :class="[
                                                'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-modern',
                                                isCurrentUrl(child.href)
                                                    ? 'gradient-primary text-white shadow-emerald'
                                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                                            ]"
                                            :aria-current="isCurrentUrl(child.href) ? 'page' : undefined"
                                        >
                                            <component :is="child.icon" v-if="child.icon" class="h-3.5 w-3.5 shrink-0" />
                                            {{ child.title }}
                                        </Link>
                                    </template>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <!-- Collapsed: icon + tooltip with child links -->
                        <Tooltip v-else>
                            <TooltipTrigger as-child>
                                <button
                                    type="button"
                                    :class="cn(groupTriggerClasses(item), 'flex w-full justify-center')"
                                    :aria-label="item.title"
                                >
                                    <component :is="item.icon" v-if="item.icon" class="h-5 w-5 shrink-0" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" class="max-w-xs p-0" :side-offset="8">
                                <nav class="flex flex-col py-1" aria-label="Untermenü">
                                    <template v-for="(child, cIdx) in item.children" :key="child.title + String(cIdx)">
                                        <template v-if="child.children?.length">
                                            <div class="px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                                                {{ child.title }}
                                            </div>
                                            <Link
                                                v-for="(sub, sIdx) in child.children"
                                                :key="sub.title + String(sIdx)"
                                                v-show="sub.href"
                                                :href="sub.href!"
                                                class="flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-accent"
                                            >
                                                <component :is="sub.icon" v-if="sub.icon" class="h-3.5 w-3.5 shrink-0" />
                                                {{ sub.title }}
                                            </Link>
                                        </template>
                                        <Link
                                            v-else-if="child.href"
                                            :href="child.href"
                                            class="flex items-center gap-2 px-4 py-1.5 text-sm hover:bg-accent"
                                        >
                                            <component :is="child.icon" v-if="child.icon" class="h-3.5 w-3.5 shrink-0" />
                                            {{ child.title }}
                                        </Link>
                                    </template>
                                </nav>
                            </TooltipContent>
                        </Tooltip>
                    </template>
                </template>
            </nav>

            <!-- Footer -->
            <div class="border-t border-gray-200 p-4 dark:border-gray-800">
                <div v-if="!isCollapsed && user" class="mb-4 flex items-center gap-3">
                    <Avatar :name="user.name" :src="user.avatar" size="sm" />
                    <div class="min-w-0 flex-1">
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
                        type="button"
                        @click="toggleTheme"
                        :class="cn(
                            'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-modern hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                            isCollapsed && 'px-2',
                        )"
                        aria-label="Theme wechseln"
                    >
                        <Sun v-if="appearance === 'dark'" class="h-4 w-4" />
                        <Moon v-else class="h-4 w-4" />
                        <span v-if="!isCollapsed">Theme</span>
                    </button>
                </div>
            </div>
            </div>
        </TooltipProvider>
    </aside>
</template>
