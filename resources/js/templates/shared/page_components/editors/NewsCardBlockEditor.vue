<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LinkPicker from '@/components/LinkPicker.vue';
import { usePageAnchors } from '@/composables/usePageAnchors';
import type { LayoutComponentEntry } from '@/types/layout-components';
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

const openMediaLibrary = inject<((callback: (url: string) => void) => void) | null>('openMediaLibrary', null);

function ensureItems(entry: Record<string, unknown>): { title: string; date: string; excerpt: string; image: string; href: string }[] {
    if (!Array.isArray(entry.items)) entry.items = [];
    return entry.items as { title: string; date: string; excerpt: string; image: string; href: string }[];
}

function addItem() {
    ensureItems(props.entry.data as Record<string, unknown>).push({
        title: '',
        date: '',
        excerpt: '',
        image: '',
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
            <Label>Einträge</Label>
            <Button type="button" variant="ghost" size="sm" class="h-7 text-xs" @click="addItem">
                <Plus class="mr-1 h-3 w-3" />
                Eintrag
            </Button>
        </div>
        <div class="space-y-3">
            <div
                v-for="(item, i) in ensureItems(entry.data as Record<string, unknown>)"
                :key="i"
                class="space-y-2 rounded border p-2"
            >
                <div class="flex justify-between">
                    <span class="text-xs font-medium">Eintrag {{ i + 1 }}</span>
                    <Button type="button" variant="ghost" size="icon" class="h-7 w-7 shrink-0" @click="removeItem(i)">
                        <Trash2 class="h-3.5 w-3.5 text-destructive" />
                    </Button>
                </div>
                <div class="space-y-2">
                    <Label>Titel</Label>
                    <Input v-model="item.title" placeholder="Titel" class="w-full" />
                    <Label>Datum</Label>
                    <Input v-model="item.date" placeholder="YYYY-MM-DD" type="date" class="w-full" />
                    <Label>Kurzbeschreibung</Label>
                    <textarea
                        v-model="item.excerpt"
                        placeholder="Excerpt"
                        class="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        rows="2"
                    />
                    <Label>Bild-URL</Label>
                    <div class="flex gap-2">
                        <Input v-model="item.image" placeholder="URL" class="min-w-0 flex-1" />
                        <Button
                            v-if="openMediaLibrary"
                            type="button"
                            variant="outline"
                            size="sm"
                            title="Aus Media Library"
                            @click="openMediaLibrary((url) => (item.image = url))"
                        >
                            Bild
                        </Button>
                    </div>
                    <Label>Link</Label>
                    <LinkPicker
                        v-if="designer"
                        :model-value="String(item.href ?? '')"
                        :pages="linkPickerPages"
                        :anchors="linkPickerAnchors"
                        :get-anchors-for-page="getAnchorsForPage"
                        :get-page-label="designer?.getPageLabel"
                        placeholder="URL"
                        @update:model-value="(v) => (item.href = v)"
                    />
                    <Input v-else v-model="item.href" placeholder="URL" class="w-full" />
                </div>
            </div>
        </div>
    </div>
</template>
