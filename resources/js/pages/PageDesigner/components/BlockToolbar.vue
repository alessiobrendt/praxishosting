<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { SitePageData } from '@/types/site-page-data';
import type { DesignerStore } from '@/pages/PageDesigner/stores/useDesignerStore';
import { X, Pencil, Palette, Settings, Copy, Trash2, ClipboardPaste } from 'lucide-vue-next';

const props = defineProps<{ designer: DesignerStore }>();

const TOOLBAR_HEIGHT = 40;
const openInhalt = ref(false);
const openDesign = ref(false);
const openAktionen = ref(false);

watch(openInhalt, (v) => { if (v) { openDesign.value = false; openAktionen.value = false; } });
watch(openDesign, (v) => { if (v) { openInhalt.value = false; openAktionen.value = false; } });
watch(openAktionen, (v) => { if (v) { openInhalt.value = false; openDesign.value = false; } });

const toolbarStyle = computed(() => {
    const rect = props.designer.selectedBlockRect;
    if (!rect) return {};
    const top = rect.top - TOOLBAR_HEIGHT - (props.designer.TOOLBAR_OFFSET ?? 10);
    const left = rect.left + rect.width / 2;
    return {
        position: 'fixed' as const,
        top: `${Math.max(8, top)}px`,
        left: `${left}px`,
        transform: 'translateX(-50%)',
        zIndex: 61,
    };
});
</script>

<template>
    <Teleport to="body">
        <Transition name="toolbar-fade">
            <div
                v-if="designer.selectedEntry && designer.selectedBlockRect"
                :style="toolbarStyle"
                class="flex items-center gap-1 rounded-lg border border-border bg-card px-1 py-1 shadow-lg"
                role="toolbar"
                data-tour="block-toolbar"
            >
                <DropdownMenu v-model:open="openInhalt">
                    <DropdownMenuTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            class="h-8 gap-1.5 px-2.5 text-xs"
                            :class="{ 'bg-muted': openInhalt }"
                            aria-label="Inhalt bearbeiten"
                        >
                            <Pencil class="h-3.5 w-3.5" />
                            Inhalt
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                            side="bottom"
                            align="center"
                            :side-offset="6"
                            class="w-[380px] max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-card p-3 shadow-xl"
                        >
                            <component
                                :is="designer.LayoutComponentContextPanelComponent"
                                :entry="designer.selectedEntry"
                                :site="designer.props.site ?? undefined"
                                :colors="(designer.pageData as SitePageData).colors ?? designer.defaultColors"
                            />
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu v-model:open="openDesign">
                    <DropdownMenuTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            class="h-8 gap-1.5 px-2.5 text-xs"
                            :class="{ 'bg-muted': openDesign }"
                            aria-label="Design"
                        >
                            <Palette class="h-3.5 w-3.5" />
                            Design
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="bottom"
                        align="center"
                        :side-offset="6"
                        class="w-[380px] rounded-xl border border-border bg-card p-4 shadow-xl"
                    >
                        <p class="text-muted-foreground text-xs">
                            Farben, Abstände und Animationen finden Sie unter dem Tab „Inhalt“.
                        </p>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu v-model:open="openAktionen">
                    <DropdownMenuTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            class="h-8 gap-1.5 px-2.5 text-xs"
                            :class="{ 'bg-muted': openAktionen }"
                            aria-label="Aktionen"
                        >
                            <Settings class="h-3.5 w-3.5" />
                            Aktionen
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="bottom"
                        align="center"
                        :side-offset="6"
                        class="w-[280px] rounded-xl border border-border bg-card p-3 shadow-xl"
                    >
                            <div class="flex flex-col gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    class="justify-start gap-2"
                                    @click="designer.blockContextActions.duplicate(designer.selectedModuleId!); openAktionen = false"
                                >
                                    <Copy class="h-4 w-4" />
                                    Duplizieren
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    class="justify-start gap-2"
                                    @click="designer.blockContextActions.copy(designer.selectedModuleId!); openAktionen = false"
                                >
                                    <Copy class="h-4 w-4" />
                                    Kopieren
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    class="justify-start gap-2"
                                    :disabled="!designer.blockContextActions.getCanPaste()"
                                    @click="designer.blockContextActions.paste(designer.selectedModuleId!); openAktionen = false"
                                >
                                    <ClipboardPaste class="h-4 w-4" />
                                    Einfügen
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    class="justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    @click="designer.blockContextActions.remove(designer.selectedModuleId!); openAktionen = false"
                                >
                                    <Trash2 class="h-4 w-4" />
                                    Löschen
                                </Button>
                            </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div class="mx-1 h-5 w-px bg-border" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 shrink-0"
                    aria-label="Auswahl schließen"
                    @click="designer.selectedModuleId = null"
                >
                    <X class="h-4 w-4" />
                </Button>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.toolbar-fade-enter-active,
.toolbar-fade-leave-active {
    transition: opacity 0.15s ease;
}
.toolbar-fade-enter-from,
.toolbar-fade-leave-to {
    opacity: 0;
}
</style>
