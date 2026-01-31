import { computed, onMounted, onUnmounted, ref } from 'vue';
import { usePage } from '@inertiajs/vue3';

const DEBUG_STORAGE_KEY = 'inactivity_lock_debug_seconds';

/** Debug: localStorage.setItem('inactivity_lock_debug_seconds', '5') → Sperre nach 5 Sekunden. Seite danach neu laden. */
function getDebugSeconds(): number {
    if (typeof localStorage === 'undefined') {
        return 0;
    }
    const val = localStorage.getItem(DEBUG_STORAGE_KEY);
    if (val === null) {
        return 0;
    }
    const n = parseInt(val, 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
}

export function useInactivityLock(): {
    isLocked: import('vue').Ref<boolean>;
    unlock: () => void;
} {
    const page = usePage();
    const isLocked = ref(false);

    const user = computed(
        () => page.props.auth?.user as { has_pin?: boolean; inactivity_lock_minutes?: number } | undefined,
    );
    const pinVerifiedAt = computed(() => page.props.auth?.pinVerifiedAt as number | null | undefined);
    const hasPin = computed(() => Boolean(user.value?.has_pin));
    const inactivityMinutes = computed(() => Number(user.value?.inactivity_lock_minutes ?? 0));
    const debugSeconds = computed(() => getDebugSeconds());
    const isActive = computed(
        () =>
            hasPin.value &&
            (debugSeconds.value > 0 || inactivityMinutes.value > 0),
    );
    const mustShowLock = computed(
        () => isActive.value && !pinVerifiedAt.value,
    );
    const delayMs = computed(() =>
        debugSeconds.value > 0
            ? debugSeconds.value * 1000
            : inactivityMinutes.value * 60 * 1000,
    );

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    function resetTimer(): void {
        if (!isActive.value) {
            return;
        }
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            isLocked.value = true;
            timeoutId = null;
        }, delayMs.value);
    }

    function unlock(): void {
        isLocked.value = false;
        resetTimer();
    }

    function handleActivity(): void {
        if (isLocked.value) {
            return;
        }
        resetTimer();
    }

    onMounted(() => {
        if (debugSeconds.value > 0 && !hasPin.value && typeof console !== 'undefined') {
            console.warn(
                '[useInactivityLock] Debug aktiv (5s), aber keine PIN gesetzt. Bitte unter Einstellungen → Sicherheit eine PIN anlegen, dann Seite neu laden.',
            );
        }
        if (!isActive.value) {
            return;
        }
        // Nach Reload/F5: Server hat pin_verified_at gelöscht → pinVerifiedAt fehlt → Sperre anzeigen (kein Umgehen per F5)
        isLocked.value = mustShowLock.value;
        resetTimer();
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        events.forEach((event) => {
            document.addEventListener(event, handleActivity);
        });
    });

    onUnmounted(() => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
        events.forEach((event) => {
            document.removeEventListener(event, handleActivity);
        });
    });

    return { isLocked, unlock };
}
