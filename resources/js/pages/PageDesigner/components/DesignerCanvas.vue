<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { SitePageData } from '@/types/site-page-data';
import type { DesignerStore } from '@/pages/PageDesigner/stores/useDesignerStore';
import { Monitor, Tablet, Smartphone, Minimize2, Maximize2 } from 'lucide-vue-next';

defineProps<{ designer: DesignerStore }>();
</script>

<template>
    <main
        class="min-h-0 flex-1 overflow-auto p-4"
        :class="{ 'fixed inset-0 z-0 p-0 overflow-auto bg-muted/20': designer.previewFullscreen }"
    >
        <div
            class="mx-auto flex min-h-full flex-col items-center gap-3"
            :class="{ 'h-full w-full max-w-none items-stretch': designer.previewFullscreen }"
        >
            <div
                v-show="!designer.previewFullscreen"
                class="flex items-center gap-1 rounded-md border border-border bg-card/80 p-1 shadow-sm"
                data-tour="preview-viewport"
            >
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    :class="designer.previewViewport === 'desktop' ? 'h-8 w-8 bg-background shadow-sm' : 'h-8 w-8'"
                    title="Desktop"
                    @click="designer.previewViewport = 'desktop'"
                >
                    <Monitor class="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    :class="designer.previewViewport === 'tablet' ? 'h-8 w-8 bg-background shadow-sm' : 'h-8 w-8'"
                    title="Tablet"
                    @click="designer.previewViewport = 'tablet'"
                >
                    <Tablet class="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    :class="designer.previewViewport === 'mobile' ? 'h-8 w-8 bg-background shadow-sm' : 'h-8 w-8'"
                    title="Mobil"
                    @click="designer.previewViewport = 'mobile'"
                >
                    <Smartphone class="h-4 w-4" />
                </Button>
                <Button
                    v-if="designer.previewViewport === 'desktop'"
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8"
                    :title="designer.previewFullscreen ? 'Vollbild beenden' : 'Desktop-Vorschau im Vollbild'"
                    @click="designer.previewFullscreen = !designer.previewFullscreen"
                >
                    <Minimize2 v-if="designer.previewFullscreen" class="h-4 w-4" />
                    <Maximize2 v-else class="h-4 w-4" />
                </Button>
            </div>
            <div
                class="relative w-full overflow-auto rounded-lg border-2 border-border bg-muted shadow-xl transition-[max-width] light page-designer-preview-container site-render @container"
                data-tour="preview-container"
                :class="[designer.previewWrapperClass, designer.previewFullscreen && 'min-h-full rounded-none border-0 shadow-none']"
                :style="{
                    ...designer.previewStyles,
                    transform: 'translateZ(0)',
                    containerType: 'inline-size',
                    containerName: 'page-designer-preview',
                }"
            >
                <component
                    v-if="designer.layoutComponent && designer.registry"
                    :is="designer.layoutComponent"
                    :page-data="designer.pageData"
                    :colors="(designer.pageData as SitePageData).colors ?? designer.defaultColors"
                    :general-information="{ name: designer.displayName }"
                    :site="designer.props.site ?? undefined"
                    :design-mode="true"
                    :selected-module-id="designer.selectedModuleId"
                    :selected-block-ids="designer.selectedBlockIds"
                    :move-selection-to-container="designer.moveSelectionToContainer"
                    :move-entry-to-container="designer.moveEntryToContainer"
                    :insert-at-root="(index: number, type: string) => designer.addComponent(type, index)"
                    :insert-at-parent="(parentId: string, index: number, type: string) => designer.addComponent(type, index, parentId)"
                    :global-button-style="(designer.pageData as SitePageData).global_button_style ?? {}"
                    class="min-h-[calc(100vh-8rem)]"
                    @select="(id: string, addToSelection?: boolean) => designer.setSelection(id, addToSelection ?? false)"
                    @reorder="designer.onLayoutReorder"
                    @drag-start="designer.saveLayoutSnapshot"
                />
                <div
                    v-else
                    class="flex h-[calc(100vh-8rem)] min-h-[320px] items-center justify-center text-muted-foreground"
                >
                    Vorschau wird geladen…
                </div>
            </div>
        </div>
    </main>
</template>
