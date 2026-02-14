<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { onMounted, onUnmounted } from 'vue';
import { Check } from 'lucide-vue-next';

const props = defineProps<{
    open: boolean;
    url: string | null;
    showSelect?: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'select', url: string): void;
}>();

function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') emit('close');
}

function selectImage() {
    if (props.url) {
        emit('select', props.url);
        emit('close');
    }
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
            class="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/90 p-4"
            role="button"
            tabindex="-1"
            @click.self="emit('close')"
        >
            <img
                :src="url"
                alt="Vorschau"
                class="max-h-[75vh] max-w-[90vw] object-contain"
                @click.stop
            />
            <div v-if="showSelect" class="flex gap-2" @click.stop>
                <Button type="button" size="lg" @click="selectImage">
                    <Check class="mr-2 h-4 w-4" />
                    Bild verwenden
                </Button>
                <Button type="button" variant="outline" size="lg" @click="emit('close')">
                    Schließen
                </Button>
            </div>
        </div>
    </Teleport>
</template>
