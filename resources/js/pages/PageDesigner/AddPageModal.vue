<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const props = defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'add', payload: { name: string; slug: string }): void;
}>();

const name = ref('');
const slug = ref('');

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
}

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            name.value = '';
            slug.value = '';
        }
    },
);

function onNameInput(): void {
    slug.value = slugify(name.value);
}

function submit(): void {
    const n = name.value.trim();
    const s = (slug.value.trim() || slugify(n)).toLowerCase().replace(/[^a-z0-9\-]/g, '');
    if (!n || !s) return;
    emit('add', { name: n, slug: s });
    emit('close');
}

function close(): void {
    emit('close');
}

function onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).getAttribute('data-modal-overlay') === 'true') {
        close();
    }
}

function onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && props.open) {
        close();
    }
}

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            window.addEventListener('keydown', onKeydown);
        } else {
            window.removeEventListener('keydown', onKeydown);
        }
    },
    { immediate: true },
);

onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open"
            role="dialog"
                aria-modal="true"
                aria-labelledby="add-page-modal-title"
                class="fixed inset-0 z-[100] flex items-center justify-center p-4"
                @keydown.escape="close"
            >
                <div
                    data-modal-overlay="true"
                    class="fixed inset-0 z-[100] bg-black/80"
                    aria-hidden="true"
                    @click="onOverlayClick"
                />
                <div
                    class="relative z-[101] flex max-w-md flex-col gap-4 rounded-lg border bg-background p-6 shadow-lg"
                    @click.stop
                >
                    <div class="space-y-1">
                        <h2 id="add-page-modal-title" class="text-lg font-semibold leading-none tracking-tight">
                            Neue Seite hinzufügen
                        </h2>
                    </div>
                    <div class="grid gap-4 py-2">
                        <div class="grid gap-2">
                            <Label for="add-page-name">Name</Label>
                            <Input
                                id="add-page-name"
                                v-model="name"
                                placeholder="z. B. Impressum"
                                @input="onNameInput"
                            />
                        </div>
                        <div class="grid gap-2">
                            <Label for="add-page-slug">Slug (URL-Teil)</Label>
                            <Input
                                id="add-page-slug"
                                v-model="slug"
                                placeholder="z. B. impressum"
                            />
                        </div>
                    </div>
                    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" @click="close">
                            Abbrechen
                        </Button>
                        <Button type="button" @click="submit">
                            Hinzufügen
                        </Button>
                    </div>
                </div>
            </div>
    </Teleport>
</template>
