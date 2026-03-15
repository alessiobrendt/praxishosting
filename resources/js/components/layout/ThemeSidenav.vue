<script setup lang="ts">
/**
 * Port of .new/layouts/components/Sidenav (React) to Vue + Inertia.
 * Structure and Tailwind classes replicated exactly from source.
 */
import { Link, router } from '@inertiajs/vue3';
import { useMediaQuery } from '@vueuse/core';
import { ref, computed, onMounted, inject } from 'vue';
import { Lock, LogOut, Settings, User } from 'lucide-vue-next';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { logout } from '@/routes';
import { toUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

interface Props {
    items: NavItem[];
    user?: {
        name: string;
        email: string;
        avatar?: string;
    };
    collapsed?: boolean;
    mobileOpen?: boolean;
    showUserBlock?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    collapsed: false,
    mobileOpen: false,
    showUserBlock: false,
});

const emit = defineEmits<{
    (e: 'update:collapsed', value: boolean): void;
    (e: 'close-mobile'): void;
}>();

const { isCurrentUrl } = useCurrentUrl();
const isMobile = useMediaQuery('(max-width: 1023px)');

const collapsed = computed({
    get: () => props.collapsed,
    set: (v) => emit('update:collapsed', v),
});

function closeMobile() {
    emit('close-mobile');
}

/** Injected by layout: toggle between on-hover and on-hover-active (data-sidenav-size). */
const toggleSidenavSize = inject<() => void>('toggleSidenavSize', () => {});

function handleHoverToggle() {
    toggleSidenavSize();
}

function slug(s: string): string {
    return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/** Scroll active menu link into view (port of scrollToElement from .new/utils/layout.ts) */
function scrollToElement(element: Element, to: number, duration: number) {
    const start = (element as HTMLElement).scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;
    function easeInOutQuad(t: number, b: number, c: number, d: number) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t -= 1;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    }
    function animateScroll() {
        currentTime += increment;
        (element as HTMLElement).scrollTop = easeInOutQuad(currentTime, start, change, duration);
        if (currentTime < duration) setTimeout(animateScroll, increment);
    }
    animateScroll();
}

const openMenuKey = ref<string | null>(null);
/** Nested (level 2) accordion open keys, e.g. "parent-child" */
const openNestedKeys = ref<Set<string>>(new Set());

function scrollToActiveLink() {
    const activeItem = document.querySelector('#sidenav-menu .menu-link.active') as HTMLAnchorElement | null;
    if (activeItem) {
        const simpleBarContent = document.querySelector('#sidenav-menu .simplebar-content-wrapper');
        const scrollHost = simpleBarContent ?? document.querySelector('#sidenav-menu .overflow-y-auto');
        if (scrollHost) {
            const offset = activeItem.offsetTop - window.innerHeight * 0.4;
            scrollToElement(scrollHost, offset, 500);
        }
    }
}

onMounted(() => {
    props.items.forEach((item) => {
        if (item.children?.length && !item.href) {
            item.children.forEach((child) => {
                if (hasActiveChild(child)) openMenuKey.value = itemSlug(child);
            });
        } else if (item.children?.length && hasActiveChild(item)) {
            openMenuKey.value = itemSlug(item);
            item.children.forEach((child) => {
                if (child.children?.length && hasActiveChild(child)) {
                    openNestedKeys.value = new Set(openNestedKeys.value).add(`${itemSlug(item)}-${itemSlug(child)}`);
                }
            });
        }
    });
    setTimeout(scrollToActiveLink, 150);
});

function hasActiveChild(item: NavItem): boolean {
    const url = toUrl(item.href);
    if (url && isCurrentUrl(url)) return true;
    if (item.children) return item.children.some((c) => hasActiveChild(c));
    return false;
}

function isActive(item: NavItem): boolean {
    const url = toUrl(item.href);
    if (url && isCurrentUrl(url)) return true;
    return hasActiveChild(item);
}

function itemSlug(item: NavItem): string {
    return slug(item.title);
}

function toggleOpenMenu(key: string) {
    openMenuKey.value = openMenuKey.value === key ? null : key;
}

function isNestedOpen(parentSlug: string, childSlug: string): boolean {
    return openNestedKeys.value.has(`${parentSlug}-${childSlug}`);
}

function toggleNestedOpen(parentSlug: string, childSlug: string) {
    const key = `${parentSlug}-${childSlug}`;
    const next = new Set(openNestedKeys.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    openNestedKeys.value = next;
}
</script>

<template>
    <!-- Mobile backdrop (Vue/Inertia integration; not in .new Sidenav) -->
    <div
        v-if="isMobile && mobileOpen"
        class="fixed inset-0 z-40 bg-black/50 lg:hidden"
        aria-hidden="true"
        @click="closeMobile"
    />
    <aside
        id="app-menu"
        class="app-menu transition-transform duration-300 lg:translate-x-0"
        :class="{
            'translate-x-0': !isMobile || mobileOpen,
            '-translate-x-full': isMobile && !mobileOpen,
        }"
        aria-label="Hauptnavigation"
    >
        <!-- Logo: exact classes and structure from .new Sidenav/index.tsx + AppLogo -->
        <Link
            href="/"
            class="logo-box min-h-[var(--topbar-height)] sticky top-0 flex items-center justify-start px-6 backdrop-blur-xs"
        >
            <span class="logo logo-light hidden">
                <span class="logo-lg"><img alt="Logo" src="/images/logo.png" class="h-6" /></span>
                <span class="logo-sm"><img alt="Logo" src="/images/logo-sm.png" class="h-6" /></span>
            </span>
            <span class="logo logo-dark">
                <span class="logo-lg"><img alt="Logo" src="/images/logo-black.png" class="h-6" /></span>
                <span class="logo-sm"><img alt="Logo" src="/images/logo-sm.png" class="h-6" /></span>
            </span>
        </Link>

        <!-- OnHoverToggle: exact structure from .new Sidenav/components/OnHoverToggle.tsx -->
        <div class="h-topbar justify absolute end-5 top-0 flex items-center">
            <button id="button-hover-toggle" type="button" @click="handleHoverToggle">
                <span class="btn-on-hover-icon" />
            </button>
        </div>

        <!-- Sidenav menu wrapper: exact from .new -->
        <div id="sidenav-menu" class="relative min-h-0 grow">
            <div class="size-full overflow-y-auto overflow-x-hidden simplebar-scrollable-y">
                <!-- UserProfileSettings: exact structure from .new Sidenav/components/UserProfileSettings.tsx -->
                <div
                    v-if="showUserBlock && user"
                    id="user-profile-settings"
                    class="sidenav-user p-5"
                    :style="{ backgroundImage: 'url(\"/images/user-bg-pattern.svg\")' }"
                >
                    <div class="flex items-center justify-between">
                        <div>
                            <Link href="/settings/profile" class="link-reset">
                                <img
                                    v-if="user.avatar"
                                    :src="user.avatar"
                                    alt="user"
                                    class="mb-3 size-9 rounded-full"
                                />
                                <span
                                    v-else
                                    class="mb-3 flex size-9 items-center justify-center rounded-full bg-primary/20 font-semibold text-primary"
                                >
                                    {{ user.name.charAt(0).toUpperCase() }}
                                </span>
                                <span class="sidenav-user-name block font-bold text-nowrap">{{ user.name }}</span>
                                <span class="text-xs font-semibold text-default-500">{{ user.email }}</span>
                            </Link>
                        </div>
                        <div>
                            <div class="hs-dropdown relative inline-flex [--placement:bottom-right]">
                                <button
                                    type="button"
                                    class="cursor-pointer"
                                    aria-haspopup="menu"
                                    aria-expanded="false"
                                    aria-label="Dropdown"
                                >
                                    <Settings class="ms-1 size-6 align-middle" />
                                </button>
                                <div
                                    class="hs-dropdown-menu hidden min-w-48 rounded-lg border border-default-200 bg-white py-1 shadow-lg dark:border-default-700 dark:bg-neutral-800"
                                    role="menu"
                                    aria-orientation="vertical"
                                >
                                    <div class="py-2 px-3.5">
                                        <h6 class="text-xs">Willkommen 👋!</h6>
                                    </div>
                                    <Link href="/settings/profile" class="dropdown-item flex items-center gap-2">
                                        <User class="me-1 size-4 align-middle" />
                                        <span class="align-middle">Profil</span>
                                    </Link>
                                    <Link href="/settings/profile" class="dropdown-item flex items-center gap-2">
                                        <Settings class="me-1 size-4 align-middle" />
                                        <span class="align-middle">Einstellungen</span>
                                    </Link>
                                    <Link href="/auth/lock-screen" class="dropdown-item flex items-center gap-2">
                                        <Lock class="me-1 size-4 align-middle" />
                                        <span class="align-middle">Bildschirm sperren</span>
                                    </Link>
                                    <button
                                        type="button"
                                        class="dropdown-item flex w-full items-center gap-2 text-danger"
                                        @click="() => router.post(logout().url())"
                                    >
                                        <LogOut class="me-1 size-4 align-middle" />
                                        <span class="align-middle">Abmelden</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- AppMenu: exact structure from .new Sidenav/components/AppMenu.tsx -->
                <div>
                    <ul class="side-nav hs-accordion-group px-2.5 pb-16.5">
                        <template v-for="(item, idx) in items" :key="item.title + String(idx)">
                            <!-- Section title: item with children and no href (like React isTitle) -->
                            <template v-if="item.children?.length && !item.href">
                                <li class="menu-title mt-0!">
                                    <span>{{ item.title }}</span>
                                </li>
                                <template v-for="(child, cIdx) in item.children" :key="child.title + String(cIdx)">
                                    <li
                                        v-if="child.children?.length"
                                        :id="`grp-${itemSlug(child)}`"
                                        :class="cn('menu-item hs-accordion', { active: isActive(child) })"
                                    >
                                        <component
                                            :is="child.external ? 'a' : Link"
                                            :href="child.external ? child.href : (toUrl(child.href) ?? '#')"
                                            :class="cn('hs-accordion-toggle menu-link w-full cursor-pointer rounded-[5px] border-none bg-transparent text-left', isActive(child) && 'active')"
                                            :aria-expanded="openMenuKey === itemSlug(child)"
                                            :data-hs-accordion="`#sub-${itemSlug(child)}`"
                                            :target="child.external ? '_blank' : undefined"
                                            :rel="child.external ? 'noopener noreferrer' : undefined"
                                            @click="
                                                (e) => {
                                                    if (child.children?.length) (e as MouseEvent).preventDefault();
                                                    toggleOpenMenu(itemSlug(child));
                                                    if (isMobile) closeMobile();
                                                }
                                            "
                                        >
                                            <span v-if="child.icon" class="menu-icon">
                                                <component :is="child.icon" class="h-[1.125rem] w-[1.125rem]" />
                                            </span>
                                            <span class="menu-text">{{ child.title }}</span>
                                            <span v-if="child.badge" class="badge text-white">{{ child.badge }}</span>
                                            <span v-else class="menu-arrow" />
                                        </component>
                                        <ul
                                            :id="`sub-${itemSlug(child)}`"
                                            class="sub-menu hs-accordion-content hs-accordion-group"
                                            :class="{ hidden: openMenuKey !== itemSlug(child) }"
                                            role="group"
                                        >
                                            <template v-for="(sub, sIdx) in child.children" :key="sub.title + String(sIdx)">
                                                <li
                                                    v-if="sub.href"
                                                    :class="cn('menu-item', isActive(sub) && 'active')"
                                                >
                                                    <component
                                                        :is="sub.external ? 'a' : Link"
                                                        :href="sub.external ? sub.href : (toUrl(sub.href) ?? '#')"
                                                        :class="cn('menu-link', isActive(sub) && 'active')"
                                                        :target="sub.external ? '_blank' : undefined"
                                                        :rel="sub.external ? 'noopener noreferrer' : undefined"
                                                        @click="isMobile ? closeMobile() : undefined"
                                                    >
                                                        <span class="menu-text">{{ sub.title }}</span>
                                                        <span v-if="sub.badge" class="badge text-white">{{ sub.badge }}</span>
                                                    </component>
                                                </li>
                                            </template>
                                        </ul>
                                    </li>
                                    <li
                                        v-else-if="child.href"
                                        :class="cn('menu-item', isActive(child) && 'active')"
                                    >
                                        <component
                                            :is="child.external ? 'a' : Link"
                                            :href="child.external ? child.href : (toUrl(child.href) ?? '#')"
                                            :class="cn('menu-link', isActive(child) && 'active')"
                                            :target="child.external ? '_blank' : undefined"
                                            :rel="child.external ? 'noopener noreferrer' : undefined"
                                            @click="isMobile ? closeMobile() : undefined"
                                        >
                                            <span class="menu-text">{{ child.title }}</span>
                                            <span v-if="child.badge" class="badge text-white">{{ child.badge }}</span>
                                        </component>
                                    </li>
                                </template>
                            </template>
                            <!-- Item with children and href: accordion (MenuItemWithChildren) -->
                            <template v-else-if="item.children?.length && item.href">
                                <li
                                    :id="`grp-${itemSlug(item)}`"
                                    :class="cn('menu-item hs-accordion', { active: isActive(item) })"
                                >
                                    <component
                                        :is="item.external ? 'a' : Link"
                                        :href="item.external ? item.href : (toUrl(item.href) ?? '#')"
                                        :class="cn('hs-accordion-toggle menu-link w-full cursor-pointer rounded-[5px] border-none bg-transparent text-left', isActive(item) && 'active')"
                                        :aria-expanded="openMenuKey === itemSlug(item)"
                                        :data-hs-accordion="`#sub-${itemSlug(item)}`"
                                        :target="item.external ? '_blank' : undefined"
                                        :rel="item.external ? 'noopener noreferrer' : undefined"
                                        @click="
                                            (e) => {
                                                if (item.children?.length) (e as MouseEvent).preventDefault();
                                                toggleOpenMenu(itemSlug(item));
                                                if (isMobile) closeMobile();
                                            }
                                        "
                                    >
                                        <span v-if="item.icon" class="menu-icon">
                                            <component :is="item.icon" class="h-[1.125rem] w-[1.125rem]" />
                                        </span>
                                        <span class="menu-text">{{ item.title }}</span>
                                        <span v-if="item.badge" class="badge text-white">{{ item.badge }}</span>
                                        <span v-else class="menu-arrow" />
                                    </component>
                                    <ul
                                        :id="`sub-${itemSlug(item)}`"
                                        class="sub-menu hs-accordion-content hs-accordion-group"
                                        :class="{ hidden: openMenuKey !== itemSlug(item) }"
                                        role="group"
                                    >
                                        <template v-for="(child, cIdx) in item.children" :key="child.title + String(cIdx)">
                                            <li
                                                v-if="child.children?.length"
                                                :class="cn('menu-item hs-accordion', { active: isActive(child) })"
                                            >
                                                <component
                                                    :is="child.external ? 'a' : Link"
                                                    :href="child.external ? child.href : (toUrl(child.href) ?? '#')"
                                                    :class="cn('hs-accordion-toggle menu-link w-full cursor-pointer rounded-[5px] border-none bg-transparent text-left', isActive(child) && 'active')"
                                                    :data-hs-accordion="`#sub-${itemSlug(item)}-${itemSlug(child)}`"
                                                    :aria-expanded="isNestedOpen(itemSlug(item), itemSlug(child))"
                                                    :target="child.external ? '_blank' : undefined"
                                                    :rel="child.external ? 'noopener noreferrer' : undefined"
                                                    @click="
                                                        (e) => {
                                                            (e as MouseEvent).preventDefault();
                                                            toggleNestedOpen(itemSlug(item), itemSlug(child));
                                                            if (isMobile) closeMobile();
                                                        }
                                                    "
                                                >
                                                    <span class="menu-text">{{ child.title }}</span>
                                                    <span class="menu-arrow" />
                                                </component>
                                                <ul
                                                    :id="`sub-${itemSlug(item)}-${itemSlug(child)}`"
                                                    class="sub-menu hs-accordion-content hs-accordion-group"
                                                    :class="{ hidden: !isNestedOpen(itemSlug(item), itemSlug(child)) }"
                                                    role="group"
                                                >
                                                    <li
                                                        v-for="(sub, sIdx) in child.children"
                                                        v-show="sub.href"
                                                        :key="sub.title + String(sIdx)"
                                                        :class="cn('menu-item', isActive(sub) && 'active')"
                                                    >
                                                        <component
                                                            :is="sub.external ? 'a' : Link"
                                                            :href="sub.external ? sub.href : (toUrl(sub.href!) ?? '#')"
                                                            :class="cn('menu-link', isActive(sub) && 'active')"
                                                            :target="sub.external ? '_blank' : undefined"
                                                            :rel="sub.external ? 'noopener noreferrer' : undefined"
                                                            @click="isMobile ? closeMobile() : undefined"
                                                        >
                                                            <span class="menu-text">{{ sub.title }}</span>
                                                            <span v-if="sub.badge" class="badge text-white">{{ sub.badge }}</span>
                                                        </component>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                v-else-if="child.href"
                                                :class="cn('menu-item', isActive(child) && 'active')"
                                            >
                                                <component
                                                    :is="child.external ? 'a' : Link"
                                                    :href="child.external ? child.href : (toUrl(child.href) ?? '#')"
                                                    :class="cn('menu-link', isActive(child) && 'active')"
                                                    :target="child.external ? '_blank' : undefined"
                                                    :rel="child.external ? 'noopener noreferrer' : undefined"
                                                    @click="isMobile ? closeMobile() : undefined"
                                                >
                                                    <span class="menu-text">{{ child.title }}</span>
                                                    <span v-if="child.badge" class="badge text-white">{{ child.badge }}</span>
                                                </component>
                                            </li>
                                        </template>
                                    </ul>
                                </li>
                            </template>
                            <!-- Leaf item (MenuItem) -->
                            <template v-else-if="item.href">
                                <li :class="cn('menu-item', isActive(item) && 'active')">
                                    <component
                                        :is="item.external ? 'a' : Link"
                                        :href="item.external ? item.href : (toUrl(item.href) ?? '#')"
                                        :class="cn('menu-link', isActive(item) && 'active')"
                                        :target="item.external ? '_blank' : undefined"
                                        :rel="item.external ? 'noopener noreferrer' : undefined"
                                        @click="isMobile ? closeMobile() : undefined"
                                    >
                                        <span v-if="item.icon" class="menu-icon">
                                            <component :is="item.icon" class="h-[1.125rem] w-[1.125rem]" />
                                        </span>
                                        <span class="menu-text">{{ item.title }}</span>
                                        <span v-if="item.badge" class="badge text-white">{{ item.badge }}</span>
                                    </component>
                                </li>
                            </template>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
    </aside>
</template>
