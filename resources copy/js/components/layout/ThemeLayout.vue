<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { ref, computed, provide, onMounted, watch } from 'vue';
import type { BreadcrumbItem, NavItem } from '@/types';
import ThemeTopbar from './ThemeTopbar.vue';
import ThemeSidenav from './ThemeSidenav.vue';
import ThemeHorizontalNav from './ThemeHorizontalNav.vue';
import ThemePageTitle from './ThemePageTitle.vue';
import ThemeFooter from './ThemeFooter.vue';
import ThemeCustomizer from './ThemeCustomizer.vue';
import { useAppearance } from '@/composables/useAppearance';
import {
    useThemeLayoutConfig,
    loadFromStorage,
    saveToStorage,
    applyThemeConfig,
    defaultThemeLayoutConfig,
} from '@/composables/useThemeLayoutConfig';
import type { ThemeLayoutConfig } from '@/composables/useThemeLayoutConfig';
import { cn } from '@/lib/utils';

const SIDEBAR_COLLAPSED_KEY = 'app-sidebar-collapsed';
const CUSTOMIZER_ID = 'theme-customization';

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

export type LayoutWidth = 'full' | 'boxed';
export type SidenavSize = 'default' | 'compact' | 'on-hover' | 'offcanvas';
export type LayoutMode = 'default' | 'horizontal' | 'preloader';
export type LayoutPosition = 'fixed' | 'scrollable';
export type MenuColor = 'default' | 'light' | 'gray' | 'gradient' | 'image';
export type TopbarColor = 'default' | 'dark' | 'gray' | 'gradient';

interface Props {
    sidebarItems: NavItem[];
    breadcrumbs?: BreadcrumbItem[];
    /** Seitentitel im Hauptbereich */
    pageTitle?: string;
    /** Optionaler Untertitel (z. B. Breadcrumb-Text) */
    pageSubtitle?: string;
    /** Footer anzeigen */
    showFooter?: boolean;
    /** Layout-Breite: full (standard) oder boxed */
    layoutWidth?: LayoutWidth;
    /** Sidebar-Größe: default, compact, on-hover, offcanvas */
    sidenavSize?: SidenavSize;
    /** Layout-Modus: default (Sidebar), horizontal (Top-Nav), preloader */
    layout?: LayoutMode;
    /** Hauptbereich fix oder scrollbar */
    layoutPosition?: LayoutPosition;
    /** Sidebar-Farbe: default, light, gray, gradient, image */
    menuColor?: MenuColor;
    /** Topbar-Farbe: default, dark, gray, gradient */
    topbarColor?: TopbarColor;
    /** Preloader anzeigen (Overlay mit Spinner) */
    showPreloader?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
    pageTitle: undefined,
    pageSubtitle: undefined,
    showFooter: true,
    layoutWidth: 'full',
    sidenavSize: 'default',
    layout: 'default',
    layoutPosition: 'fixed',
    menuColor: 'default',
    topbarColor: 'default',
    showPreloader: false,
});

const page = usePage();
const user = computed(() => page.props.auth?.user as { name: string; email: string; avatar?: string } | undefined);
const { resolvedAppearance } = useAppearance();
const isSidebarCollapsed = ref(false);
const isSidebarOpenMobile = ref(false);
const preloaderVisible = ref(props.showPreloader);

const layoutConfigOptions = computed(() => ({
    theme: resolvedAppearance.value,
    layoutWidth: props.layoutWidth,
    sidenavSize: props.sidenavSize,
    layout: props.layout,
    layoutPosition: props.layoutPosition,
    menuColor: props.menuColor,
    topbarColor: props.topbarColor,
}));

useThemeLayoutConfig(layoutConfigOptions, true);

onMounted(() => {
    isSidebarCollapsed.value = loadSidebarCollapsed();
    if (props.showPreloader) {
        const t = setTimeout(() => {
            preloaderVisible.value = false;
        }, 800);
        return () => clearTimeout(t);
    }
});

watch(
    () => props.showPreloader,
    (show) => {
        if (show) {
            preloaderVisible.value = true;
            setTimeout(() => {
                preloaderVisible.value = false;
            }, 800);
        }
    },
);

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

/** Update data-sidenav-size (for .new OnHoverToggle port). Pass a size or use toggle. */
function updateSidenavSize(size: string) {
    const stored = loadFromStorage();
    const merged: ThemeLayoutConfig = {
        ...defaultThemeLayoutConfig,
        ...stored,
        sidenavSize: size,
    };
    saveToStorage(merged);
    applyThemeConfig(merged);
}
/** Toggle between on-hover and on-hover-active */
function toggleSidenavSize() {
    const stored = loadFromStorage();
    const current = stored?.sidenavSize ?? defaultThemeLayoutConfig.sidenavSize;
    const next = current === 'on-hover-active' ? 'on-hover' : 'on-hover-active';
    updateSidenavSize(next);
}
provide('updateSidenavSize', updateSidenavSize);
provide('toggleSidenavSize', toggleSidenavSize);

const wrapperClass = computed(() =>
    cn(
        'wrapper flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950',
        props.layoutWidth === 'boxed' && 'max-w-7xl mx-auto',
    ),
);

const bodyClass = computed(() =>
    cn('flex flex-1 flex-col', props.layout === 'horizontal' && 'flex-row'),
);

const pageContentClass = computed(() =>
    cn(
        'page-content flex flex-1 flex-col transition-modern-slow',
        props.layout === 'horizontal' ? 'pt-0' : '',
        props.layoutPosition === 'scrollable' ? 'min-h-0 overflow-auto' : 'min-h-screen',
        props.layout !== 'horizontal' && [
            'ml-0 lg:transition-[margin]',
            isSidebarCollapsed.value ? 'lg:ml-20' : 'lg:ml-64',
        ],
    ),
);

const isHorizontal = computed(() => props.layout === 'horizontal');
</script>

<template>
    <div class="theme-layout">
        <div :class="wrapperClass">
            <ThemeTopbar
                :breadcrumbs="breadcrumbs"
                :user="user"
                :customizer-id="CUSTOMIZER_ID"
                class="theme-topbar shrink-0"
            />
            <div :class="bodyClass">
                <ThemeSidenav
                    v-if="!isHorizontal"
                    :items="sidebarItems"
                    :user="user"
                    v-model:collapsed="isSidebarCollapsed"
                    :mobile-open="isSidebarOpenMobile"
                    :show-user-block="false"
                    @close-mobile="closeMobileSidebar"
                />
                <ThemeHorizontalNav
                    v-if="isHorizontal"
                    :items="sidebarItems"
                />
                <div :class="pageContentClass">
                    <main class="flex flex-1 flex-col p-4 sm:p-6">
                        <ThemePageTitle
                            v-if="pageTitle"
                            :title="pageTitle"
                            :subtitle="pageSubtitle"
                            :breadcrumbs="breadcrumbs"
                        />
                        <div
                            v-if="showPreloader && preloaderVisible"
                            class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950 animate-[fade-out_1s_ease_forwards]"
                            aria-hidden="true"
                        >
                            <div
                                class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
                                role="status"
                                aria-label="Laden"
                            />
                        </div>
                        <slot />
                        <ThemeFooter v-if="showFooter" />
                    </main>
                </div>
            </div>
        </div>
        <ThemeCustomizer :overlay-id="CUSTOMIZER_ID" />
    </div>
</template>
