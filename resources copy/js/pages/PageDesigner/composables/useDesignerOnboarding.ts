/**
 * Onboarding-Tour für den Page Designer.
 * Persistiert in localStorage unter page-designer-onboarding-done.
 */

import { ref, watch } from 'vue';

const STORAGE_KEY = 'page-designer-onboarding-done';

function getStoredCompleted(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function useDesignerOnboarding() {
    const onboardingCompleted = ref<boolean>(getStoredCompleted());
    const onboardingOpen = ref(false);
    const onboardingStep = ref(0);

    const TOTAL_STEPS = 6;

    function markCompleted(): void {
        onboardingCompleted.value = true;
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, 'true');
        }
        onboardingOpen.value = false;
    }

    function startTour(): void {
        onboardingOpen.value = true;
        onboardingStep.value = 0;
    }

    function closeTour(): void {
        onboardingOpen.value = false;
    }

    function nextStep(): void {
        if (onboardingStep.value >= TOTAL_STEPS - 1) {
            markCompleted();
        } else {
            onboardingStep.value += 1;
        }
    }

    function prevStep(): void {
        if (onboardingStep.value > 0) {
            onboardingStep.value -= 1;
        }
    }

    function setStep(index: number): void {
        onboardingStep.value = Math.max(0, Math.min(index, TOTAL_STEPS - 1));
    }

    watch(
        onboardingCompleted,
        (val) => {
            if (typeof window === 'undefined') return;
            localStorage.setItem(STORAGE_KEY, String(val));
        },
        { immediate: false },
    );

    return {
        onboardingCompleted,
        onboardingOpen,
        onboardingStep,
        totalSteps: TOTAL_STEPS,
        markCompleted,
        startTour,
        closeTour,
        nextStep,
        prevStep,
        setStep,
    };
}
