<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import type { DesignerStore } from '@/pages/PageDesigner/stores/useDesignerStore';
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next';

const props = defineProps<{ designer: DesignerStore }>();

const STEPS = [
    {
        id: 'welcome',
        target: null as string | null,
        title: 'Willkommen im Page Designer',
        content:
            'Hier gestalten Sie Ihre Website. Sie können Blöcke hinzufügen, bearbeiten und anordnen. Diese kurze Tour führt Sie durch die wichtigsten Funktionen.',
    },
    {
        id: 'preview',
        target: 'preview-viewport',
        title: 'Vorschau',
        content:
            'Die Vorschau zeigt Ihre Seite in Echtzeit. Sie können zwischen Desktop, Tablet und Mobil wechseln, um das Design auf verschiedenen Geräten zu prüfen.',
    },
    {
        id: 'block-select',
        target: 'preview-container',
        title: 'Block auswählen',
        content: 'Klicken Sie auf einen Block in der Vorschau, um ihn zu bearbeiten. Der ausgewählte Block wird hervorgehoben.',
    },
    {
        id: 'block-edit',
        target: 'block-toolbar',
        title: 'Block bearbeiten',
        content:
            'Nach dem Auswählen erscheint eine Toolbar mit Inhalt, Design und Aktionen. Hier können Sie Texte ändern, Farben anpassen oder den Block duplizieren.',
    },
    {
        id: 'sidebar',
        target: 'sidebar-struktur',
        title: 'Sidebar',
        content:
            'In der Sidebar finden Sie die Struktur aller Blöcke, Seitenverwaltung, SEO, Medien, Design-Einstellungen und weitere Optionen.',
    },
    {
        id: 'save',
        target: 'publish-button',
        title: 'Speichern & Veröffentlichen',
        content:
            'Änderungen werden als Entwurf automatisch gespeichert. Klicken Sie auf „Veröffentlichen“, um die Änderungen dauerhaft auf Ihrer Website zu übernehmen.',
    },
];

const cardPosition = ref<{ top?: number; left?: number; width?: number } | null>(null);
const cardRef = ref<HTMLElement | null>(null);

function updateCardPosition(targetId: string | null): void {
    if (!targetId) {
        const cardHeight = 220;
        const w = typeof window !== 'undefined' ? window.innerWidth : 800;
        const h = typeof window !== 'undefined' ? window.innerHeight : 600;
        cardPosition.value = {
            top: (h - cardHeight) / 2,
            left: (w - 320) / 2,
            width: 320,
        };
        return;
    }
    const el = document.querySelector(`[data-tour="${targetId}"]`) as HTMLElement | null;
    if (!el) {
        const cardHeight = 220;
        const w = typeof window !== 'undefined' ? window.innerWidth : 800;
        const h = typeof window !== 'undefined' ? window.innerHeight : 600;
        cardPosition.value = {
            top: (h - cardHeight) / 2,
            left: (w - 320) / 2,
            width: 320,
        };
        return;
    }
    const rect = el.getBoundingClientRect();
    const cardWidth = 320;
    const cardHeight = 220;
    const padding = 16;
    let top = rect.bottom + padding;
    let left = rect.left + rect.width / 2 - cardWidth / 2;
    if (top + cardHeight > window.innerHeight - padding) {
        top = rect.top - cardHeight - padding;
    }
    left = Math.max(padding, Math.min(left, window.innerWidth - cardWidth - padding));
    cardPosition.value = {
        top: Math.max(padding, top),
        left,
        width: cardWidth,
    };
}

const currentStepConfig = computed(() => STEPS[props.designer.onboardingStep] ?? STEPS[0]);
const isFirstStep = computed(() => props.designer.onboardingStep === 0);
const isLastStep = computed(() => props.designer.onboardingStep === (props.designer.onboardingTotalSteps ?? 6) - 1);

watch(
    () => [props.designer.onboardingStep, props.designer.onboardingOpen] as const,
    ([step, open]) => {
        if (!open) return;
        nextTick(() => {
            const config = STEPS[step as number];
            updateCardPosition(config?.target ?? null);
        });
    },
    { immediate: true },
);

watch(
    () => props.designer.onboardingOpen,
    (open) => {
        if (open) {
            const config = STEPS[props.designer.onboardingStep];
            nextTick(() => updateCardPosition(config?.target ?? null));
        }
    },
);

function handleNext(): void {
    props.designer.onboardingNextStep?.();
}

function handlePrev(): void {
    props.designer.onboardingPrevStep?.();
}

function handleSkip(): void {
    props.designer.markOnboardingCompleted?.();
}

function handleClose(): void {
    props.designer.closeOnboardingTour?.();
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="designer.onboardingOpen"
                class="fixed inset-0 z-[200] flex items-center justify-center"
                role="dialog"
                aria-modal="true"
                aria-labelledby="onboarding-title"
            >
                <div
                    class="absolute inset-0 bg-black/50"
                    aria-hidden="true"
                    @click="handleSkip"
                />
                <div
                    ref="cardRef"
                    class="absolute z-10 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card p-4 shadow-2xl"
                    :style="
                        cardPosition
                            ? {
                                  top: `${cardPosition.top}px`,
                                  left: `${cardPosition.left}px`,
                                  width: cardPosition.width ? `${cardPosition.width}px` : undefined,
                              }
                            : undefined
                    "
                    @click.stop
                >
                    <div class="mb-3 flex items-start justify-between gap-2">
                        <h2
                            id="onboarding-title"
                            class="text-sm font-semibold leading-tight text-foreground"
                        >
                            {{ currentStepConfig.title }}
                        </h2>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7 shrink-0 -mr-1 -mt-1"
                            aria-label="Schließen"
                            @click="handleClose"
                        >
                            <X class="h-4 w-4" />
                        </Button>
                    </div>
                    <p class="mb-4 text-sm leading-relaxed text-muted-foreground">
                        {{ currentStepConfig.content }}
                    </p>
                    <div class="flex items-center justify-between gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            class="text-muted-foreground"
                            @click="handleSkip"
                        >
                            Überspringen
                        </Button>
                        <div class="flex items-center gap-1">
                            <Button
                                v-if="!isFirstStep"
                                type="button"
                                variant="outline"
                                size="sm"
                                @click="handlePrev"
                            >
                                <ChevronLeft class="h-4 w-4" />
                                Zurück
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                @click="handleNext"
                            >
                                {{ isLastStep ? 'Fertig' : 'Weiter' }}
                                <ChevronRight
                                    v-if="!isLastStep"
                                    class="h-4 w-4"
                                />
                            </Button>
                        </div>
                    </div>
                    <div
                        class="mt-3 flex gap-1"
                        role="tablist"
                        aria-label="Fortschritt"
                    >
                        <button
                            v-for="(_, i) in STEPS"
                            :key="i"
                            type="button"
                            :class="[
                                'h-1.5 flex-1 rounded-full transition-colors',
                                i === designer.onboardingStep
                                    ? 'bg-primary'
                                    : 'bg-muted hover:bg-muted/80',
                            ]"
                            :aria-label="`Schritt ${i + 1} von ${STEPS.length}`"
                            :aria-selected="i === designer.onboardingStep"
                            @click="designer.onboardingSetStep?.(i)"
                        />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
