<script setup lang="ts">
import { computed } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';
import HowWeWorkSubheading from '@/templates/handyso/components/how-we-work/HowWeWorkSubheading.vue';
import HowWeWorkHeadline from '@/templates/handyso/components/how-we-work/HowWeWorkHeadline.vue';
import HowWeWorkText from '@/templates/handyso/components/how-we-work/HowWeWorkText.vue';
import HowWeWorkStep from '@/templates/handyso/components/how-we-work/HowWeWorkStep.vue';

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

const stepChildren = computed(() => allChildren('howWeWorkStep'));
</script>

<template>
    <section class="bg-white py-12 lg:py-16 @lg:py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 @sm:px-6">
            <HowWeWorkSubheading
                v-if="firstChild('howWeWorkSubheading')"
                :data="firstChild('howWeWorkSubheading')!.data ?? {}"
                :design-mode="designMode"
            />
            <HowWeWorkHeadline
                v-if="firstChild('howWeWorkHeadline')"
                :data="firstChild('howWeWorkHeadline')!.data ?? {}"
                :design-mode="designMode"
            />
            <HowWeWorkText
                v-if="firstChild('howWeWorkText')"
                :data="firstChild('howWeWorkText')!.data ?? {}"
                :design-mode="designMode"
            />
            <div class="mt-10 flex flex-wrap items-stretch gap-6 lg:gap-4 @lg:gap-4">
                <HowWeWorkStep
                    v-for="(child, i) in stepChildren"
                    :key="child.id"
                    :data="child.data ?? {}"
                    :design-mode="designMode"
                    :show-arrow="i < stepChildren.length - 1"
                />
            </div>
        </div>
    </section>
</template>
