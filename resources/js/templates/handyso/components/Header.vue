<script setup lang="ts">
import { computed, inject } from 'vue';
import { usePage } from '@inertiajs/vue3';
import MobileNav from '@/templates/handyso/components/MobileNav.vue';
import type { Ref } from 'vue';

interface NavLink {
    href: string;
    label: string;
}

const props = withDefaults(
    defineProps<{
        data: Record<string, unknown>;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const injectedDesignMode = inject<Ref<boolean> | boolean>('designMode', false);
const isDesignMode = computed(
    () =>
        props.designMode ??
        (typeof injectedDesignMode === 'boolean' ? injectedDesignMode : injectedDesignMode?.value) ??
        false,
);

const page = usePage();
const baseUrl = computed(() => {
    const url = (page.url ?? '').replace(/\/$/, '') || '/';
    return url;
});

const links = computed<NavLink[]>(() => (props.data.links as NavLink[]) ?? []);
const logoUrl = computed(() => (props.data.logoUrl as string) ?? '/images/handyso/logo.png');
const logoAlt = computed(() => (props.data.logoAlt as string) ?? 'Logo');
const siteName = computed(() => (props.data.siteName as string) ?? 'HANDYSO');
const ctaButtonText = computed(() => (props.data.ctaButtonText as string) ?? 'Get Started');
const ctaButtonHref = computed(() => (props.data.ctaButtonHref as string) ?? '#');

function isActive(href: string): boolean {
    if (href === '/') return baseUrl.value === '/' || baseUrl.value === '';
    return baseUrl.value.startsWith(href);
}
</script>

<template>
    <header
        class="border-b border-gray-200 bg-white"
        :class="isDesignMode ? 'relative z-0' : 'sticky top-0 z-50'"
    >
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 @sm:px-6">
            <a
                :href="isDesignMode ? '#' : '/'"
                class="flex items-center gap-2"
                aria-label="Zur Startseite"
                @click="isDesignMode && $event.preventDefault()"
            >
                <span class="flex h-9 w-9 items-center justify-center">
                    <img
                        v-if="logoUrl"
                        :src="logoUrl"
                        :alt="logoAlt"
                        class="h-8 w-8 object-contain"
                        width="32"
                        height="32"
                        loading="lazy"
                    />
                    <span v-else class="text-xl font-bold text-[#fd7f2b]">H</span>
                </span>
                <span class="text-xl font-bold tracking-tight text-gray-900">{{ siteName }}</span>
                <span class="h-2 w-2 rounded-full bg-[#fd7f2b]" />
            </a>
            <nav aria-label="Hauptnavigation" class="hidden items-center gap-8 lg:flex @lg:flex">
                <a
                    v-for="link in links"
                    :key="link.href"
                    :href="isDesignMode ? '#' : link.href"
                    class="text-sm font-medium transition-colors hover:text-[#fd7f2b]"
                    :class="isActive(link.href) ? 'text-[#fd7f2b]' : 'text-gray-700'"
                    @click="isDesignMode && $event.preventDefault()"
                >
                    {{ link.label }}
                </a>
            </nav>
            <div class="flex items-center gap-4">
                <a
                    v-if="ctaButtonText"
                    :href="isDesignMode ? '#' : ctaButtonHref"
                    class="hidden rounded bg-[#fd7f2b] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#e67220] sm:inline-block @sm:inline-block"
                    @click="isDesignMode && $event.preventDefault()"
                >
                    {{ ctaButtonText }}
                </a>
                <MobileNav
                    :links="links"
                    :site-name="siteName"
                    :logo-url="logoUrl"
                    :logo-alt="logoAlt"
                    :cta-button-text="ctaButtonText"
                    :cta-button-href="ctaButtonHref"
                    :design-mode="isDesignMode"
                />
            </div>
        </div>
    </header>
</template>
