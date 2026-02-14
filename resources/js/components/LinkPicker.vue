<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { PageAnchor } from '@/composables/usePageAnchors';

export type LinkPickerPage = { slug: string; name: string };

const props = withDefaults(
    defineProps<{
        modelValue: string;
        pages: LinkPickerPage[];
        anchors?: PageAnchor[];
        getAnchorsForPage?: (slug: string) => PageAnchor[];
        getPageLabel?: (slug: string) => string;
        placeholder?: string;
    }>(),
    { anchors: () => [], placeholder: 'URL eingeben…' },
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

type Mode = 'page' | 'area' | 'custom';

function detectMode(val: string): Mode {
    if (!val || typeof val !== 'string') return 'page';
    const v = val.trim();
    if (v.includes('#')) return 'area';
    if (v.startsWith('/') || v === '') return 'page';
    return 'custom';
}

function parseHref(val: string): { pageSlug: string; anchor: string } {
    const v = (val || '').trim();
    const hashIdx = v.indexOf('#');
    if (hashIdx >= 0) {
        const path = v.slice(0, hashIdx) || '/';
        const slug = path === '/' ? 'index' : path.replace(/^\//, '');
        return { pageSlug: slug, anchor: v.slice(hashIdx + 1) || '' };
    }
    const slug = v === '/' || !v ? 'index' : v.replace(/^\//, '');
    return { pageSlug: slug, anchor: '' };
}

const initial = parseHref(props.modelValue);
const initialMode = detectMode(props.modelValue);

const mode = ref<Mode>(initialMode);
const selectedPageSlug = ref<string>(initial.pageSlug || 'index');
const selectedAnchor = ref<string>(initial.anchor);
const customUrl = ref<string>(initialMode === 'custom' ? props.modelValue : '');

const pageOptions = computed(() => {
    const list = props.pages;
    const opts =
        list.length > 0
            ? list.map((p) => ({
                  value: p.slug,
                  label: props.getPageLabel?.(p.slug) ?? p.name,
              }))
            : [{ value: 'index', label: 'Startseite' }];
    const slugs = new Set(opts.map((o) => o.value));
    if (selectedPageSlug.value && !slugs.has(selectedPageSlug.value)) {
        opts.push({
            value: selectedPageSlug.value,
            label: props.getPageLabel?.(selectedPageSlug.value) ?? selectedPageSlug.value,
        });
    }
    return opts;
});

const anchorsForSelectedPage = computed(() => {
    const slug = selectedPageSlug.value || 'index';
    if (props.getAnchorsForPage) {
        return props.getAnchorsForPage(slug) ?? [];
    }
    return props.anchors ?? [];
});

const anchorOptions = computed(() => anchorsForSelectedPage.value);

function pageToHref(slug: string): string {
    return slug === 'index' ? '/' : `/${slug}`;
}

function emitValue(): void {
    if (mode.value === 'page') {
        emit('update:modelValue', pageToHref(selectedPageSlug.value || 'index'));
    } else if (mode.value === 'area') {
        const pagePath = pageToHref(selectedPageSlug.value || 'index');
        const anchor = selectedAnchor.value?.trim();
        emit('update:modelValue', anchor ? `${pagePath}#${anchor}` : pagePath);
    } else {
        emit('update:modelValue', customUrl.value?.trim() ?? '');
    }
}

watch(
    [mode, selectedPageSlug, selectedAnchor, customUrl],
    () => emitValue(),
    { deep: true },
);

watch(
    () => props.modelValue,
    (val) => {
        const m = detectMode(val);
        const { pageSlug, anchor } = parseHref(val);
        mode.value = m;
        selectedPageSlug.value = pageSlug || 'index';
        selectedAnchor.value = anchor;
        if (m === 'custom') customUrl.value = val ?? '';
    },
);

const effectivePageSelectValue = computed(() => selectedPageSlug.value);

function setToPage() {
    mode.value = 'page';
}

function onPageSelectChange(v: string) {
    if (v === '__area__') {
        mode.value = 'area';
        selectedPageSlug.value = 'index';
    } else if (v === '__custom__') {
        mode.value = 'custom';
        customUrl.value = '';
    } else {
        selectedPageSlug.value = v || 'index';
    }
}
</script>

<template>
    <div class="space-y-1.5">
        <Select
            v-if="mode === 'page'"
            :model-value="effectivePageSelectValue"
            class="h-9 w-full text-sm"
            @update:model-value="onPageSelectChange"
        >
            <option
                v-for="opt in pageOptions"
                :key="opt.value"
                :value="opt.value"
            >
                {{ opt.label }}
            </option>
            <option value="__area__">— Bereich auf Seite —</option>
            <option value="__custom__">— Externe URL —</option>
        </Select>
        <template v-else-if="mode === 'area'">
            <div class="flex gap-1.5">
                <Select
                    :model-value="selectedPageSlug"
                    class="h-9 min-w-0 flex-1 text-sm"
                    @update:model-value="(v) => { selectedPageSlug.value = (v as string) ?? 'index'; }"
                >
                    <option
                        v-for="opt in pageOptions"
                        :key="opt.value"
                        :value="opt.value"
                    >
                        {{ opt.label }}
                    </option>
                </Select>
                <Select
                    :model-value="selectedAnchor"
                    class="h-9 min-w-0 flex-1 text-sm"
                    @update:model-value="(v) => (selectedAnchor.value = (v as string) ?? '')"
                >
                    <option value="">Bereich</option>
                    <option
                        v-for="a in anchorOptions"
                        :key="a.value"
                        :value="a.value"
                    >
                        {{ a.label }}
                    </option>
                </Select>
            </div>
            <button
                type="button"
                class="text-muted-foreground hover:text-foreground text-xs underline"
                @click="setToPage"
            >
                Zurück zu Seite
            </button>
        </template>
        <template v-else>
            <Input
                v-model="customUrl"
                :placeholder="placeholder"
                class="h-9 w-full text-sm"
            />
            <button
                type="button"
                class="text-muted-foreground hover:text-foreground text-xs underline"
                @click="setToPage"
            >
                Zurück zu Seite
            </button>
        </template>
    </div>
</template>
