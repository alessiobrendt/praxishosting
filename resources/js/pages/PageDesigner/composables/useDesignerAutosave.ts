import { ref, watch, onUnmounted } from 'vue';

const AUTOSAVE_INTERVAL_MS = 30_000;

export type DesignerAutosaveContext = {
    getAutosaveEnabled: () => boolean;
    postDraft: () => Promise<unknown> | null;
};

export function useDesignerAutosave(ctx: DesignerAutosaveContext) {
    const lastSavedAt = ref<number | null>(null);
    let intervalId: ReturnType<typeof setInterval> | null = null;

    function startAutosave(): void {
        if (intervalId) return;
        intervalId = setInterval(() => {
            if (!ctx.getAutosaveEnabled()) return;
            const result = ctx.postDraft();
            if (result) {
                result.then(() => {
                    lastSavedAt.value = Date.now();
                });
            }
        }, AUTOSAVE_INTERVAL_MS);
    }

    function stopAutosave(): void {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    watch(
        () => ctx.getAutosaveEnabled(),
        (enabled) => {
            if (enabled) {
                startAutosave();
            } else {
                stopAutosave();
            }
        },
        { immediate: true },
    );

    onUnmounted(stopAutosave);

    return {
        lastSavedAt,
        startAutosave,
        stopAutosave,
    };
}
