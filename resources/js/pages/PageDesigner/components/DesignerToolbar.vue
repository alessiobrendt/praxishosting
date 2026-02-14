<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { inject } from 'vue';
import { Button } from '@/components/ui/button';
import { TooltipContent, TooltipRoot, TooltipTrigger } from '@/components/ui/tooltip';
import { show as sitesShow } from '@/routes/sites';
import billing from '@/routes/billing';
import templates from '@/routes/admin/templates';
import type { DesignerStore } from '@/pages/PageDesigner/stores/useDesignerStore';
import { Sparkles } from 'lucide-vue-next';
import {
    ArrowLeft,
    Save,
    Undo2,
    Redo2,
    Monitor,
    Tablet,
    Smartphone,
    Maximize2,
    Minimize2,
    Eye,
    GraduationCap,
    Zap,
    BookOpen,
} from 'lucide-vue-next';

defineProps<{ designer: DesignerStore }>();

const aiBalance = inject<{ value: number | null }>('aiBalance', { value: null });
</script>

<template>
    <header
        class="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4"
        :class="{ 'fixed top-0 left-0 right-0 z-20': designer.previewFullscreen }"
        :style="designer.isTemplateMode ? { top: '2.5rem' } : undefined"
    >
        <div class="flex items-center gap-3">
            <Link v-if="designer.isTemplateMode && designer.props.template" :href="templates.show({ template: designer.props.template.id }).url">
                <Button type="button" variant="ghost" size="sm">
                    <ArrowLeft class="mr-1 h-4 w-4" />
                    Zurück zum Template
                </Button>
            </Link>
            <Link v-else-if="designer.props.site?.uuid" :href="sitesShow({ site: designer.props.site.uuid }).url">
                <Button type="button" variant="ghost" size="sm">
                    <ArrowLeft class="mr-1 h-4 w-4" />
                    Zurück zur Site
                </Button>
            </Link>
            <span class="text-sm font-medium text-muted-foreground">{{ designer.displayName }}</span>
            <span class="text-xs text-muted-foreground">{{ designer.getPageLabel(designer.currentPageSlug) }}</span>
            <div v-if="!designer.isTemplateMode" class="flex items-center gap-1">
                <TooltipRoot>
                    <TooltipTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-8 w-8"
                            :disabled="!designer.canUndo"
                            title="Rückgängig (Strg+Z)"
                            @click="designer.undo"
                        >
                            <Undo2 class="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rückgängig (Strg+Z)</TooltipContent>
                </TooltipRoot>
                <TooltipRoot>
                    <TooltipTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-8 w-8"
                            :disabled="!designer.canRedo"
                            title="Wiederherstellen (Strg+Umschalt+Z)"
                            @click="designer.redo"
                        >
                            <Redo2 class="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Wiederherstellen (Strg+Umschalt+Z)</TooltipContent>
                </TooltipRoot>
            </div>
        </div>
        <div class="flex items-center gap-3">
            <Button
                v-if="designer.previewFullscreen"
                type="button"
                variant="outline"
                size="sm"
                title="Vollbild beenden"
                @click="designer.previewFullscreen = false"
            >
                <Minimize2 class="mr-1 h-4 w-4" />
                Vollbild beenden
            </Button>
            <template v-if="!designer.isTemplateMode">
                <TooltipRoot>
                    <TooltipTrigger as-child>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            title="Entwurf in Vorschau anzeigen"
                            @click="designer.pushPreviewDraft()"
                        >
                            <Eye class="mr-1 h-4 w-4" />
                            Vorschau
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Entwurf in Vorschau anzeigen</TooltipContent>
                </TooltipRoot>
                <TooltipRoot>
                    <TooltipTrigger as-child>
                        <Button
                            type="button"
                            size="sm"
                            :disabled="designer.saveInProgress"
                            title="Änderungen dauerhaft speichern"
                            data-tour="publish-button"
                            @click="designer.saveToSite()"
                        >
                            <Save class="mr-1 h-4 w-4" />
                            Veröffentlichen
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Änderungen dauerhaft speichern</TooltipContent>
                </TooltipRoot>
            </template>
            <template v-else>
                <Button
                    type="button"
                    size="sm"
                    :disabled="designer.saveInProgress"
                    @click="designer.saveToTemplate()"
                >
                    <Save class="mr-1 h-4 w-4" />
                    Speichern
                </Button>
            </template>
            <span
                v-if="designer.draftSavedLabel"
                class="text-xs text-muted-foreground"
                :title="designer.draftSavedLabel"
            >
                {{ designer.draftSavedLabel }}
            </span>
            <TooltipRoot>
                <TooltipTrigger as-child>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        class="h-8 gap-1.5 px-2"
                        @click="designer.startOnboardingTour?.()"
                    >
                        <BookOpen class="h-3.5 w-3.5" />
                        <span class="hidden sm:inline">Tutorial</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Tutorial starten</TooltipContent>
            </TooltipRoot>
            <div
                v-if="!designer.isTemplateMode"
                class="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2 py-1"
            >
                <Sparkles class="h-3.5 w-3.5 text-primary" />
                <span class="text-xs">
                    AI: {{ aiBalance?.value != null ? aiBalance.value : '…' }} Tokens
                </span>
                <Link :href="billing.index.url()">
                    <Button
                        type="button"
                        variant="link"
                        size="sm"
                        class="h-6 px-1 text-xs"
                    >
                        Aufladen
                    </Button>
                </Link>
            </div>
            <div
                class="flex items-center rounded-lg border border-border bg-muted/50 p-0.5"
                role="group"
                aria-label="Modus: Anfänger oder Profi"
            >
                <button
                    type="button"
                    :class="[
                        'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                        designer.designerMode === 'anfaenger'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                    ]"
                    :title="designer.designerMode === 'anfaenger' ? 'Anfänger-Modus aktiv' : 'Zu Anfänger-Modus wechseln'"
                    @click="designer.designerMode = 'anfaenger'"
                >
                    <GraduationCap class="h-3.5 w-3.5" />
                </button>
                <button
                    type="button"
                    :class="[
                        'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                        designer.designerMode === 'profi'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                    ]"
                    :title="designer.designerMode === 'profi' ? 'Profi-Modus aktiv' : 'Zu Profi-Modus wechseln'"
                    @click="designer.designerMode = 'profi'"
                >
                    <Zap class="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    </header>
</template>
