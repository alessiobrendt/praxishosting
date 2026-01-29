<script setup lang="ts">
import { computed } from 'vue';
import { getLayoutComponent, getPlacementForType } from '@/templates/praxisemerald/component-map';
import type { LayoutComponentEntry } from '@/types/layout-components';

const props = withDefaults(
    defineProps<{
        pageData: Record<string, unknown>;
        colors: Record<string, string>;
        generalInformation?: Record<string, unknown>;
        site: { id: number; name: string; slug: string };
    }>(),
    { generalInformation: () => ({}) },
);

const layoutComponents = computed((): LayoutComponentEntry[] => {
    const raw = props.pageData?.layout_components;
    if (!Array.isArray(raw)) return [];
    return raw.filter(
        (e): e is LayoutComponentEntry =>
            e && typeof e === 'object' && typeof (e as LayoutComponentEntry).type === 'string' && typeof (e as LayoutComponentEntry).id === 'string',
    );
});

const aboveMain = computed(() =>
    layoutComponents.value.filter((e) => getPlacementForType(e.type) === 'above_main'),
);
const belowMain = computed(() =>
    layoutComponents.value.filter((e) => getPlacementForType(e.type) === 'below_main'),
);
</script>

<template>
    <div class="flex min-h-screen flex-col">
        <div class="pb-12">
            <template v-for="entry in aboveMain" :key="entry.id">
                <component
                    :is="getLayoutComponent(entry.type)"
                    v-if="getLayoutComponent(entry.type)"
                    :data="entry.data ?? {}"
                />
            </template>
        </div>
        <main class="flex-1 p-4">
            <slot />
        </main>
        <template v-for="entry in belowMain" :key="entry.id">
            <component
                :is="getLayoutComponent(entry.type)"
                v-if="getLayoutComponent(entry.type)"
                :data="entry.data ?? {}"
            />
        </template>
    </div>
</template>
