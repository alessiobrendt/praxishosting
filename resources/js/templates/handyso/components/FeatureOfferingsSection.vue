<script setup lang="ts">
import { computed } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';
import FeatureBannerText from '@/templates/handyso/components/feature/FeatureBannerText.vue';
import FeatureCard from '@/templates/handyso/components/feature/FeatureCard.vue';

const props = withDefaults(
    defineProps<{
        entry: LayoutComponentEntry;
        designMode?: boolean;
    }>(),
    { designMode: false },
);

const children = computed((): LayoutComponentEntry[] => {
    const entry = props.entry;
    if (!entry) return [];
    const c = entry.children;
    return Array.isArray(c) ? (c as LayoutComponentEntry[]) : [];
});

function firstChild(type: string): LayoutComponentEntry | undefined {
    return children.value.find((e) => e.type === type);
}

function allChildren(type: string): LayoutComponentEntry[] {
    return children.value.filter((e) => e.type === type);
}
</script>

<template>
    <section class="py-12 lg:py-16 @lg:py-16">
        <div class="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 @sm:px-6 lg:flex-row @lg:flex-row lg:items-stretch @lg:items-stretch lg:gap-0 @lg:gap-0">
            <div
                class="flex shrink-0 items-center justify-center rounded-t-2xl bg-[#fd7f2b] px-8 py-10 lg:rounded-l-2xl @lg:rounded-l-2xl lg:rounded-tr-none @lg:rounded-tr-none lg:py-16 @lg:py-16"
            >
                <FeatureBannerText
                    v-if="firstChild('featureBannerText')"
                    :data="firstChild('featureBannerText')!.data ?? {}"
                    :design-mode="designMode"
                />
            </div>
            <div class="grid flex-1 gap-6 sm:grid-cols-3 @sm:grid-cols-3 lg:grid-cols-3 @lg:grid-cols-3">
                <FeatureCard
                    v-for="child in allChildren('featureCard')"
                    :key="child.id"
                    :data="child.data ?? {}"
                    :design-mode="designMode"
                />
            </div>
        </div>
    </section>
</template>
