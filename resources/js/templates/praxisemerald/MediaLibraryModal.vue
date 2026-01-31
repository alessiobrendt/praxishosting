<script setup lang="ts">
import images from '@/routes/sites/images';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ref, watch } from 'vue';
import { Upload } from 'lucide-vue-next';

const props = defineProps<{
    open: boolean;
    siteId: number;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select', url: string): void;
}>();

const urls = ref<string[]>([]);
const loading = ref(false);
const uploadInputRef = ref<HTMLInputElement | null>(null);

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function fetchUrls() {
    if (!props.siteId) return;
    loading.value = true;
    try {
        const r = await fetch(images.index.url({ site: props.siteId }), {
            credentials: 'same-origin',
            headers: { Accept: 'application/json' },
        });
        const data = (await r.json()) as { urls?: string[] };
        urls.value = data.urls ?? [];
    } finally {
        loading.value = false;
    }
}

watch(
    () => [props.open, props.siteId] as const,
    ([open, siteId]) => {
        if (open && siteId) fetchUrls();
    },
    { immediate: true },
);

function triggerUpload() {
    uploadInputRef.value?.click();
}

async function onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !props.siteId) return;
    const fd = new FormData();
    fd.append('image', file);
    const r = await fetch(images.store.url({ site: props.siteId }), {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
        headers: {
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
        },
    });
    const data = (await r.json()) as { url?: string };
    if (data.url) {
        urls.value = [data.url, ...urls.value];
    }
    if (uploadInputRef.value) uploadInputRef.value.value = '';
}

function choose(url: string) {
    emit('select', url);
    emit('close');
}
</script>

<template>
    <Dialog :open="open" @update:open="(v) => !v && $emit('close')">
        <DialogContent class="max-h-[80vh] max-w-2xl overflow-hidden flex flex-col">
            <DialogHeader>
                <DialogTitle>Media Library</DialogTitle>
            </DialogHeader>
            <input
                ref="uploadInputRef"
                type="file"
                accept="image/*"
                class="sr-only"
                @change="onFileSelected"
            />
            <div class="flex flex-col gap-3 overflow-hidden min-h-0">
                <Button type="button" variant="outline" size="sm" class="w-fit" @click="triggerUpload">
                    <Upload class="mr-2 h-4 w-4" />
                    Bild hochladen
                </Button>
                <div v-if="loading" class="text-muted-foreground text-sm py-4">
                    Wird geladen…
                </div>
                <div
                    v-else
                    class="grid grid-cols-3 sm:grid-cols-4 gap-2 overflow-y-auto min-h-0"
                >
                    <button
                        v-for="url in urls"
                        :key="url"
                        type="button"
                        class="aspect-square rounded border border-input overflow-hidden bg-muted hover:ring-2 hover:ring-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        @click="choose(url)"
                    >
                        <img
                            :src="url"
                            :alt="url"
                            class="h-full w-full object-cover"
                        />
                    </button>
                </div>
                <p v-if="!loading && urls.length === 0" class="text-muted-foreground text-sm py-4">
                    Noch keine Bilder. Laden Sie ein Bild hoch.
                </p>
            </div>
        </DialogContent>
    </Dialog>
</template>
