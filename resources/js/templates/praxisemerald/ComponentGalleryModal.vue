<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLayoutComponent as defaultGetLayoutComponent } from '@/templates/praxisemerald/component-map';
import type { Component } from 'vue';
import type { LayoutComponentType } from '@/types/layout-components';

const PREVIEW_SCALE = 0.28;
const PREVIEW_VIEW_WIDTH = 280;
const PREVIEW_VIEW_HEIGHT = 140;

/** Reihenfolge der Kategorien in der Galerie. */
const CATEGORY_ORDER = [
    'Module',
    'Navigation & Layout',
    'Container',
    'Bereiche',
    'Inhalt',
    'Sonstiges',
] as const;

const searchQuery = ref('');

type ComponentRegistryEntry = {
    type: string;
    label: string;
    placement: string;
    defaultData: Record<string, unknown>;
    acceptsChildren?: boolean;
    category?: string;
};

const props = withDefaults(
    defineProps<{
        open: boolean;
        components: ComponentRegistryEntry[];
        getComponentLabel: (type: string) => string;
        /** When provided (e.g. from template registry), use for previews instead of default praxisemerald map. */
        getLayoutComponent?: (type: string) => Component | undefined;
    }>(),
    { getLayoutComponent: undefined },
);

function getLayoutComponent(type: string): Component | undefined {
    return props.getLayoutComponent ? props.getLayoutComponent(type) : defaultGetLayoutComponent(type);
}

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select', type: string): void;
}>();

const filteredComponents = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return props.components;
    return props.components.filter(
        (reg) =>
            (reg.label ?? '').toLowerCase().includes(q) ||
            (reg.type ?? '').toLowerCase().includes(q),
    );
});

const componentsByCategory = computed(() => {
    const map = new Map<string, ComponentRegistryEntry[]>();
    for (const reg of filteredComponents.value) {
        const cat = reg.category ?? 'Sonstiges';
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat)!.push(reg);
    }
    const result: { category: string; components: ComponentRegistryEntry[] }[] = [];
    for (const cat of CATEGORY_ORDER) {
        const list = map.get(cat);
        if (list?.length) result.push({ category: cat, components: list });
    }
    for (const [cat, list] of map) {
        if (!CATEGORY_ORDER.includes(cat as (typeof CATEGORY_ORDER)[number])) {
            result.push({ category: cat, components: list });
        }
    }
    return result;
});

const defaultTab = computed(() => componentsByCategory.value[0]?.category ?? '');

function getPreviewStyle() {
    const w = Math.ceil(PREVIEW_VIEW_WIDTH / PREVIEW_SCALE);
    const h = Math.ceil(PREVIEW_VIEW_HEIGHT / PREVIEW_SCALE);
    return {
        width: `${w}px`,
        minHeight: `${h}px`,
        transform: `scale(${PREVIEW_SCALE})`,
        transformOrigin: 'top left',
    };
}

function onSelect(type: LayoutComponentType | string) {
    emit('select', type);
    emit('close');
}
</script>

<template>
    <Dialog :open="open" @update:open="(v) => !v && $emit('close')">
        <DialogContent class="flex !h-[85vh] !w-[85vw] !max-w-[85vw] flex-col overflow-hidden">
            <DialogHeader class="shrink-0">
                <DialogTitle>Komponenten-Galerie</DialogTitle>
                <p class="text-sm text-muted-foreground">
                    Klicken Sie auf eine Komponente, um sie zur Seite hinzuzufügen.
                </p>
            </DialogHeader>
            <div class="shrink-0 px-1 pb-2">
                <Input
                    v-model="searchQuery"
                    type="search"
                    placeholder="Komponenten suchen…"
                    class="w-full"
                    autocomplete="off"
                />
            </div>
            <Tabs v-if="componentsByCategory.length" :default-tab="defaultTab" class="flex min-h-0 flex-1 flex-col overflow-hidden">
                <TabsList class="mb-3 shrink-0 w-full justify-start overflow-x-auto">
                    <TabsTrigger
                        v-for="section in componentsByCategory"
                        :key="section.category"
                        :value="section.category"
                    >
                        {{ section.category }}
                    </TabsTrigger>
                </TabsList>
                <div class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2">
                    <TabsContent
                        v-for="section in componentsByCategory"
                        :key="section.category"
                        :value="section.category"
                        class="mt-0"
                    >
                        <div class="grid gap-4 sm:grid-cols-2 @sm:grid-cols-2 md:grid-cols-3 @md:grid-cols-3 lg:grid-cols-4 @lg:grid-cols-4">
                            <button
                                v-for="reg in section.components"
                                :key="reg.type"
                                type="button"
                                class="flex flex-col overflow-hidden rounded-lg border bg-card text-left shadow-sm transition-colors hover:bg-muted/50 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                @click="onSelect(reg.type as LayoutComponentType)"
                            >
                                <div
                                    class="relative w-full overflow-hidden rounded-t-lg border-b bg-muted/20"
                                    :style="{ height: `${PREVIEW_VIEW_HEIGHT}px` }"
                                >
                                    <div
                                        v-if="getLayoutComponent(reg.type as string)"
                                        class="absolute left-0 top-0 bg-white"
                                        :style="getPreviewStyle()"
                                    >
                                        <component
                                            :is="getLayoutComponent(reg.type as string)!"
                                            :data="reg.defaultData"
                                            :design-mode="true"
                                        />
                                    </div>
                                    <div
                                        v-else
                                        class="flex h-full items-center justify-center text-muted-foreground text-xs"
                                    >
                                        Keine Vorschau
                                    </div>
                                </div>
                                <div class="flex flex-col gap-0.5 p-3">
                                    <span class="font-medium">{{ getComponentLabel(reg.type) }}</span>
                                    <p v-if="reg.acceptsChildren" class="text-xs text-muted-foreground">
                                        Kann weitere Blöcke enthalten
                                    </p>
                                </div>
                            </button>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
            <p v-else class="py-4 text-sm text-muted-foreground">
                Keine Komponenten verfügbar.
            </p>
        </DialogContent>
    </Dialog>
</template>
