<script setup lang="ts">
import { computed } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';
import HeroSubheading from '@/templates/handyso/components/hero/HeroSubheading.vue';
import HeroHeadline from '@/templates/handyso/components/hero/HeroHeadline.vue';
import HeroText from '@/templates/handyso/components/hero/HeroText.vue';
import HeroButton from '@/templates/handyso/components/hero/HeroButton.vue';
import HeroReviews from '@/templates/handyso/components/hero/HeroReviews.vue';
import HeroImage from '@/templates/handyso/components/hero/HeroImage.vue';
import HeroServiceCard from '@/templates/handyso/components/hero/HeroServiceCard.vue';

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
    <section class="relative min-h-[480px] lg:min-h-[560px]">
        <div class="grid min-h-[480px] lg:min-h-[560px] lg:grid-cols-2">
            <!-- Left: dark blue + content -->
            <div class="flex flex-col justify-center bg-[#010b1a] px-6 py-12 lg:px-12 lg:py-16">
                <HeroSubheading
                    v-if="firstChild('heroSubheading')"
                    :data="firstChild('heroSubheading')!.data ?? {}"
                    :design-mode="designMode"
                />
                <HeroHeadline
                    v-if="firstChild('heroHeadline')"
                    :data="firstChild('heroHeadline')!.data ?? {}"
                    :design-mode="designMode"
                />
                <HeroText
                    v-if="firstChild('heroText')"
                    :data="firstChild('heroText')!.data ?? {}"
                    :design-mode="designMode"
                />
                <HeroButton
                    v-if="firstChild('heroButton')"
                    :data="firstChild('heroButton')!.data ?? {}"
                    :design-mode="designMode"
                />
                <HeroReviews
                    v-if="firstChild('heroReviews')"
                    :data="firstChild('heroReviews')!.data ?? {}"
                    :design-mode="designMode"
                />
            </div>
            <!-- Right: hero image + overlay grid of service cards -->
            <div class="relative min-h-[280px] bg-[#010b1a] lg:min-h-[560px]">
                <HeroImage
                    v-if="firstChild('heroImage')"
                    :data="firstChild('heroImage')!.data ?? {}"
                    :design-mode="designMode"
                />
                <div
                    class="absolute inset-0 grid grid-cols-2 gap-3 p-4 lg:gap-4 lg:p-6"
                    style="background: linear-gradient(135deg, rgba(1,11,26,0.85) 0%, rgba(1,11,26,0.6) 100%);"
                >
                    <HeroServiceCard
                        v-for="child in allChildren('heroServiceCard')"
                        :key="child.id"
                        :data="child.data ?? {}"
                        :design-mode="designMode"
                    />
                </div>
            </div>
        </div>
    </section>
</template>
