import type { InertiaLinkProps } from '@inertiajs/vue3';
import type { LucideIcon } from 'lucide-vue-next';

export type BreadcrumbItem = {
    title: string;
    href?: string;
};

export type NavItem = {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon;
    isActive?: boolean;
    /** Badge (e.g. open ticket count) shown next to the label. */
    badge?: number | string;
    /** Nested items; when set, this is a group (label only, no direct href). */
    children?: NavItem[];
};
