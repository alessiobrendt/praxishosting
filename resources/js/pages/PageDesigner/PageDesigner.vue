<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { provide, onMounted, onUnmounted } from 'vue';
import {
    useDesignerStore,
    type DesignerProps,
} from '@/pages/PageDesigner/stores/useDesignerStore';
import { useAiBalance } from '@/pages/PageDesigner/composables/useAiBalance';
import { useDesignerAutosave } from '@/pages/PageDesigner/composables/useDesignerAutosave';
import DesignerToolbar from '@/pages/PageDesigner/components/DesignerToolbar.vue';
import DesignerSidebar from '@/pages/PageDesigner/components/DesignerSidebar.vue';
import DesignerCanvas from '@/pages/PageDesigner/components/DesignerCanvas.vue';
import BlockToolbar from '@/pages/PageDesigner/components/BlockToolbar.vue';
import DesignerOnboarding from '@/pages/PageDesigner/components/DesignerOnboarding.vue';
import ComponentGalleryModal from '@/templates/praxisemerald/ComponentGalleryModal.vue';
import MediaLibraryModal from '@/templates/praxisemerald/MediaLibraryModal.vue';
import AddPageModal from '@/pages/PageDesigner/AddPageModal.vue';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RefreshCw } from 'lucide-vue-next';

const props = defineProps<DesignerProps>();
const designer = useDesignerStore(props);

const { balance: aiBalance, refresh: refreshAiBalance } = useAiBalance();

provide('designer', designer);
provide('aiBalance', aiBalance);
provide('refreshAiBalance', refreshAiBalance);

if (!designer.isTemplateMode && designer.props.site) {
    useDesignerAutosave({
        getAutosaveEnabled: () => designer.autosaveEnabled,
        postDraft: designer.postDraft,
    });
}

provide('openMediaLibrary', designer.openMediaLibrary);
provide('onMediaLibrarySelect', designer.onMediaLibrarySelect);
provide('onMediaLibraryClose', designer.onMediaLibraryClose);
provide('blockContextActions', designer.blockContextActions);
provide('selectedModuleId', designer.selectedModuleId);
provide('updateBlockField', designer.updateBlockField);
provide('usePreviewContainerQueries', true);

function onMessage(event: MessageEvent): void {
    const data = event.data;
    if (data?.type === 'page-designer-select' && typeof data.moduleId === 'string') {
        designer.selectedModuleId = data.moduleId;
    }
}

function onKeydown(e: KeyboardEvent): void {
    if (designer.isTemplateMode) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) designer.redo();
        else designer.undo();
    }
}

onMounted(() => {
    window.addEventListener('message', onMessage);
    window.addEventListener('keydown', onKeydown);
    if (!designer.isTemplateMode && designer.props.site) designer.postDraft();
    if (
        !designer.isTemplateMode &&
        designer.designerMode === 'anfaenger' &&
        !designer.onboardingCompleted &&
        !designer.onboardingOpen
    ) {
        designer.startOnboardingTour?.();
    }
});

onUnmounted(() => {
    window.removeEventListener('message', onMessage);
    window.removeEventListener('keydown', onKeydown);
    designer.cleanup();
});
</script>

<template>
    <TooltipProvider
        :delay-duration="designer.designerMode === 'anfaenger' ? 0 : 300"
        :skip-delay-duration="0"
    >
        <div class="fixed inset-0 z-50 flex flex-col bg-background">
            <Head :title="designer.pageTitle" />

            <div
            v-if="designer.isTemplateMode"
            class="flex shrink-0 items-center gap-2 border-b border-amber-500/50 bg-amber-500/10 px-4 py-2 text-amber-800 dark:text-amber-200"
        >
            <ShieldAlert class="h-5 w-5 shrink-0" />
            <span class="text-sm font-semibold">Admin: Layout-Vorlage bearbeiten</span>
            <span class="text-xs opacity-90">Änderungen gelten als Standard für alle Sites mit diesem Template.</span>
        </div>

        <div
            v-if="!designer.isTemplateMode && designer.publishConflict"
            class="flex shrink-0 items-center justify-between gap-4 border-b border-red-500/50 bg-red-500/10 px-4 py-2 text-red-800 dark:text-red-200"
        >
            <span class="text-sm font-semibold">Die Seite wurde woanders geändert. Bitte laden Sie neu, um den aktuellen Stand zu sehen.</span>
            <Button
                type="button"
                variant="outline"
                size="sm"
                class="shrink-0 gap-1.5 border-red-300 bg-white/80 hover:bg-white dark:border-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50"
                @click="router.reload()"
            >
                <RefreshCw class="h-4 w-4" />
                Seite neu laden
            </Button>
        </div>

        <DesignerToolbar :designer="designer" />

        <div class="flex min-h-0 flex-1 bg-muted/20" :class="{ relative: designer.previewFullscreen }">
            <DesignerSidebar :designer="designer" />
            <DesignerCanvas :designer="designer" />
        </div>

        <BlockToolbar :designer="designer" />

        <ComponentGalleryModal
            :open="designer.componentGalleryOpen"
            :components="designer.registry?.LAYOUT_COMPONENT_REGISTRY ?? []"
            :get-component-label="designer.getComponentLabel"
            :get-layout-component="designer.registry?.getLayoutComponent"
            @select="designer.onComponentGallerySelect"
            @close="designer.closeComponentGallery"
        />
        <MediaLibraryModal
            v-if="designer.props.site && designer.mediaLibraryOpen"
            :open="true"
            :site-uuid="designer.props.site.uuid"
            :on-apply-selection="designer.onMediaLibrarySelect"
            @close="designer.onMediaLibraryClose"
        />
        <AddPageModal
            :open="designer.addPageModalOpen"
            @close="designer.closeAddPageModal"
            @add="designer.onAddPage"
        />
        <DesignerOnboarding :designer="designer" />
        </div>
    </TooltipProvider>
</template>
