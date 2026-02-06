<script setup lang="ts">
import { computed } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';
import WhyChooseUsSubheading from '@/templates/handyso/components/why-choose-us/WhyChooseUsSubheading.vue';
import WhyChooseUsHeadline from '@/templates/handyso/components/why-choose-us/WhyChooseUsHeadline.vue';
import WhyChooseUsBenefit from '@/templates/handyso/components/why-choose-us/WhyChooseUsBenefit.vue';

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
    <section class="relative overflow-hidden bg-gray-100 py-12 lg:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
            <WhyChooseUsSubheading
                v-if="firstChild('whyChooseUsSubheading')"
                :data="firstChild('whyChooseUsSubheading')!.data ?? {}"
                :design-mode="designMode"
            />
            <WhyChooseUsHeadline
                v-if="firstChild('whyChooseUsHeadline')"
                :data="firstChild('whyChooseUsHeadline')!.data ?? {}"
                :design-mode="designMode"
            />
            <div class="mt-8 grid gap-6 sm:grid-cols-2">
                <WhyChooseUsBenefit
                    v-for="child in allChildren('whyChooseUsBenefit')"
                    :key="child.id"
                    :data="child.data ?? {}"
                    :design-mode="designMode"
                />
            </div>
        </div>
        <div
            class="absolute left-0 top-1/2 hidden -translate-y-1/2 opacity-10 lg:block"
            aria-hidden
        >
            <div class="h-48 w-32 rounded bg-[#fd7f2b]" />
        </div>
    </section>
</template>
