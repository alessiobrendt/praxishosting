/**
 * Profi/Anfänger-Modus für den Page Designer.
 * Persistiert in localStorage unter page-designer-mode.
 */

import { ref, watch } from 'vue';

export type DesignerMode = 'anfaenger' | 'profi';

const STORAGE_KEY = 'page-designer-mode';

function getStoredMode(): DesignerMode {
    if (typeof window === 'undefined') {
        return 'anfaenger';
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'profi' || stored === 'anfaenger') {
        return stored;
    }
    return 'anfaenger';
}

export function useDesignerMode() {
    const designerMode = ref<DesignerMode>(getStoredMode());

    watch(
        designerMode,
        (val) => {
            if (typeof window === 'undefined') return;
            localStorage.setItem(STORAGE_KEY, val);
        },
        { immediate: false },
    );

    const isAnfaenger = () => designerMode.value === 'anfaenger';
    const isProfi = () => designerMode.value === 'profi';

    return {
        designerMode,
        isAnfaenger,
        isProfi,
    };
}
