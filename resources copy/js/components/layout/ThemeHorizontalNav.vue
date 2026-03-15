<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

interface Props {
    items: NavItem[];
}

defineProps<Props>();

function slug(s: string): string {
    return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
</script>

<template>
    <div class="topnav top-topbar-height border-default-300 fixed z-30 flex w-full items-center border-b bg-(--sidenav-bg)">
        <div class="container-fluid">
            <nav
                aria-label="Hauptnavigation"
                class="grow basis-full overflow-hidden lg:block"
                id="topnav-menu"
            >
                <ul class="navbar-nav flex flex-wrap">
                    <template v-for="(item, idx) in items" :key="item.title + String(idx)">
                        <!-- Leaf -->
                        <li v-if="!item.children?.length && item.href" class="nav-item">
                            <component
                                :is="item.external ? 'a' : Link"
                                :href="item.external ? item.href : toUrl(item.href) ?? '#'"
                                class="nav-link flex items-center gap-2"
                                v-bind="item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                            >
                                <span v-if="item.icon" class="menu-icon">
                                    <component :is="item.icon" class="h-5 w-5" />
                                </span>
                                <span class="menu-text">{{ item.title }}</span>
                            </component>
                        </li>
                        <!-- Group with children -->
                        <li v-else-if="item.children?.length" class="nav-item">
                            <div class="topbar-item hs-dropdown relative inline-flex [--placement:bottom-right]">
                                <button
                                    type="button"
                                    class="hs-dropdown-toggle nav-link flex items-center gap-2"
                                    aria-expanded="false"
                                    aria-haspopup="menu"
                                >
                                    <span v-if="item.icon" class="menu-icon">
                                        <component :is="item.icon" class="h-5 w-5" />
                                    </span>
                                    <span class="menu-text">{{ item.title }}</span>
                                </button>
                                <div
                                    class="hs-dropdown-menu hidden min-w-48"
                                    role="menu"
                                    aria-orientation="vertical"
                                >
                                    <template v-for="(child, cIdx) in item.children" :key="child.title + String(cIdx)">
                                        <Link
                                            v-if="child.href && !child.children?.length"
                                            :href="child.external ? child.href : toUrl(child.href) ?? '#'"
                                            class="dropdown-item"
                                            v-bind="child.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                                        >
                                            {{ child.title }}
                                        </Link>
                                        <template v-else-if="child.children?.length">
                                            <div class="hs-dropdown relative [--placement:bottom-right]">
                                                <button
                                                    type="button"
                                                    class="hs-dropdown-toggle dropdown-item w-full text-start flex items-center justify-between"
                                                    aria-expanded="false"
                                                >
                                                    {{ child.title }}
                                                </button>
                                                <div class="hs-dropdown-menu hidden min-w-40" role="menu">
                                                    <Link
                                                        v-for="(sub, sIdx) in child.children"
                                                        v-show="sub.href"
                                                        :key="sub.title + String(sIdx)"
                                                        :href="sub.external ? sub.href! : toUrl(sub.href!) ?? '#'"
                                                        class="dropdown-item"
                                                        v-bind="sub.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                                                    >
                                                        {{ sub.title }}
                                                    </Link>
                                                </div>
                                            </div>
                                        </template>
                                    </template>
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>
            </nav>
        </div>
    </div>
</template>
