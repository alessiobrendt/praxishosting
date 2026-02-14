<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import images from '@/routes/sites/images';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ref, watch } from 'vue';

const props = defineProps<{
    open: boolean;
    url: string | null;
    siteUuid: string;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'uploaded', url: string): void;
}>();

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);
const uploading = ref(false);

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function apply() {
    const cropper = cropperRef.value;
    if (!cropper || !props.url || !props.siteUuid) return;
    const result = cropper.getResult();
    const canvas = result.canvas;
    if (!canvas) return;
    uploading.value = true;
    try {
        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, 'image/png', 0.95);
        });
        if (!blob) {
            uploading.value = false;
            return;
        }
        const fd = new FormData();
        fd.append('image', blob, 'cropped.png');
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
            emit('uploaded', data.url);
            emit('close');
        }
    } finally {
        uploading.value = false;
    }
}

watch(
    () => props.open,
    (open) => {
        if (!open) {
            cropperRef.value = null;
        }
    },
);
</script>

<template>
    <Dialog :open="open" @update:open="(v) => !v && $emit('close')">
        <DialogContent class="max-h-[90vh] max-w-3xl overflow-hidden flex flex-col">
            <DialogHeader>
                <DialogTitle>Bild bearbeiten</DialogTitle>
            </DialogHeader>
            <div v-if="url" class="cropper-container h-[400px] min-h-0 bg-muted rounded">
                <Cropper
                    ref="cropperRef"
                    :src="url"
                    class="cropper h-full w-full"
                    :stencil-props="{ aspectRatio: NaN }"
                />
            </div>
            <div class="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" @click="$emit('close')">
                    Abbrechen
                </Button>
                <Button
                    type="button"
                    :disabled="uploading"
                    @click="apply"
                >
                    {{ uploading ? 'Wird hochgeladen…' : 'Übernehmen' }}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<style scoped>
.cropper {
    --cropper-overlay-color: rgba(0, 0, 0, 0.5);
}
</style>
