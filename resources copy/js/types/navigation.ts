import type { InertiaLinkProps } from '@inertiajs/vue3';
import type { Component } from 'vue';

export type BreadcrumbItem = {
    title: string;
    href?: string;
};

export type NavItem = {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>;
    /** Lucide icon or custom icon component (e.g. DashboardIcon). */
    icon?: Component;
    isActive?: boolean;
    /** Badge (e.g. open ticket count) shown next to the label. */
    badge?: number | string;
    /** Nested items; when set, this is a group (label only, no direct href). */
    children?: NavItem[];
    /** When true, open href in new tab (e.g. Discord invite). */
    external?: boolean;
};
