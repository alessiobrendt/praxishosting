<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LinkPicker from '@/components/LinkPicker.vue';
import { usePageAnchors } from '@/composables/usePageAnchors';
import type { LayoutComponentEntry } from '@/types/layout-components';
import IconPicker from '@/templates/shared/components/IconPicker.vue';
import { Plus, Trash2 } from 'lucide-vue-next';
import { computed, inject } from 'vue';

const designer = inject<{
    getPageLabel: (slug: string) => string;
    sitePagesList: { slug: string; name: string }[];
    templatePagesList: { slug: string; name: string }[];
    isTemplateMode: boolean;
    layoutComponents: LayoutComponentEntry[];
    getLayoutForPage: (slug: string) => LayoutComponentEntry[];
} | null>('designer', null);

const linkPickerPages = computed(
    () =>
        designer?.isTemplateMode
            ? (designer.templatePagesList ?? []).map((p) => ({ slug: p.slug, name: p.name }))
            : (designer?.sitePagesList ?? []).map((p) => ({ slug: p.slug, name: p.name })),
);
const linkPickerAnchors = computed(() => usePageAnchors(designer?.layoutComponents ?? []));
function getAnchorsForPage(slug: string) {
    return usePageAnchors(designer?.getLayoutForPage?.(slug) ?? []);
}

const props = defineProps<{
    entry: LayoutComponentEntry;
    site: { id: number; name: string; slug: string };
}>();

function ensureItems(entry: Record<string, unknown>): { title: string; icon: string; highlight: string; desc: string; href: string }[] {
    if (!Array.isArray(entry.items)) entry.items = [];
    return entry.items as { title: string; icon: string; highlight: string; desc: string; href: string }[];
}

function addItem() {
    ensureItems(props.entry.data as Record<string, unknown>).push({
        title: '',
        icon: 'Phone',
        highlight: '',
        desc: '',
        href: '',
    });
}

function removeItem(i: number) {
    ensureItems(props.entry.data as Record<string, unknown>).splice(i, 1);
}
</script>

<template>
    <div class="space-y-3">
        <div class="flex items-center justify-between">
            <Label>Notfall-Karten</Label>
            <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addItem">
                <Plus class="mr-1 h-3 w-3" />
                Karte
            </Button>
        </div>
        <div class="space-y-3">
            <div
                v-for="(item, i) in ensureItems(entry.data as Record<string, unknown>)"
                :key="i"
                class="space-y-2 rounded border p-2"
            >
                <div class="flex justify-between">
                    <span class="text-xs font-medium">Karte {{ i + 1 }}</span>
                    <Button type="button" variant="ghost" size="icon" class="h-7 w-7 shrink-0" @click="removeItem(i)">
                        <Trash2 class="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
                <Label>Titel</Label>
                <Input v-model="item.title" placeholder="z. B. Rettungsdienst" class="w-full" />
                <Label>Icon</Label>
                <IconPicker :model-value="item.icon" @update:model-value="(v) => (item.icon = v)" />
                <Label>Highlight (z. B. 112)</Label>
                <Input v-model="item.highlight" placeholder="112" class="w-full" />
                <Label>Beschreibung</Label>
                <textarea
                    v-model="item.desc"
                    placeholder="Beschreibung"
                    class="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows="2"
                />
                <Label>Link (z. B. tel:112)</Label>
                <LinkPicker
                    v-if="designer"
                    :model-value="String(item.href ?? '')"
                    :pages="linkPickerPages"
                    :anchors="linkPickerAnchors"
                    :get-anchors-for-page="getAnchorsForPage"
                    :get-page-label="designer?.getPageLabel"
                    placeholder="tel:112 oder URL"
                    @update:model-value="(v) => (item.href = v)"
                />
                <Input v-else v-model="item.href" placeholder="tel:112" class="w-full" />
            </div>
        </div>
    </div>
</template>
