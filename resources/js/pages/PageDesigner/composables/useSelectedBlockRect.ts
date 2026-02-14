/**
 * Tracks the bounding rect of the currently selected block for floating toolbar positioning.
 * Updates on selectedModuleId change, scroll, and resize.
 */

import { ref, watch, nextTick, type Ref } from 'vue';
import { useEventListener } from '@vueuse/core';

const TOOLBAR_OFFSET = 10;

export type BlockRect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export function useSelectedBlockRect(selectedModuleId: Ref<string | null>) {
    const selectedBlockRect = ref<BlockRect | null>(null);

    function updateRect(): void {
        const id = selectedModuleId.value;
        if (!id) {
            selectedBlockRect.value = null;
            return;
        }
        const el = document.querySelector<HTMLElement>(`[data-module-id="${id}"]`);
        if (!el) {
            selectedBlockRect.value = null;
            return;
        }
        const rect = el.getBoundingClientRect();
        selectedBlockRect.value = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        };
    }

    watch(
        selectedModuleId,
        (id) => {
            if (!id) {
                selectedBlockRect.value = null;
                return;
            }
            nextTick(() => updateRect());
        },
        { immediate: true },
    );

    useEventListener(window, 'scroll', updateRect, { capture: true, passive: true });
    useEventListener(window, 'resize', updateRect);

    return {
        selectedBlockRect,
        updateRect,
        TOOLBAR_OFFSET,
    };
}
