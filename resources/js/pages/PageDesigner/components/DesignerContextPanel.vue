<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { SitePageData } from '@/types/site-page-data';
import type { DesignerStore } from '@/pages/PageDesigner/stores/useDesignerStore';
import { X, Pencil, Palette, Settings } from 'lucide-vue-next';

defineProps<{ designer: DesignerStore }>();
</script>

<template>
    <Teleport to="body">
        <Transition name="context-panel">
            <div
                v-if="designer.selectedEntry"
                class="fixed inset-0 z-[60]"
                role="presentation"
                aria-hidden="true"
            >
                <button
                    type="button"
                    class="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
                    aria-label="Einstellungen schließen"
                    @click="designer.selectedModuleId = null"
                />
                <div
                    class="absolute right-6 top-24 bottom-6 flex min-h-0 w-[380px] flex-col rounded-xl border border-border bg-card shadow-xl"
                    role="dialog"
                    aria-labelledby="context-panel-title"
                    aria-modal="true"
                    @click.stop
                >
                    <div class="flex shrink-0 items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
                        <h2 id="context-panel-title" class="text-sm font-semibold">
                            {{ designer.getComponentLabel(designer.selectedEntry!.type, designer.selectedEntry) }}
                        </h2>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-8 w-8 shrink-0"
                            aria-label="Eigenschaften schließen"
                            @click="designer.selectedModuleId = null"
                        >
                            <X class="h-4 w-4" />
                        </Button>
                    </div>
                    <Tabs default-tab="inhalt" class="flex min-h-0 flex-1 flex-col">
                        <TabsList class="mx-3 mt-2 shrink-0 rounded-lg bg-muted/80 p-1">
                            <TabsTrigger value="inhalt" class="gap-1.5 text-xs">
                                <Pencil class="h-3.5 w-3.5" />
                                Inhalt
                            </TabsTrigger>
                            <TabsTrigger value="design" class="gap-1.5 text-xs">
                                <Palette class="h-3.5 w-3.5" />
                                Design
                            </TabsTrigger>
                            <TabsTrigger value="aktionen" class="gap-1.5 text-xs">
                                <Settings class="h-3.5 w-3.5" />
                                Aktionen
                            </TabsTrigger>
                        </TabsList>
                        <div :ref="(el) => { designer.rightPanelRef = (el as HTMLElement) ?? null; }" class="min-h-0 flex-1 overflow-y-auto p-3">
                            <TabsContent value="inhalt" class="mt-0">
                                <component
                                    :is="designer.LayoutComponentContextPanelComponent"
                                    :entry="designer.selectedEntry"
                                    :site="designer.props.site ?? undefined"
                                    :colors="(designer.pageData as SitePageData).colors ?? designer.defaultColors"
                                />
                            </TabsContent>
                            <TabsContent value="design" class="mt-0">
                                <p class="text-muted-foreground text-xs">
                                    Farben, Abstände und Animationen finden Sie unter dem Tab „Inhalt“.
                                </p>
                            </TabsContent>
                            <TabsContent value="aktionen" class="mt-0">
                                <p class="text-muted-foreground text-xs">
                                    Button-Aktionen und Links finden Sie unter dem Tab „Inhalt“.
                                </p>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.context-panel-enter-active,
.context-panel-leave-active {
    transition: opacity 0.15s ease;
}
.context-panel-enter-active button,
.context-panel-leave-active button {
    transition: opacity 0.15s ease;
}
.context-panel-enter-active [role="dialog"],
.context-panel-leave-active [role="dialog"] {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.context-panel-enter-from,
.context-panel-leave-to {
    opacity: 0;
}
.context-panel-enter-from [role="dialog"],
.context-panel-leave-to [role="dialog"] {
    transform: translateX(1rem);
    opacity: 0;
}
.context-panel-enter-to [role="dialog"],
.context-panel-leave-from [role="dialog"] {
    transform: translateX(0);
    opacity: 1;
}
</style>
