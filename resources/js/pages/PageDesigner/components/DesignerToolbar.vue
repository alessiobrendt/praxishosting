<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { show as sitesShow } from '@/routes/sites';
import templates from '@/routes/admin/templates';
import type { DesignerStore } from '@/pages/PageDesigner/stores/useDesignerStore';
import { ArrowLeft, Save, Undo2, Redo2, Monitor, Tablet, Smartphone, Maximize2, Minimize2, Eye } from 'lucide-vue-next';

defineProps<{ designer: DesignerStore }>();
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
                <Button
                    type="button"
                    size="sm"
                    :disabled="designer.saveInProgress"
                    title="Änderungen dauerhaft speichern"
                    @click="designer.saveToSite()"
                >
                    <Save class="mr-1 h-4 w-4" />
                    Veröffentlichen
                </Button>
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
        </div>
    </header>
</template>
