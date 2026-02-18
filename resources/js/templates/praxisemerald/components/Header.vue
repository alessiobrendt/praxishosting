<script setup lang="ts">
import { computed, inject } from 'vue';
import { usePage } from '@inertiajs/vue3';
import Button from '@/templates/praxisemerald/components/ui/Button.vue';
import MobileNav from '@/templates/praxisemerald/components/MobileNav.vue';
import type { HeaderComponentData, NavLink } from '@/types/layout-components';
import type { Ref } from 'vue';

const props = withDefaults(
    defineProps<{
        data: Partial<HeaderComponentData>;
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

const links = computed<NavLink[]>(() => props.data.links ?? []);
const logoUrl = computed(() => props.data.logoUrl ?? '/images/logo.png');
const logoAlt = computed(() => props.data.logoAlt ?? 'Logo');
const siteName = computed(() => props.data.siteName ?? '');
const ctaButtonText = computed(() => props.data.ctaButtonText ?? 'Termin vereinbaren');
const ctaButtonHref = computed(() => props.data.ctaButtonHref ?? '');

function isActive(href: string): boolean {
    if (href === '/') return baseUrl.value === '/' || baseUrl.value === '';
    return baseUrl.value.startsWith(href);
}
</script>

<template>
  <div class="pb-16">
    <header
        class="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
        :class="isDesignMode ? 'relative z-0' : 'fixed inset-x-0 top-0 z-50'"
    >
        <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 @sm:px-6">
            <a
                :href="isDesignMode ? '#' : '/'"
                class="flex items-center gap-2"
                aria-label="Zur Startseite"
                @click="isDesignMode && $event.preventDefault()"
            >
                <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <img
                        :src="logoUrl"
                        :alt="logoAlt"
                        class="h-5 w-5 object-cover"
                        width="32"
                        height="32"
                        loading="lazy"
                    />
                </span>
                <span class="font-semibold">{{ siteName }}</span>
            </a>
            <div aria-label="Hauptnavigation" class="hidden lg:block @lg:block">
                <ul class="flex items-center gap-4">
                    <li v-for="link in links" :key="link.href">
                        <a
                            :href="isDesignMode ? '#' : link.href"
                            :class="{
                                'text-primary': isActive(link.href),
                                'text-slate-700': !isActive(link.href),
                            }"
                            class="rounded px-2 py-1 text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            @click="isDesignMode && $event.preventDefault()"
                        >
                            {{ link.label }}
                        </a>
                    </li>
                </ul>
            </div>
            <div class="flex items-center gap-4">
                <Button v-if="ctaButtonText" variant="default" size="sm" class="hidden sm:inline-flex @sm:inline-flex">
                    <a
                        :href="isDesignMode ? '#' : ctaButtonHref"
                        @click="isDesignMode && $event.preventDefault()"
                    >{{ ctaButtonText }}</a>
                </Button>
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
  </div>
</template>
