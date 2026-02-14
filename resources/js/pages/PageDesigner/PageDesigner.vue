<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { provide, onMounted, onUnmounted } from 'vue';
import {
    useDesignerStore,
    type DesignerProps,
} from '@/pages/PageDesigner/stores/useDesignerStore';
import { useDesignerAutosave } from '@/pages/PageDesigner/composables/useDesignerAutosave';
import DesignerToolbar from '@/pages/PageDesigner/components/DesignerToolbar.vue';
import DesignerSidebar from '@/pages/PageDesigner/components/DesignerSidebar.vue';
import DesignerCanvas from '@/pages/PageDesigner/components/DesignerCanvas.vue';
import DesignerContextPanel from '@/pages/PageDesigner/components/DesignerContextPanel.vue';
import ComponentGalleryModal from '@/templates/praxisemerald/ComponentGalleryModal.vue';
import MediaLibraryModal from '@/templates/praxisemerald/MediaLibraryModal.vue';
import AddPageModal from '@/pages/PageDesigner/AddPageModal.vue';
import { ShieldAlert } from 'lucide-vue-next';

const props = defineProps<DesignerProps>();
const designer = useDesignerStore(props);

provide('designer', designer);

if (!designer.isTemplateMode && designer.props.site) {
    useDesignerAutosave({
        getAutosaveEnabled: () => designer.autosaveEnabled,
        postDraft: designer.postDraft,
    });
}

provide('openMediaLibrary', designer.openMediaLibrary);
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
});

onUnmounted(() => {
    window.removeEventListener('message', onMessage);
    window.removeEventListener('keydown', onKeydown);
    designer.cleanup();
});
</script>

<template>
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

        <DesignerToolbar :designer="designer" />

        <div class="flex min-h-0 flex-1 bg-muted/20" :class="{ relative: designer.previewFullscreen }">
            <DesignerSidebar :designer="designer" />
            <DesignerCanvas :designer="designer" />
        </div>

        <DesignerContextPanel :designer="designer" />

        <ComponentGalleryModal
            :open="designer.componentGalleryOpen"
            :components="designer.registry?.LAYOUT_COMPONENT_REGISTRY ?? []"
            :get-component-label="designer.getComponentLabel"
            :get-layout-component="designer.registry?.getLayoutComponent"
            @select="designer.onComponentGallerySelect"
            @close="designer.closeComponentGallery"
        />
        <MediaLibraryModal
            v-if="designer.props.site"
            :open="designer.mediaLibraryOpen"
            :site-uuid="designer.props.site.uuid"
            @select="designer.onMediaLibrarySelect"
            @close="designer.onMediaLibraryClose"
        />
        <AddPageModal
            :open="designer.addPageModalOpen"
            @close="designer.closeAddPageModal"
            @add="designer.onAddPage"
        />
    </div>
</template>
