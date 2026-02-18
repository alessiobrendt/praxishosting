<script setup lang="ts">
import images from '@/routes/sites/images';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import MediaLibraryLightbox from '@/templates/praxisemerald/MediaLibraryLightbox.vue';
import ImageEditorModal from '@/templates/praxisemerald/ImageEditorModal.vue';
import { ref, watch, inject } from 'vue';
import { Download, Eye, Copy, Trash2, MoreVertical, Pencil, Upload, Check } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        open: boolean;
        siteUuid: string;
        /** Apply selected image URL (from PageDesigner). Used in choose() so "Bild verwenden" always works. */
        onApplySelection?: (url: string) => void;
    }>(),
    { onApplySelection: undefined }
);

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select', url: string): void;
}>();

const onMediaLibrarySelectInject = inject<(url: string) => void>('onMediaLibrarySelect', () => {});
const onMediaLibraryClose = inject<() => void>('onMediaLibraryClose', () => {});

function applySelection(url: string): void {
    (props.onApplySelection ?? onMediaLibrarySelectInject)(url);
}

const urls = ref<string[]>([]);
const loading = ref(false);
const uploadInputRef = ref<HTMLInputElement | null>(null);
const lightboxUrl = ref<string | null>(null);
const editorUrl = ref<string | null>(null);

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function urlToPath(url: string): string {
    const m = url.match(/\/storage\/(.+)$/);
    return m ? m[1] : '';
}

async function fetchUrls() {
    if (!props.siteUuid) return;
    loading.value = true;
    try {
        const r = await fetch(images.index.url({ site: props.siteUuid }), {
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
    () => [props.open, props.siteUuid] as const,
    ([open, siteUuid]) => {
        if (open && siteUuid) fetchUrls();
        if (!open) {
            lightboxUrl.value = null;
            editorUrl.value = null;
        }
    },
    { immediate: true },
);

function triggerUpload() {
    uploadInputRef.value?.click();
}

async function onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !props.siteUuid) return;
    const fd = new FormData();
    fd.append('image', file);
    const r = await fetch(images.store.url({ site: props.siteUuid }), {
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
    console.log('[MediaLibraryModal] choose()', url?.slice(0, 60));
    applySelection(url);
    onMediaLibraryClose();
    emit('select', url);
    emit('close');
}

function openLightbox(url: string) {
    lightboxUrl.value = url;
}

function openEditor(url: string) {
    editorUrl.value = url;
}

async function downloadImage(url: string) {
    try {
        const r = await fetch(url);
        const blob = await r.blob();
        const filename = url.split('/').pop() ?? 'image.png';
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    } catch {
        // fallback: open in new tab
        window.open(url, '_blank');
    }
}

async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
}

async function deleteImage(url: string) {
    const path = urlToPath(url);
    if (!path || !props.siteUuid) return;
    const r = await fetch(images.destroy.url({ site: props.siteUuid }), {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
            Accept: 'application/json',
        },
        body: JSON.stringify({ path }),
    });
    if (r.ok) {
        urls.value = urls.value.filter((u) => u !== url);
    }
}

function onEditorUploaded(newUrl: string) {
    urls.value = [newUrl, ...urls.value];
}
</script>

<template>
    <Dialog :open="open" @update:open="(v) => !v && $emit('close')">
        <DialogContent class="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden">
            <DialogHeader>
                <DialogTitle>Media Library</DialogTitle>
                <DialogDescription class="sr-only">
                    Bilder für die Seite auswählen oder hochladen.
                </DialogDescription>
            </DialogHeader>
            <input
                ref="uploadInputRef"
                type="file"
                accept="image/*"
                class="sr-only"
                @change="onFileSelected"
            />
            <div class="flex min-h-0 flex-col gap-3 overflow-hidden">
                <Button type="button" variant="outline" size="sm" class="w-fit" @click="triggerUpload">
                    <Upload class="mr-2 h-4 w-4" />
                    Bild hochladen
                </Button>
                <div v-if="loading" class="py-4 text-sm text-muted-foreground">
                    Wird geladen…
                </div>
                <div
                    v-else
                    class="grid min-h-0 grid-cols-4 gap-3 overflow-y-auto @sm:grid-cols-5 @lg:grid-cols-6"
                >
                    <div
                        v-for="url in urls"
                        :key="url"
                        class="group relative aspect-square overflow-hidden rounded border border-input bg-muted"
                    >
                        <button
                            type="button"
                            class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity hover:opacity-90"
                            @click="openLightbox(url)"
                        >
                            <img
                                :src="url"
                                :alt="url"
                                class="h-full w-full object-cover"
                            />
                        </button>
                        <div
                            class="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
                            @click.stop
                        >
                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        class="h-8 w-8"
                                        aria-label="Optionen"
                                    >
                                        <MoreVertical class="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem @select="choose(url)">
                                        <Check class="mr-2 h-4 w-4" />
                                        Bild verwenden
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @select="openLightbox(url)">
                                        <Eye class="mr-2 h-4 w-4" />
                                        Ansehen
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @select="downloadImage(url)">
                                        <Download class="mr-2 h-4 w-4" />
                                        Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @select="copyUrl(url)">
                                        <Copy class="mr-2 h-4 w-4" />
                                        URL kopieren
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @select="openEditor(url)">
                                        <Pencil class="mr-2 h-4 w-4" />
                                        Größe ändern / Zuschneiden
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        variant="destructive"
                                        @select="deleteImage(url)"
                                    >
                                        <Trash2 class="mr-2 h-4 w-4" />
                                        Löschen
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <p v-if="!loading && urls.length === 0" class="py-4 text-sm text-muted-foreground">
                    Noch keine Bilder. Laden Sie ein Bild hoch.
                </p>
            </div>
        </DialogContent>
    </Dialog>

    <MediaLibraryLightbox
        :open="lightboxUrl !== null"
        :url="lightboxUrl"
        show-select
        :on-use-image="(u) => { choose(u); lightboxUrl = null; }"
        @close="lightboxUrl = null"
        @select="(u) => { choose(u); lightboxUrl = null; }"
    />

    <ImageEditorModal
        :open="editorUrl !== null"
        :url="editorUrl"
        :site-uuid="siteUuid"
        @close="editorUrl = null"
        @uploaded="onEditorUploaded"
    />
</template>
