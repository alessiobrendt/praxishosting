<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
import { Check } from 'lucide-vue-next';

const props = withDefaults(
    defineProps<{
        open: boolean;
        url: string | null;
        showSelect?: boolean;
        /** Fallback when not inside PageDesigner (no inject). */
        onUseImage?: (url: string) => void;
    }>(),
    { onUseImage: undefined }
);

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select', url: string): void;
}>();

/** From PageDesigner – apply selection directly so it works even when Dialog closes on "outside" click. */
const applyMediaSelection = inject<((url: string) => void) | undefined>('onMediaLibrarySelect');

function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') emit('close');
}

function selectImage(e?: Event) {
    e?.preventDefault();
    e?.stopPropagation();
    const url = props.url;
    const hasInject = typeof applyMediaSelection === 'function';
    const hasProp = typeof props.onUseImage === 'function';
    console.log('[MediaLibraryLightbox] selectImage', {
        url: url?.slice(0, 60),
        hasInject,
        hasProp,
        willCall: hasInject || hasProp,
    });
    if (!url) return;
    const apply = applyMediaSelection ?? props.onUseImage;
    if (apply) {
        console.log('[MediaLibraryLightbox] calling apply(url)');
        apply(url);
    } else {
        console.warn('[MediaLibraryLightbox] no apply function (inject nor prop)');
    }
    emit('select', url);
    emit('close');
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open && url"
            class="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Bildvorschau"
            @click.self="emit('close')"
        >
            <img
                :src="url"
                alt="Vorschau"
                class="max-h-[75vh] max-w-[90vw] object-contain"
                @click.stop
            />
            <div v-if="showSelect" class="flex gap-2" @click.stop>
                <button
                    type="button"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    @click="selectImage($event)"
                >
                    <Check class="h-4 w-4" />
                    Bild verwenden
                </button>
                <button
                    type="button"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-8 text-sm font-medium shadow hover:bg-accent"
                    @click="emit('close')"
                >
                    Schließen
                </button>
            </div>
        </div>
    </Teleport>
</template>
