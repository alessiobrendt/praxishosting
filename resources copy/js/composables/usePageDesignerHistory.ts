import type { Ref } from 'vue';
import { computed, ref } from 'vue';

const MAX_HISTORY = 50;

export type UndoRedoResult = {
    snapshot: Record<string, unknown>;
    done: () => void;
};

export type UsePageDesignerHistoryReturn = {
    canUndo: Ref<boolean>;
    canRedo: Ref<boolean>;
    isApplying: Ref<boolean>;
    pushHistory: () => void;
    undo: () => UndoRedoResult | null;
    redo: () => UndoRedoResult | null;
};

/**
 * Undo/redo history for page designer state (pageData snapshots).
 * Call pushHistory() before each logical mutation; undo/redo return the snapshot to apply.
 */
export function usePageDesignerHistory(
    getSnapshot: () => Record<string, unknown>,
): UsePageDesignerHistoryReturn {
    const historyStack = ref<Record<string, unknown>[]>([]);
    const redoStack = ref<Record<string, unknown>[]>([]);
    const isApplying = ref(false);

    const canUndo = computed(() => historyStack.value.length > 0);
    const canRedo = computed(() => redoStack.value.length > 0);

    function pushHistory(): void {
        if (isApplying.value) return;
        const snapshot = JSON.parse(JSON.stringify(getSnapshot())) as Record<string, unknown>;
        historyStack.value = [...historyStack.value.slice(-(MAX_HISTORY - 1)), snapshot];
        redoStack.value = [];
    }

    function undo(): UndoRedoResult | null {
        if (historyStack.value.length === 0) return null;
        isApplying.value = true;
        const current = JSON.parse(JSON.stringify(getSnapshot())) as Record<string, unknown>;
        redoStack.value = [...redoStack.value, current];
        const previous = historyStack.value[historyStack.value.length - 1];
        historyStack.value = historyStack.value.slice(0, -1);
        return {
            snapshot: previous,
            done: () => {
                isApplying.value = false;
            },
        };
    }

    function redo(): UndoRedoResult | null {
        if (redoStack.value.length === 0) return null;
        isApplying.value = true;
        const current = JSON.parse(JSON.stringify(getSnapshot())) as Record<string, unknown>;
        historyStack.value = [...historyStack.value, current];
        const next = redoStack.value[redoStack.value.length - 1];
        redoStack.value = redoStack.value.slice(0, -1);
        return {
            snapshot: next,
            done: () => {
                isApplying.value = false;
            },
        };
    }

    return { canUndo, canRedo, isApplying, pushHistory, undo, redo };
}
