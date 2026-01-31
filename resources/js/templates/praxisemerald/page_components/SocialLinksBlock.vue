<script lang="ts">
export const meta = {
    type: 'sociallinks',
    label: 'Social Links',
    placement: 'above_main' as const,
    category: 'Inhalt',
    defaultData: {
        title: '',
        platform1: 'Facebook',
        url1: '',
        platform2: 'Twitter',
        url2: '',
        platform3: 'Instagram',
        url3: '',
        platform4: 'LinkedIn',
        url4: '',
    },
    fields: [
        { key: 'title', label: 'Überschrift (optional)', type: 'text' as const },
        { key: 'platform1', label: 'Plattform 1', type: 'text' as const },
        { key: 'url1', label: 'URL 1', type: 'text' as const },
        { key: 'platform2', label: 'Plattform 2', type: 'text' as const },
        { key: 'url2', label: 'URL 2', type: 'text' as const },
        { key: 'platform3', label: 'Plattform 3', type: 'text' as const },
        { key: 'url3', label: 'URL 3', type: 'text' as const },
        { key: 'platform4', label: 'Plattform 4', type: 'text' as const },
        { key: 'url4', label: 'URL 4', type: 'text' as const },
    ],
};
</script>

<script setup lang="ts">
import { Share2, type LucideIcon } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{ data: Record<string, unknown>; designMode?: boolean }>(),
    { designMode: false },
);

const links = () => [
    { platform: props.data.platform1, url: props.data.url1 },
    { platform: props.data.platform2, url: props.data.url2 },
    { platform: props.data.platform3, url: props.data.url3 },
    { platform: props.data.platform4, url: props.data.url4 },
].filter((l) => l.url);

const iconComponent = (): LucideIcon => Share2;
</script>

<template>
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <h3 v-if="props.data.title" class="mb-3 text-lg font-semibold" style="color: var(--secondary)">
            {{ props.data.title }}
        </h3>
        <div class="flex flex-wrap gap-4">
            <a
                v-for="(link, i) in links()"
                :key="i"
                :href="designMode ? '#' : String(link.url)"
                :target="designMode ? undefined : '_blank'"
                :rel="designMode ? undefined : 'noopener noreferrer'"
                class="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                style="background-color: var(--muted); color: var(--secondary)"
                @click="designMode && $event.preventDefault()"
            >
                <Share2 class="h-4 w-4" />
                {{ link.platform }}
            </a>
        </div>
    </div>
</template>
