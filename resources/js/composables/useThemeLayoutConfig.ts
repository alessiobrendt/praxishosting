import type { MaybeRefOrGetter } from 'vue';
import { toValue, watch, onMounted, onBeforeUnmount } from 'vue';

const STORAGE_KEY = '__THEME_CONFIG__';

export interface ThemeLayoutConfig {
    dir: 'ltr' | 'rtl';
    skin: string;
    theme: 'light' | 'dark' | 'system';
    width: 'fluid' | 'boxed';
    position: 'fixed' | 'scrollable';
    orientation: 'vertical' | 'horizontal';
    sidenavSize: string;
    sidenavUser: boolean;
    topbarColor: string;
    menuColor: string;
}

export const defaultThemeLayoutConfig: ThemeLayoutConfig = {
    dir: 'ltr',
    skin: 'default',
    theme: 'light',
    width: 'fluid',
    position: 'fixed',
    orientation: 'vertical',
    sidenavSize: 'default',
    sidenavUser: false,
    topbarColor: 'light',
    menuColor: 'dark',
};

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function loadFromStorage(): Partial<ThemeLayoutConfig> | null {
    if (typeof sessionStorage === 'undefined') return null;
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Partial<ThemeLayoutConfig>;
    } catch {
        // ignore
    }
    return null;
}

export function saveToStorage(config: Partial<ThemeLayoutConfig>): void {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
        // ignore
    }
}

export function applyThemeConfig(config: ThemeLayoutConfig): void {
    const html = document.documentElement;
    const resolvedTheme = config.theme === 'system' ? getSystemTheme() : config.theme;

    html.setAttribute('dir', config.dir);
    html.setAttribute('data-skin', config.skin);
    html.setAttribute('data-theme', resolvedTheme);
    html.setAttribute('data-topbar-color', config.topbarColor === 'default' ? 'light' : config.topbarColor);
    html.setAttribute('data-menu-color', config.menuColor === 'default' ? 'dark' : config.menuColor);
    html.setAttribute('data-layout-position', config.position);
    html.setAttribute('data-layout-width', config.width === 'boxed' ? 'boxed' : 'fluid');
    if (config.sidenavUser) {
        html.setAttribute('data-sidenav-user', 'true');
    } else {
        html.removeAttribute('data-sidenav-user');
    }
    let size = config.sidenavSize;
    if (size === 'default') size = 'on-hover-active';
    if (typeof window !== 'undefined' && window.innerWidth <= 1140) {
        size = 'offcanvas';
    }
    html.setAttribute('data-sidenav-size', size);
    if (config.orientation === 'horizontal') {
        html.setAttribute('data-layout', 'horizontal');
    } else {
        html.removeAttribute('data-layout');
    }
}

function removeThemeAttributes(): void {
    const html = document.documentElement;
    const attrs = [
        'data-skin',
        'data-theme',
        'data-topbar-color',
        'data-menu-color',
        'data-layout-position',
        'data-layout-width',
        'data-sidenav-user',
        'data-sidenav-size',
        'data-layout',
    ];
    attrs.forEach((attr) => html.removeAttribute(attr));
}

export interface UseThemeLayoutConfigOptions {
    dir?: ThemeLayoutConfig['dir'];
    skin?: string;
    theme?: ThemeLayoutConfig['theme'];
    layoutWidth?: 'full' | 'boxed';
    layoutPosition?: 'fixed' | 'scrollable';
    layout?: 'default' | 'horizontal';
    sidenavSize?: string;
    sidenavUser?: boolean;
    topbarColor?: string;
    menuColor?: string;
}

/**
 * Syncs theme layout config to document.documentElement for theme CSS (html[data-*]).
 * Merges options with sessionStorage config; saves on change when persist is true.
 * @param optionsGetter - reactive getter (e.g. () => props) or plain object
 */
export function useThemeLayoutConfig(
    optionsGetter: MaybeRefOrGetter<UseThemeLayoutConfigOptions> = () => ({}),
    persist = true,
): void {
    function getMerged(options: UseThemeLayoutConfigOptions): ThemeLayoutConfig {
        const stored = loadFromStorage();
        const fromOptions = {
            dir: options.dir,
            skin: options.skin,
            theme: options.theme,
            width: options.layoutWidth === 'boxed' ? 'boxed' : undefined,
            position: options.layoutPosition,
            orientation: options.layout === 'horizontal' ? 'horizontal' : undefined,
            sidenavSize: options.sidenavSize,
            sidenavUser: options.sidenavUser,
            topbarColor: options.topbarColor === 'default' ? undefined : options.topbarColor,
            menuColor: options.menuColor === 'default' ? undefined : options.menuColor,
        };
        return {
            ...defaultThemeLayoutConfig,
            ...fromOptions,
            ...stored,
            dir: stored?.dir ?? fromOptions.dir ?? defaultThemeLayoutConfig.dir,
            skin: stored?.skin ?? fromOptions.skin ?? defaultThemeLayoutConfig.skin,
            theme: stored?.theme ?? fromOptions.theme ?? defaultThemeLayoutConfig.theme,
            width: stored?.width ?? fromOptions.width ?? defaultThemeLayoutConfig.width,
            position: stored?.position ?? fromOptions.position ?? defaultThemeLayoutConfig.position,
            orientation: stored?.orientation ?? fromOptions.orientation ?? defaultThemeLayoutConfig.orientation,
            sidenavSize: stored?.sidenavSize ?? fromOptions.sidenavSize ?? defaultThemeLayoutConfig.sidenavSize,
            sidenavUser: stored?.sidenavUser ?? fromOptions.sidenavUser ?? defaultThemeLayoutConfig.sidenavUser,
            topbarColor: stored?.topbarColor ?? fromOptions.topbarColor ?? defaultThemeLayoutConfig.topbarColor,
            menuColor: stored?.menuColor ?? fromOptions.menuColor ?? defaultThemeLayoutConfig.menuColor,
        };
    }

    onMounted(() => {
        const options = toValue(optionsGetter);
        const merged = getMerged(options);
        applyThemeConfig(merged);
        if (persist) saveToStorage(merged);
    });

    watch(
        () => toValue(optionsGetter),
        (newOpts) => {
            const merged = getMerged(newOpts ?? {});
            applyThemeConfig(merged);
            if (persist) saveToStorage(merged);
        },
        { deep: true },
    );

    onBeforeUnmount(() => {
        removeThemeAttributes();
    });
}
