<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { useMediaQuery } from '@vueuse/core';
import { Moon, Sun, ChevronDown, ChevronRight } from 'lucide-vue-next';
import { computed, inject, onMounted, ref, watch } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import { Avatar } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    TooltipContent,
    TooltipProvider,
    TooltipRoot,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppearance } from '@/composables/useAppearance';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

const isMobile = useMediaQuery('(max-width: 1023px)');

const STORAGE_KEY = 'app-sidebar-open-groups';

function loadStoredOpenKeys(): Set<string> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
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
    mobileOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
    mobileOpen: false,
});

const emit = defineEmits<{
    (e: 'update:collapsed', value: boolean): void;
    (e: 'close-mobile'): void;
}>();

const isCollapsed = computed({
    get: () => props.collapsed,
    set: (value) => emit('update:collapsed', value),
});

const effectiveCollapsed = computed(() => isCollapsed.value);

const openGroupKeys = ref<Set<string>>(new Set());
const openCollapsedGroupTitle = ref<string | null>(null);

const openCollapsedGroupItem = computed(() =>
    props.items.find((i) => i.children?.length && i.title === openCollapsedGroupTitle.value) ?? null,
);

const collapsedGroupDialogOpen = ref(false);

function openCollapsedGroupModal(title: string) {
    openCollapsedGroupTitle.value = title;
    collapsedGroupDialogOpen.value = true;
}

function closeCollapsedGroupModal() {
    openCollapsedGroupTitle.value = null;
    collapsedGroupDialogOpen.value = false;
}

watch(collapsedGroupDialogOpen, (open) => {
    if (!open) openCollapsedGroupTitle.value = null;
});

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
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
        // ignore
    }
}

function toggleTheme() {
    const newAppearance = appearance.value === 'dark' ? 'light' : 'dark';
    updateAppearance(newAppearance);
}

const expandSidebar = inject<(() => void) | null>('expandSidebar', null);

function _closeSidebar() {
    if (isMobile.value) {
        emit('close-mobile');
    } else if (isCollapsed.value) {
        if (expandSidebar) {
            expandSidebar();
        } else {
            isCollapsed.value = false;
        }
    } else {
        isCollapsed.value = true;
    }
}

function onNavClick(e: MouseEvent) {
    const el = e.target as HTMLElement;
    if (isMobile.value && el.closest('a')) {
        emit('close-mobile');
    }
}

const sidebarRef = ref<HTMLElement | null>(null);

const sidebarClasses = computed(() =>
    cn(
        'fixed left-0 top-0 z-50 h-screen overflow-x-hidden transition-modern-slow',
        'bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950',
        'border-r border-gray-200 dark:border-gray-800',
        'shadow-modern-lg',
        // Mobile: overlay, full sidebar width when open
        'lg:z-40',
        effectiveCollapsed.value ? 'w-20' : 'w-64',
        isMobile.value && !props.mobileOpen && '-translate-x-full',
        isMobile.value && props.mobileOpen && 'translate-x-0',
        effectiveCollapsed.value && 'sidebar--icons-only',
    ),
);

const linkClasses = (href: string) =>
    cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-modern',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isCurrentUrl(href) && 'gradient-primary text-white shadow-primary',
        !isCurrentUrl(href) && 'text-gray-700 dark:text-gray-300',
        effectiveCollapsed.value && 'justify-center',
    );

const groupTriggerClasses = (_item: NavItem) =>
    cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-modern',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'text-gray-700 dark:text-gray-300',
        effectiveCollapsed.value && 'justify-center',
    );
</script>

<template>
    <!-- Mobile backdrop -->
    <div
        v-if="isMobile && mobileOpen"
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        aria-hidden="true"
        @click="emit('close-mobile')"
    />
    <aside ref="sidebarRef" :class="sidebarClasses" aria-label="Hauptnavigation">
        <TooltipProvider :delay-duration="300">
            <div class="flex h-full flex-col">
            <!-- Header: Logo (eingeklappt = kleines Logo aus Marken-Einstellungen) -->
            <div class="flex h-16 shrink-0 items-center justify-center border-b border-gray-200 px-2 dark:border-gray-800">
                <AppLogo :variant="effectiveCollapsed ? 'collapsed' : 'default'" :class="effectiveCollapsed ? 'h-8 w-8' : 'h-8 w-full'" />
            </div>

            <!-- Navigation -->
            <nav class="flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-4" @click="onNavClick">
                <template v-for="(item, idx) in items" :key="item.title + String(idx)">
                    <div
                        v-if="item.title === 'Admin' && !effectiveCollapsed"
                        class="my-3 border-t border-gray-200 dark:border-gray-700"
                        role="separator"
                        aria-hidden="true"
                    />
                    <!-- Leaf: direct link -->
                    <template v-if="!item.children?.length && item.href">
                        <component
                            v-if="!effectiveCollapsed"
                            :is="item.external ? 'a' : Link"
                            :href="item.href"
                            :class="linkClasses(toUrl(item.href) ?? '#')"
                            :aria-current="!item.external && isCurrentUrl(item.href) ? 'page' : undefined"
                            v-bind="item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                        >
                            <component :is="item.icon" v-if="item.icon" class="h-5 w-5 shrink-0" />
                            <span>{{ item.title }}</span>
                            <span
                                v-if="item.badge"
                                class="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                            >
                                {{ item.badge }}
                            </span>
                        </component>
                        <TooltipRoot v-else>
                            <TooltipTrigger as-child>
                                <component
                                    :is="item.external ? 'a' : Link"
                                    :href="item.href"
                                    :class="cn(linkClasses(toUrl(item.href) ?? '#'), 'relative flex justify-center')"
                                    v-bind="item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                                >
                                    <component :is="item.icon" v-if="item.icon" class="h-5 w-5 shrink-0" />
                                    <span
                                        v-if="item.badge"
                                        class="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
                                    >
                                        {{ item.badge }}
                                    </span>
                                </component>
                            </TooltipTrigger>
                            <TooltipContent side="right" class="font-medium">
                                {{ item.title }}
                                <template v-if="item.badge"> ({{ item.badge }})</template>
                            </TooltipContent>
                        </TooltipRoot>
                    </template>

                    <!-- Group: collapsible with children -->
                    <template v-else-if="item.children?.length">
                        <Collapsible
                            v-if="!effectiveCollapsed"
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
                                                        <component
                                                            v-for="(sub, sIdx) in child.children"
                                                            :key="sub.title + String(sIdx)"
                                                            v-show="sub.href"
                                                            :is="sub.external ? 'a' : Link"
                                                            :href="sub.href!"
                                                            :class="[
                                                                'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-modern',
                                                                !sub.external && isCurrentUrl(sub.href!)
                                                                    ? 'gradient-primary text-white shadow-primary'
                                                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                                                            ]"
                                                            :aria-current="!sub.external && isCurrentUrl(sub.href!) ? 'page' : undefined"
                                                            v-bind="sub.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                                                        >
                                                            <component :is="sub.icon" v-if="sub.icon" class="h-3.5 w-3.5 shrink-0" />
                                                            {{ sub.title }}
                                                            <span
                                                                v-if="sub.badge"
                                                                class="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                                                            >
                                                                {{ sub.badge }}
                                                            </span>
                                                        </component>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </template>
                                        <!-- Nested leaf -->
                                        <component
                                            v-else-if="child.href"
                                            :is="child.external ? 'a' : Link"
                                            :href="child.href"
                                            :class="[
                                                'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-modern',
                                                !child.external && isCurrentUrl(child.href)
                                                    ? 'gradient-primary text-white shadow-primary'
                                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                                            ]"
                                            :aria-current="!child.external && isCurrentUrl(child.href) ? 'page' : undefined"
                                            v-bind="child.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                                        >
                                            <component :is="child.icon" v-if="child.icon" class="h-3.5 w-3.5 shrink-0" />
                                            {{ child.title }}
                                            <span
                                                v-if="child.badge"
                                                class="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                                            >
                                                {{ child.badge }}
                                            </span>
                                        </component>
                                    </template>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <!-- Collapsed: icon only, click opens modal with tree -->
                        <div v-else class="w-full" @click.stop>
                            <button
                                type="button"
                                data-collapsed-group-btn
                                :data-group="item.title"
                                :class="cn(groupTriggerClasses(item), 'flex w-full justify-center min-w-[2.5rem] min-h-[2.5rem]', openCollapsedGroupTitle === item.title && 'bg-gray-100 dark:bg-gray-800')"
                                :aria-label="item.title"
                                :aria-expanded="openCollapsedGroupTitle === item.title"
                                @click.prevent.stop="openCollapsedGroupTitle === item.title ? closeCollapsedGroupModal() : openCollapsedGroupModal(item.title)"
                            >
                                <component :is="item.icon" v-if="item.icon" class="h-5 w-5 shrink-0" />
                            </button>
                        </div>
                    </template>
                </template>
            </nav>

            <!-- Modal mit Baumansicht wenn Sidebar eingeklappt und Untermenü geöffnet (Teleport damit Portal außerhalb der Sidebar rendert) -->
            <Teleport to="body">
                <Dialog v-model:open="collapsedGroupDialogOpen">
                    <DialogContent
                        class="max-h-[85vh] max-w-md overflow-hidden flex flex-col"
                        :show-close-button="true"
                    >
                        <template v-if="openCollapsedGroupItem">
                            <DialogHeader>
                                <DialogTitle class="flex items-center gap-2">
                                    <component :is="openCollapsedGroupItem.icon" v-if="openCollapsedGroupItem.icon" class="h-5 w-5 shrink-0" />
                                    {{ openCollapsedGroupItem.title }}
                                </DialogTitle>
                            </DialogHeader>
                            <nav class="overflow-y-auto flex-1 py-2 -mx-2" aria-label="Navigation">
                                <div class="space-y-0.5 border-l border-gray-200 pl-3 dark:border-gray-700">
                                    <template v-for="(child, cIdx) in openCollapsedGroupItem.children" :key="child.title + String(cIdx)">
                                        <Collapsible v-if="child.children?.length" class="group">
                                            <CollapsibleTrigger
                                                class="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                            >
                                                <ChevronRight class="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-90" />
                                                <component :is="child.icon" v-if="child.icon" class="h-4 w-4 shrink-0" />
                                                {{ child.title }}
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <div class="ml-4 mt-0.5 space-y-0.5 border-l border-gray-200 pl-3 dark:border-gray-700">
                                                    <component
                                                        v-for="(sub, sIdx) in child.children"
                                                        :key="sub.title + String(sIdx)"
                                                        v-show="sub.href"
                                                        :is="sub.external ? 'a' : Link"
                                                        :href="sub.href!"
                                                        class="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-modern text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                                        :class="!sub.external && isCurrentUrl(sub.href!) && 'gradient-primary text-white shadow-primary'"
                                                        v-bind="sub.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                                                        @click="sub.external ? undefined : closeCollapsedGroupModal()"
                                                    >
                                                        <component :is="sub.icon" v-if="sub.icon" class="h-4 w-4 shrink-0" />
                                                        {{ sub.title }}
                                                        <span
                                                            v-if="sub.badge"
                                                            class="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
                                                        >
                                                            {{ sub.badge }}
                                                        </span>
                                                    </component>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                        <component
                                            v-else-if="child.href"
                                            :is="child.external ? 'a' : Link"
                                            :href="child.href"
                                            class="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-modern text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                            :class="!child.external && isCurrentUrl(child.href) && 'gradient-primary text-white shadow-primary'"
                                            v-bind="child.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                                            @click="child.external ? undefined : closeCollapsedGroupModal()"
                                        >
                                            <component :is="child.icon" v-if="child.icon" class="h-4 w-4 shrink-0" />
                                            {{ child.title }}
                                            <span
                                                v-if="child.badge"
                                                class="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
                                            >
                                                {{ child.badge }}
                                            </span>
                                        </component>
                                    </template>
                                </div>
                            </nav>
                        </template>
                    </DialogContent>
                </Dialog>
            </Teleport>

            <!-- Footer -->
            <div
                class="border-t border-gray-200 dark:border-gray-800"
                :class="effectiveCollapsed ? 'px-2 py-3' : 'p-4'"
            >
                <div v-if="!effectiveCollapsed && user" class="mb-4 flex items-center gap-3">
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
                    <template v-if="effectiveCollapsed">
                        <TooltipRoot>
                            <TooltipTrigger as-child>
                                <button
                                    type="button"
                                    @click="toggleTheme"
                                    class="flex w-full justify-center rounded-lg p-2 text-gray-700 transition-modern hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    aria-label="Theme wechseln"
                                >
                                    <Sun v-if="appearance === 'dark'" class="h-4 w-4" />
                                    <Moon v-else class="h-4 w-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" class="font-medium">
                                Theme wechseln
                            </TooltipContent>
                        </TooltipRoot>
                    </template>
                    <button
                        v-else
                        type="button"
                        @click="toggleTheme"
                        class="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-modern hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        aria-label="Theme wechseln"
                    >
                        <Sun v-if="appearance === 'dark'" class="h-4 w-4" />
                        <Moon v-else class="h-4 w-4" />
                        <span>Theme</span>
                    </button>
                </div>
            </div>
            </div>
        </TooltipProvider>
    </aside>
</template>

<style scoped>
/* Eingeklappt: nur Icons, kein Text */
.sidebar--icons-only :deep(nav a > span:not([class*="absolute"])) {
    display: none !important;
}
.sidebar--icons-only :deep(nav a) {
    justify-content: center;
}
.sidebar--icons-only :deep(button > span) {
    display: none !important;
}
.sidebar--icons-only :deep(button) {
    justify-content: center;
}
</style>
