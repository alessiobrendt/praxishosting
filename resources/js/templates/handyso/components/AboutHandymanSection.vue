<script setup lang="ts">
import { computed } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';
import AboutSubheading from '@/templates/handyso/components/about/AboutSubheading.vue';
import AboutHeadline from '@/templates/handyso/components/about/AboutHeadline.vue';
import AboutText from '@/templates/handyso/components/about/AboutText.vue';
import AboutImage1 from '@/templates/handyso/components/about/AboutImage1.vue';
import AboutImage2 from '@/templates/handyso/components/about/AboutImage2.vue';
import AboutBadge from '@/templates/handyso/components/about/AboutBadge.vue';
import AboutBullet from '@/templates/handyso/components/about/AboutBullet.vue';
import AboutButton from '@/templates/handyso/components/about/AboutButton.vue';

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
    <section class="bg-white py-12 lg:py-16 @lg:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 @sm:px-6">
            <div class="grid gap-8 lg:grid-cols-2 @lg:grid-cols-2 lg:gap-12 @lg:gap-12">
                <div class="relative flex flex-col gap-4">
                    <AboutImage1
                        v-if="firstChild('aboutImage1')"
                        :data="firstChild('aboutImage1')!.data ?? {}"
                        :design-mode="designMode"
                    />
                    <AboutImage2
                        v-if="firstChild('aboutImage2')"
                        :data="firstChild('aboutImage2')!.data ?? {}"
                        :design-mode="designMode"
                    />
                    <AboutBadge
                        v-if="firstChild('aboutBadge')"
                        :data="firstChild('aboutBadge')!.data ?? {}"
                        :design-mode="designMode"
                    />
                </div>
                <div class="flex flex-col justify-center">
                    <AboutSubheading
                        v-if="firstChild('aboutSubheading')"
                        :data="firstChild('aboutSubheading')!.data ?? {}"
                        :design-mode="designMode"
                    />
                    <AboutHeadline
                        v-if="firstChild('aboutHeadline')"
                        :data="firstChild('aboutHeadline')!.data ?? {}"
                        :design-mode="designMode"
                    />
                    <AboutText
                        v-if="firstChild('aboutText')"
                        :data="firstChild('aboutText')!.data ?? {}"
                        :design-mode="designMode"
                    />
                    <ul class="mt-6 space-y-3">
                        <AboutBullet
                            v-for="child in allChildren('aboutBullet')"
                            :key="child.id"
                            :data="child.data ?? {}"
                            :design-mode="designMode"
                        />
                    </ul>
                    <AboutButton
                        v-if="firstChild('aboutButton')"
                        :data="firstChild('aboutButton')!.data ?? {}"
                        :design-mode="designMode"
                    />
                </div>
            </div>
        </div>
    </section>
</template>
