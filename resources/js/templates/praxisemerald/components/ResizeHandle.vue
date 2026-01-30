<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { LayoutComponentEntry } from '@/types/layout-components';

const props = defineProps<{
    leftEntry: LayoutComponentEntry;
    rightEntry: LayoutComponentEntry;
}>();

const emit = defineEmits<{
    (e: 'resize'): void;
}>();

const handleRef = ref<HTMLElement | null>(null);
let startX = 0;
let startLeftPercent = 0;
let startRightPercent = 0;

function parsePercent(entry: LayoutComponentEntry): number {
    const v = entry.data?.flexBasis as string | undefined;
    if (!v || typeof v !== 'string') return 50;
    const num = parseFloat(v);
    if (Number.isNaN(num)) return 50;
    return Math.max(10, Math.min(90, num));
}

function setPercent(entry: LayoutComponentEntry, value: number): void {
    const d = entry.data as Record<string, unknown>;
    if (!d) return;
    d.flexBasis = `${Math.round(value * 100) / 100}%`;
}

function onPointerDown(e: PointerEvent): void {
    if (e.button !== 0) return;
    const container = handleRef.value?.parentElement;
    if (!container) return;
    startX = e.clientX;
    startLeftPercent = parsePercent(props.leftEntry);
    startRightPercent = parsePercent(props.rightEntry);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const onMove = (moveEvent: PointerEvent): void => {
        const w = container.offsetWidth;
        if (w <= 0) return;
        const deltaX = moveEvent.clientX - startX;
        const deltaPercent = (deltaX / w) * 100;
        let newLeft = startLeftPercent + deltaPercent;
        let newRight = startRightPercent - deltaPercent;
        const min = 10;
        const max = 90;
        if (newLeft < min) {
            newLeft = min;
            newRight = startLeftPercent + startRightPercent - min;
        } else if (newRight < min) {
            newRight = min;
            newLeft = startLeftPercent + startRightPercent - min;
        }
        if (newLeft > max) newLeft = max;
        if (newRight > max) newRight = max;
        setPercent(props.leftEntry, newLeft);
        setPercent(props.rightEntry, newRight);
        emit('resize');
    };
    const onUp = (): void => {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
}
</script>

<template>
    <div
        ref="handleRef"
        class="section-resize-handle flex shrink-0 basis-2 cursor-col-resize items-stretch bg-muted/50 transition-colors hover:bg-primary/30"
        role="separator"
        aria-label="Breite anpassen"
        @pointerdown="onPointerDown"
    >
        <div class="mx-auto w-1 self-stretch bg-border" />
    </div>
</template>
