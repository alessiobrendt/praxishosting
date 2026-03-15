import { defineStore } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { toggleAttribute } from '@/utils/helpers';

export type LayoutState = {
    skin: string;
    dir: string;
    theme: string;
    orientation: string;
    topbarColor: string;
    sidenavSize: string;
    sidenavColor: string;
    sidenavUser: boolean;
    width: string;
    position: string;
};

const debounce = <T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number,
): ((...args: Parameters<T>) => void) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

const getSystemTheme = () => {
    if (window && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }
    return 'light';
};

const INIT_STATE: LayoutState = {
    skin: 'default',
    theme: 'light',
    dir: 'ltr',
    orientation: 'vertical',
    sidenavSize: 'on-hover-active',
    sidenavColor: 'dark',
    sidenavUser: false,
    topbarColor: 'light',
    width: 'fluid',
    position: 'fixed',
};

const getQueryParams = (state: LayoutState): Partial<LayoutState> => {
    if (typeof window === 'undefined') return {};
    const urlParams = new URLSearchParams(window.location.search);
    const queryParams: Partial<LayoutState> = {};

    Object.keys(state).forEach((key) => {
        const k = key as keyof LayoutState;
        const value = urlParams.get(k);
        if (value !== null) {
            if (typeof state[k] === 'boolean') {
                Object.assign(queryParams, {
                    [k]: value === 'true' || value === '1',
                });
            } else {
                Object.assign(queryParams, { [k]: value });
            }
        }
    });

    return queryParams;
};

export const useLayout = defineStore(
    'layout',
    () => {
        const layout = ref<LayoutState>(INIT_STATE);
        const isCustomizerOpen = ref<boolean>(false);
        const isMobileMenuOpen = ref<boolean>(false);

        onMounted(() => {
            const queryConfig = getQueryParams(INIT_STATE);
            layout.value = { ...layout.value, ...queryConfig };
        });

        const updateLayout = (partialSettings: Partial<LayoutState>) => {
            layout.value = {
                ...layout.value,
                ...partialSettings,
            };
        };

        const toggleCustomizer = () => {
            isCustomizerOpen.value = !isCustomizerOpen.value;
        };

        const toggleMobileMenu = () => {
            isMobileMenuOpen.value = !isMobileMenuOpen.value;
            toggleAttribute('class', isMobileMenuOpen.value ? 'sidebar-enable' : '');
        };

        const applyAttributes = () => {
            const resolvedTheme =
                layout.value.theme === 'system'
                    ? getSystemTheme()
                    : layout.value.theme;
            toggleAttribute('data-bs-theme', resolvedTheme);
            toggleAttribute('data-skin', layout.value.skin);
            toggleAttribute(
                'data-layout',
                layout.value.orientation === 'horizontal' ? 'topnav' : '',
            );
            toggleAttribute('data-topbar-color', layout.value.topbarColor);
            toggleAttribute('data-menu-color', layout.value.sidenavColor);
            toggleAttribute('data-sidenav-size', layout.value.sidenavSize);
            toggleAttribute(
                'data-sidenav-user',
                layout.value.sidenavUser ? 'true' : 'false',
            );
            toggleAttribute('data-layout-position', layout.value.position);
            toggleAttribute('data-layout-width', layout.value.width);
            toggleAttribute('dir', layout.value.dir);
        };

        watch(
            layout,
            () => {
                applyAttributes();
            },
            { deep: true },
        );

        onMounted(() => {
            applyAttributes();
        });

        const reset = () => {
            updateLayout(INIT_STATE);
        };

        const handleResize = () => {
            const width = window.innerWidth;

            if (layout.value.orientation === 'vertical') {
                if (width <= 992) {
                    updateLayout({ sidenavSize: 'offcanvas' });
                } else if (
                    width <= 1140 &&
                    layout.value.sidenavSize !== 'offcanvas'
                ) {
                    updateLayout({ sidenavSize: 'condensed' });
                } else {
                    updateLayout({ sidenavSize: INIT_STATE.sidenavSize });
                }
            } else if (layout.value.orientation === 'horizontal') {
                if (width <= 992) {
                    updateLayout({ sidenavSize: 'offcanvas' });
                } else {
                    updateLayout({ sidenavSize: 'default' });
                }
            }
        };

        onMounted(() => {
            const debouncedResize = debounce(handleResize, 200);
            window.addEventListener('resize', debouncedResize);
        });

        return {
            layout,
            updateLayout,
            isCustomizerOpen,
            toggleCustomizer,
            isMobileMenuOpen,
            toggleMobileMenu,
            reset,
        };
    },
    {
        persist: true,
    },
);
