export type VariantType =
    | 'primary'
    | 'danger'
    | 'warning'
    | 'success'
    | 'info'
    | 'dark'
    | 'secondary'
    | 'purple'
    | 'light';

export type MenuItemType = {
    slug: string;
    label: string;
    isTitle?: boolean;
    icon?: string;
    url?: string;
    badge?: {
        className: string;
        text: string;
    };
    target?: string;
    isDisabled?: boolean;
    isSpecial?: boolean;
    children?: MenuItemType[];
};
