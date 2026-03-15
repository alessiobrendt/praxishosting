<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
    applyThemeConfig,
    defaultThemeLayoutConfig,
    loadFromStorage,
    saveToStorage,
} from '@/composables/useThemeLayoutConfig';
import type { ThemeLayoutConfig } from '@/composables/useThemeLayoutConfig';
import { useAppearance } from '@/composables/useAppearance';

const SKINS = [
    'default',
    'minimal',
    'modern',
    'material',
    'saas',
    'flat',
    'galaxy',
    'luxe',
    'retro',
    'neon',
    'pixel',
    'soft',
    'mono',
    'prism',
    'nova',
    'zen',
    'elegant',
    'vivid',
    'aurora',
    'crystal',
    'matrix',
    'orbit',
    'neo',
    'silver',
    'xenon',
] as const;

const SIDENAV_SIZES = [
    { value: 'default', label: 'Default' },
    { value: 'compact', label: 'Compact' },
    { value: 'condensed', label: 'Condensed' },
    { value: 'on-hover', label: 'On Hover' },
    { value: 'on-hover-active', label: 'On Hover- Show' },
    { value: 'offcanvas', label: 'Offcanvas' },
] as const;

const THEME_MODES = [
    { value: 'light' as const, label: 'Light' },
    { value: 'dark' as const, label: 'Dark' },
    { value: 'system' as const, label: 'System' },
];

const MENU_COLORS = ['light', 'dark', 'gradient', 'gray', 'image'] as const;
const TOPBAR_COLORS = ['light', 'dark', 'gradient', 'gray'] as const;
const LAYOUT_WIDTHS = [
    { value: 'fluid' as const, label: 'Fluid' },
    { value: 'boxed' as const, label: 'Boxed' },
];
const LAYOUT_POSITIONS = [
    { value: 'fixed' as const, label: 'Fixed' },
    { value: 'scrollable' as const, label: 'Scrollable' },
];
const DIRECTIONS = [
    { value: 'ltr' as const, label: 'LTR Mode' },
    { value: 'rtl' as const, label: 'RTL Mode' },
];

interface Props {
    overlayId?: string;
}

const props = withDefaults(defineProps<Props>(), {
    overlayId: 'theme-customization',
});

const { updateAppearance } = useAppearance();

const config = ref<ThemeLayoutConfig>({ ...defaultThemeLayoutConfig });

function getFullConfig(): ThemeLayoutConfig {
    return {
        ...defaultThemeLayoutConfig,
        ...config.value,
    };
}

function apply(): void {
    const full = getFullConfig();
    applyThemeConfig(full);
    saveToStorage(full);
    updateAppearance(full.theme);
}

function setSkin(skin: string): void {
    config.value.skin = skin;
    apply();
}

function setDir(dir: 'ltr' | 'rtl'): void {
    config.value.dir = dir;
    apply();
}

function setSidenavSize(size: string): void {
    config.value.sidenavSize = size;
    apply();
}

function setTheme(theme: 'light' | 'dark' | 'system'): void {
    config.value.theme = theme;
    apply();
}

function setMenuColor(color: string): void {
    config.value.menuColor = color;
    apply();
}

function setTopbarColor(color: string): void {
    config.value.topbarColor = color;
    apply();
}

function setWidth(width: 'fluid' | 'boxed'): void {
    config.value.width = width;
    apply();
}

function setPosition(position: 'fixed' | 'scrollable'): void {
    config.value.position = position;
    apply();
}

function setSidenavUser(checked: boolean): void {
    config.value.sidenavUser = checked;
    apply();
}

function reset(): void {
    config.value = { ...defaultThemeLayoutConfig };
    apply();
}

onMounted(() => {
    const stored = loadFromStorage();
    if (stored) {
        config.value = { ...defaultThemeLayoutConfig, ...stored };
    }
});
</script>

<template>
    <div
        class="hs-overlay hs-overlay-open:translate-x-0 fixed inset-y-0 end-0 z-[80] hidden w-full max-w-[400px] translate-x-full flex-col overflow-hidden bg-white shadow-xl transition-all duration-300 rtl:-translate-x-full dark:bg-neutral-900"
        :id="overlayId"
        tabindex="-1"
        aria-labelledby="theme-customizer-title"
        aria-hidden="true"
    >
        <div class="flex items-start gap-3 border-b border-dashed border-neutral-200 bg-primary p-6 dark:border-neutral-700">
            <div class="min-w-0 flex-1">
                <h5 id="theme-customizer-title" class="mb-1.5 text-sm font-bold uppercase tracking-wide text-white">
                    Admin Customizer
                </h5>
                <p class="text-sm font-medium italic text-white/85">
                    Configure layout, styles, and preferences for your admin interface.
                </p>
            </div>
            <button
                type="button"
                class="btn btn-sm size-8 rounded-full bg-white/20 text-white hover:bg-white/30"
                :data-hs-overlay="'#' + overlayId"
                aria-label="Close customizer"
            >
                <span class="sr-only">Close</span>
                <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
            <div class="divide-y divide-dashed divide-neutral-200 dark:divide-neutral-700">
                <!-- Skin -->
                <section class="py-5" id="skin">
                    <h5 class="mb-4 text-sm font-bold text-neutral-800 dark:text-neutral-200">Select Theme</h5>
                    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <label
                            v-for="s in SKINS"
                            :key="s"
                            class="card-radio flex cursor-pointer flex-col rounded-lg border-2 p-2 transition-colors"
                            :class="config.skin === s ? 'border-primary bg-primary/5' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'"
                        >
                            <input
                                v-model="config.skin"
                                type="radio"
                                :value="s"
                                name="data-skin"
                                class="hidden"
                                @change="setSkin(s)"
                            />
                            <span class="text-center text-xs font-medium capitalize text-neutral-600 dark:text-neutral-400">{{ s }}</span>
                        </label>
                    </div>
                </section>
                <!-- Theme direction -->
                <section class="py-5">
                    <h5 class="mb-4 text-sm font-bold text-neutral-800 dark:text-neutral-200">Theme Direction</h5>
                    <div class="flex gap-2">
                        <label
                            v-for="d in DIRECTIONS"
                            :key="d.value"
                            class="card-radio flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 py-3 transition-colors"
                            :class="config.dir === d.value ? 'border-primary bg-primary/5' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'"
                        >
                            <input
                                v-model="config.dir"
                                type="radio"
                                :value="d.value"
                                name="dir"
                                class="hidden"
                                @change="setDir(d.value)"
                            />
                            <span class="text-sm font-medium">{{ d.label }}</span>
                        </label>
                    </div>
                </section>
                <!-- Sidenav view -->
                <section class="py-5" id="sidenav-size">
                    <h5 class="mb-4 text-sm font-bold text-neutral-800 dark:text-neutral-200">Sidenav View</h5>
                    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <label
                            v-for="opt in SIDENAV_SIZES"
                            :key="opt.value"
                            class="card-radio flex cursor-pointer flex-col rounded-lg border-2 p-2 transition-colors"
                            :class="config.sidenavSize === opt.value ? 'border-primary bg-primary/5' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'"
                        >
                            <input
                                v-model="config.sidenavSize"
                                type="radio"
                                :value="opt.value"
                                name="data-sidenav-size"
                                class="hidden"
                                @change="setSidenavSize(opt.value)"
                            />
                            <span class="text-center text-xs font-medium text-neutral-600 dark:text-neutral-400">{{ opt.label }}</span>
                        </label>
                    </div>
                </section>
                <!-- Theme mode -->
                <section class="py-5" id="theme">
                    <h5 class="mb-4 text-sm font-bold text-neutral-800 dark:text-neutral-200">Theme Mode</h5>
                    <div class="grid grid-cols-3 gap-2">
                        <label
                            v-for="t in THEME_MODES"
                            :key="t.value"
                            class="card-radio flex cursor-pointer flex-col rounded-lg border-2 p-2 transition-colors"
                            :class="config.theme === t.value ? 'border-primary bg-primary/5' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'"
                        >
                            <input
                                v-model="config.theme"
                                type="radio"
                                :value="t.value"
                                name="data-theme"
                                class="hidden"
                                @change="setTheme(t.value)"
                            />
                            <span class="text-center text-xs font-medium text-neutral-600 dark:text-neutral-400">{{ t.label }}</span>
                        </label>
                    </div>
                </section>
                <!-- Sidenav color -->
                <section class="py-5" id="sidenav-color">
                    <h5 class="mb-4 text-sm font-bold text-neutral-800 dark:text-neutral-200">Sidenav Color</h5>
                    <div class="flex flex-wrap gap-2">
                        <label
                            v-for="c in MENU_COLORS"
                            :key="c"
                            class="card-radio flex cursor-pointer rounded-lg border-2 px-3 py-2 transition-colors capitalize"
                            :class="config.menuColor === c ? 'border-primary bg-primary/5' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'"
                        >
                            <input
                                v-model="config.menuColor"
                                type="radio"
                                :value="c"
                                name="data-menu-color"
                                class="hidden"
                                @change="setMenuColor(c)"
                            />
                            <span class="text-xs font-medium text-neutral-600 dark:text-neutral-400">{{ c }}</span>
                        </label>
                    </div>
                </section>
                <!-- Topbar color -->
                <section class="py-5" id="topbar-color">
                    <h5 class="mb-4 text-sm font-bold text-neutral-800 dark:text-neutral-200">Topbar Color</h5>
                    <div class="flex flex-wrap gap-2">
                        <label
                            v-for="c in TOPBAR_COLORS"
                            :key="c"
                            class="card-radio flex cursor-pointer rounded-lg border-2 px-3 py-2 transition-colors capitalize"
                            :class="config.topbarColor === c ? 'border-primary bg-primary/5' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'"
                        >
                            <input
                                v-model="config.topbarColor"
                                type="radio"
                                :value="c"
                                name="data-topbar-color"
                                class="hidden"
                                @change="setTopbarColor(c)"
                            />
                            <span class="text-xs font-medium text-neutral-600 dark:text-neutral-400">{{ c }}</span>
                        </label>
                    </div>
                </section>
                <!-- Layout width -->
                <section class="py-5" id="width">
                    <h5 class="mb-4 text-sm font-bold text-neutral-800 dark:text-neutral-200">Layout Width</h5>
                    <div class="flex gap-2">
                        <label
                            v-for="w in LAYOUT_WIDTHS"
                            :key="w.value"
                            class="card-radio flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 py-3 transition-colors"
                            :class="config.width === w.value ? 'border-primary bg-primary/5' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-600'"
                        >
                            <input
                                v-model="config.width"
                                type="radio"
                                :value="w.value"
                                name="data-layout-width"
                                class="hidden"
                                @change="setWidth(w.value)"
                            />
                            <span class="text-sm font-medium">{{ w.label }}</span>
                        </label>
                    </div>
                </section>
                <!-- Layout position -->
                <section class="py-5" id="position">
                    <div class="flex items-center justify-between">
                        <h5 class="font-bold text-neutral-800 dark:text-neutral-200">Layout Position</h5>
                        <div class="flex gap-1">
                            <label
                                v-for="p in LAYOUT_POSITIONS"
                                :key="p.value"
                                class="btn btn-sm cursor-pointer rounded px-3 py-1.5 text-xs transition-colors"
                                :class="config.position === p.value ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'"
                            >
                                <input
                                    v-model="config.position"
                                    type="radio"
                                    :value="p.value"
                                    name="data-layout-position"
                                    class="hidden"
                                    @change="setPosition(p.value)"
                                />
                                {{ p.label }}
                            </label>
                        </div>
                    </div>
                </section>
                <!-- Sidenav user -->
                <section class="py-5" id="sidenav-user">
                    <div class="flex items-center justify-between">
                        <label class="m-0 font-bold text-neutral-800 dark:text-neutral-200" for="sidebaruser-check">
                            Sidebar User Info
                        </label>
                        <input
                            id="sidebaruser-check"
                            v-model="config.sidenavUser"
                            type="checkbox"
                            name="sidebar-user"
                            class="form-switch size-5 rounded-full"
                            @change="setSidenavUser((config.sidenavUser as boolean))"
                        />
                    </div>
                </section>
            </div>
        </div>
        <div class="flex gap-4 border-t border-neutral-200 p-5 dark:border-neutral-700">
            <button
                type="button"
                class="btn flex-1 bg-red-600 py-3 text-white hover:bg-red-700"
                @click="reset"
            >
                Reset
            </button>
        </div>
    </div>
</template>
