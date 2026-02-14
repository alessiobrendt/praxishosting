<script setup lang="ts">
import { inject, ref, nextTick } from 'vue';
import { Link } from '@inertiajs/vue3';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TooltipContent, TooltipRoot, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import SectionList from '@/pages/PageDesigner/SectionList.vue';
import SidebarTreeFlat from '@/pages/PageDesigner/SidebarTreeFlat.vue';
import { COLOR_KEYS, COLOR_PALETTE_PRESETS } from '@/pages/PageDesigner/colorPalettePresets';
import type { DesignerStore } from '@/pages/PageDesigner/stores/useDesignerStore';
import { useAiSeo } from '@/pages/PageDesigner/composables/useAiSeo';
import billing from '@/routes/billing';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    X,
    Menu,
    FileStack,
    ImageIcon,
    Palette,
    Type,
    Square,
    Plus,
    Trash2,
    MoreVertical,
    Search,
    Settings,
    Sparkles,
} from 'lucide-vue-next';

const props = defineProps<{ designer: DesignerStore }>();
const refreshAiBalance = inject<() => Promise<void>>('refreshAiBalance', async () => {});

const aiSeoError = ref<string | null>(null);

const { loading: aiSeoLoading, optimizeSeo } = useAiSeo(props.designer, {
    refreshBalance: refreshAiBalance,
    onError: (err) => {
        nextTick(() => {
            aiSeoError.value = err.message;
        });
    },
    onSuccess: () => {
        aiSeoError.value = null;
    },
});

function onOptimizeSeo(): void {
    aiSeoError.value = null;
    optimizeSeo();
}
</script>

<template>
    <aside
        class="flex shrink-0 flex-row border-r border-border transition-[width] duration-200 ease-out"
        :class="[
            designer.leftSidebarContentOpen ? 'w-[calc(3.5rem+280px)]' : 'w-14',
            designer.previewFullscreen && 'fixed left-0 top-12 bottom-0 z-20 bg-background/95 backdrop-blur-sm',
        ]"
        :style="designer.isTemplateMode && designer.previewFullscreen ? { top: '4.5rem' } : undefined"
    >
        <div class="flex w-14 shrink-0 flex-col border-r border-border bg-muted/80">
            <div class="flex h-10 shrink-0 items-center justify-center border-b border-border">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8"
                    :title="designer.leftSidebarContentOpen ? 'Inhalts-Panel schließen (klein)' : 'Inhalts-Panel öffnen'"
                    @click="designer.leftSidebarContentOpen = !designer.leftSidebarContentOpen"
                >
                    <ChevronLeft v-if="designer.leftSidebarContentOpen" class="h-4 w-4" />
                    <ChevronRight v-else class="h-4 w-4" />
                </Button>
            </div>
            <nav class="flex flex-1 flex-col gap-0.5 px-1 py-2" aria-label="Sidebar">
                <TooltipRoot>
                    <TooltipTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-9 w-9"
                            :class="designer.leftSidebarTab === 'struktur' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                            title="Struktur"
                            data-tour="sidebar-struktur"
                            @click="designer.leftSidebarTab = 'struktur'; designer.leftSidebarContentOpen = true"
                        >
                            <Menu class="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Struktur</TooltipContent>
                </TooltipRoot>
                <TooltipRoot>
                    <TooltipTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-9 w-9"
                            :class="designer.leftSidebarTab === 'seiten' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                            title="Seiten"
                            @click="designer.leftSidebarTab = 'seiten'; designer.leftSidebarContentOpen = true"
                        >
                            <FileStack class="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Seiten</TooltipContent>
                </TooltipRoot>
                <TooltipRoot v-if="designer.props.site && !designer.isTemplateMode">
                    <TooltipTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-9 w-9"
                            :class="designer.leftSidebarTab === 'seo' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                            title="SEO"
                            @click="designer.leftSidebarTab = 'seo'; designer.leftSidebarContentOpen = true"
                        >
                            <Search class="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">SEO</TooltipContent>
                </TooltipRoot>
                <TooltipRoot v-if="designer.props.site">
                    <TooltipTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-9 w-9"
                            :class="designer.leftSidebarTab === 'medien' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                            title="Medien"
                            @click="designer.leftSidebarTab = 'medien'; designer.leftSidebarContentOpen = true"
                        >
                            <ImageIcon class="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Medien</TooltipContent>
                </TooltipRoot>
                <TooltipRoot>
                    <TooltipTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-9 w-9"
                            :class="designer.leftSidebarTab === 'design' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                            title="Design"
                            data-tour="sidebar-design"
                            @click="designer.leftSidebarTab = 'design'; designer.leftSidebarContentOpen = true"
                        >
                            <Palette class="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Design</TooltipContent>
                </TooltipRoot>
                <TooltipRoot v-if="designer.props.site && !designer.isTemplateMode">
                    <TooltipTrigger as-child>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-9 w-9"
                            :class="designer.leftSidebarTab === 'einstellungen' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'"
                            title="Einstellungen"
                            @click="designer.leftSidebarTab = 'einstellungen'; designer.leftSidebarContentOpen = true"
                        >
                            <Settings class="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Einstellungen</TooltipContent>
                </TooltipRoot>
            </nav>
        </div>
        <Transition name="sidebar-panel">
            <div
                v-if="designer.leftSidebarContentOpen"
                class="flex min-h-0 flex-1 flex-col overflow-hidden bg-background transition-[width]"
                :class="designer.leftSidebarPanelWidthClass"
            >
                <div class="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
                    <div class="flex min-w-0 flex-1 items-center gap-1">
                        <Button
                            v-if="designer.leftSidebarTab === 'design' && designer.designSection !== null"
                            type="button"
                            variant="ghost"
                            size="icon"
                            class="h-7 w-7 shrink-0"
                            aria-label="Zurück zur Design-Auswahl"
                            @click="designer.designSection = null"
                        >
                            <ArrowLeft class="h-4 w-4" />
                        </Button>
                        <h2 class="truncate text-sm font-semibold">
                            {{
                                designer.leftSidebarTab === 'design' && designer.designSection
                                    ? designer.getDesignSectionTitle(designer.designSection)
                                    : designer.getLeftSidebarTabTitle(designer.leftSidebarTab)
                            }}
                        </h2>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="h-7 w-7 shrink-0"
                        aria-label="Panel schließen"
                        @click="designer.leftSidebarContentOpen = false"
                    >
                        <X class="h-4 w-4" />
                    </Button>
                </div>
                <div class="min-h-0 flex-1 overflow-y-auto p-3">
                    <div v-show="designer.leftSidebarTab === 'struktur'" class="space-y-2 p-2" role="tabpanel">
                        <Card>
                            <CardHeader class="flex flex-row items-start justify-between gap-2 px-3 py-2">
                                <div class="min-w-0">
                                    <CardTitle class="text-sm">Abschnitte</CardTitle>
                                    <CardDescription class="text-xs">Reihenfolge per Drag. Klick: Auswählen.</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            class="h-7 w-7 shrink-0"
                                            aria-label="Optionen"
                                            @click.stop
                                        >
                                            <MoreVertical class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" class="min-w-[11rem]">
                                        <DropdownMenuItem @select="designer.openComponentGalleryForNewSection">
                                            Abschnitt hinzufügen
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @select="() => (designer.showTreeInSidebar = !designer.showTreeInSidebar)">
                                            {{ designer.showTreeInSidebar ? 'Baum ausblenden' : 'Baum anzeigen' }}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent class="space-y-1.5 px-3 pb-3 pt-0">
                                <SectionList
                                    :list="designer.layoutComponents"
                                    :get-component-label="designer.getComponentLabel"
                                    :selected-module-id="designer.selectedModuleId"
                                    @update:list="designer.onSectionListUpdate"
                                    @select="(id) => (designer.selectedModuleId = id)"
                                    @remove="designer.onSectionRemove"
                                    @duplicate="designer.onSectionDuplicate"
                                    @move="designer.onSectionMove"
                                />
                            </CardContent>
                        </Card>
                        <Card v-if="designer.showTreeInSidebar">
                            <CardHeader class="px-3 py-2">
                                <CardTitle class="text-sm">Seitenstruktur (Baum)</CardTitle>
                                <CardDescription class="text-xs">Vollständiger Baum.</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-1 px-3 pb-3 pt-0">
                                <SidebarTreeFlat
                                    :list="designer.layoutComponents"
                                    :get-component-label="designer.getComponentLabel"
                                    :selected-module-id="designer.selectedModuleId"
                                    :get-accepts-children="designer.getAcceptsChildren"
                                    @update:list="designer.onSidebarListUpdate"
                                    @remove="designer.onSidebarRemove"
                                    @duplicate="designer.onSidebarDuplicate"
                                    @move="designer.onSidebarMove"
                                    @select="(id) => (designer.selectedModuleId = id)"
                                />
                                <p v-if="!designer.layoutComponents.length" class="text-muted-foreground text-xs">
                                    Keine Komponenten.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div v-show="designer.leftSidebarTab === 'seiten'" class="space-y-3" role="tabpanel">
                        <Card>
                            <CardHeader class="pb-2">
                                <CardTitle class="text-sm">Seitenliste</CardTitle>
                                <CardDescription class="text-xs">Seiten dieser Website.</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-1.5 pt-0">
                                <template v-if="designer.isTemplateMode">
                                    <Button
                                        v-for="p in designer.templatePagesList"
                                        :key="p?.slug ?? ''"
                                        type="button"
                                        :variant="designer.currentPageSlug === p?.slug ? 'secondary' : 'ghost'"
                                        size="sm"
                                        class="w-full justify-start text-xs"
                                        @click="p && designer.switchPage(p.slug)"
                                    >
                                        {{ p?.name ?? '' }}
                                    </Button>
                                </template>
                                <template v-else>
                                    <div
                                        v-for="p in designer.sitePagesList"
                                        :key="p?.slug ?? ''"
                                        class="flex flex-wrap items-center gap-1 rounded-md border border-border p-1.5"
                                    >
                                        <Button
                                            type="button"
                                            :variant="designer.currentPageSlug === p.slug ? 'secondary' : 'ghost'"
                                            size="sm"
                                            class="min-w-0 flex-1 justify-start text-xs"
                                            @click="designer.switchPage(p.slug)"
                                        >
                                            {{ designer.getPageLabel(p.slug) }}
                                        </Button>
                                        <Badge variant="secondary" class="px-1 py-0 text-[10px] font-normal">
                                            {{ designer.getPageSourceBadge(p.slug) }}
                                        </Badge>
                                        <template v-if="p.slug !== 'index'">
                                            <Switch
                                                :model-value="designer.isPageActive(p.slug)"
                                                @update:model-value="(v: boolean) => designer.setPageActive(p.slug, v)"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                class="h-6 w-6 text-destructive"
                                                :title="p.isCustom ? 'Seite löschen' : 'Seite deaktivieren'"
                                                @click="designer.deletePage(p.slug)"
                                            >
                                                <Trash2 class="h-3 w-3" />
                                            </Button>
                                        </template>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        class="w-full text-xs"
                                        @click="designer.openAddPageModal"
                                    >
                                        <Plus class="mr-2 h-3 w-3" />
                                        Seite hinzufügen
                                    </Button>
                                </template>
                            </CardContent>
                        </Card>
                    </div>
                    <div v-show="designer.leftSidebarTab === 'seo'" class="space-y-3" role="tabpanel">
                        <Card v-if="designer.props.site && !designer.isTemplateMode">
                            <CardHeader class="pb-2">
                                <CardTitle class="text-sm">SEO für „{{ designer.getPageLabel(designer.currentPageSlug) }}“</CardTitle>
                                <CardDescription class="text-xs">Meta-Tags und Open Graph für diese Seite.</CardDescription>
                            </CardHeader>
                            <CardContent class="space-y-3 pt-0">
                                <div class="space-y-1">
                                    <Label class="text-xs">Favicon URL (Website-weit)</Label>
                                    <input
                                        :value="designer.siteFaviconUrl"
                                        type="url"
                                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="https://example.com/favicon.ico"
                                        @blur="(e) => designer.setSiteFavicon((e.target as HTMLInputElement).value)"
                                    >
                                </div>
                                <div class="space-y-1">
                                    <Label class="text-xs">Meta Title (max. 70 Zeichen)</Label>
                                    <input
                                        :value="designer.currentPageSeo.meta_title"
                                        type="text"
                                        maxlength="70"
                                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Seitentitel für Suchmaschinen"
                                        @blur="(e) => designer.setPageSeo(designer.currentPageSlug, { meta_title: (e.target as HTMLInputElement).value })"
                                    >
                                    <p class="text-muted-foreground text-xs">{{ (designer.currentPageSeo.meta_title ?? '').length }}/70</p>
                                </div>
                                <div class="space-y-1">
                                    <Label class="text-xs">Meta Description (max. 160 Zeichen)</Label>
                                    <textarea
                                        :value="designer.currentPageSeo.meta_description"
                                        rows="2"
                                        maxlength="160"
                                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Kurzbeschreibung für Suchergebnisse"
                                        @blur="(e) => designer.setPageSeo(designer.currentPageSlug, { meta_description: (e.target as HTMLTextAreaElement).value })"
                                    />
                                    <p class="text-muted-foreground text-xs">{{ (designer.currentPageSeo.meta_description ?? '').length }}/160</p>
                                </div>
                                <div class="space-y-1">
                                    <Label class="text-xs">Robots</Label>
                                    <Select
                                        :model-value="designer.currentPageSeo.robots ?? 'index, follow'"
                                        class="h-9 w-full text-sm"
                                        @update:model-value="(v: string | number) => designer.setPageSeo(designer.currentPageSlug, { robots: String(v) })"
                                    >
                                        <option value="index, follow">
                                            index, follow
                                        </option>
                                        <option value="noindex, nofollow">
                                            noindex, nofollow
                                        </option>
                                        <option value="noindex, follow">
                                            noindex, follow
                                        </option>
                                        <option value="index, nofollow">
                                            index, nofollow
                                        </option>
                                    </Select>
                                </div>
                                <div class="space-y-1">
                                    <Label class="text-xs">OG Title</Label>
                                    <input
                                        :value="designer.currentPageSeo.og_title"
                                        type="text"
                                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Titel für Social Media (optional)"
                                        @blur="(e) => designer.setPageSeo(designer.currentPageSlug, { og_title: (e.target as HTMLInputElement).value })"
                                    >
                                </div>
                                <div class="space-y-1">
                                    <Label class="text-xs">OG Description</Label>
                                    <textarea
                                        :value="designer.currentPageSeo.og_description"
                                        rows="2"
                                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Beschreibung für Social Media (optional)"
                                        @blur="(e) => designer.setPageSeo(designer.currentPageSlug, { og_description: (e.target as HTMLTextAreaElement).value })"
                                    />
                                </div>
                                <div class="space-y-1">
                                    <Label class="text-xs">OG Image URL</Label>
                                    <input
                                        :value="designer.currentPageSeo.og_image"
                                        type="url"
                                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Bild-URL für Social Media (optional)"
                                        @blur="(e) => designer.setPageSeo(designer.currentPageSlug, { og_image: (e.target as HTMLInputElement).value })"
                                    >
                                </div>
                                <p class="text-muted-foreground text-xs font-medium">
                                    Twitter Card (optional, sonst Fallback auf OG)
                                </p>
                                <div class="space-y-1">
                                    <Label class="text-xs">Twitter Card Typ</Label>
                                    <Select
                                        :model-value="designer.currentPageSeo.twitter_card ?? ''"
                                        class="h-9 w-full text-sm"
                                        @update:model-value="(v: string | number) => designer.setPageSeo(designer.currentPageSlug, { twitter_card: v ? String(v) : undefined })"
                                    >
                                        <option value="">
                                            (OG Fallback)
                                        </option>
                                        <option value="summary_large_image">
                                            summary_large_image
                                        </option>
                                        <option value="summary">
                                            summary
                                        </option>
                                        <option value="player">
                                            player
                                        </option>
                                    </Select>
                                </div>
                                <div class="space-y-1">
                                    <Label class="text-xs">Twitter Title</Label>
                                    <input
                                        :value="designer.currentPageSeo.twitter_title"
                                        type="text"
                                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Titel für Twitter (optional)"
                                        @blur="(e) => designer.setPageSeo(designer.currentPageSlug, { twitter_title: (e.target as HTMLInputElement).value })"
                                    >
                                </div>
                                <div class="space-y-1">
                                    <Label class="text-xs">Twitter Description</Label>
                                    <textarea
                                        :value="designer.currentPageSeo.twitter_description"
                                        rows="2"
                                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Beschreibung für Twitter (optional)"
                                        @blur="(e) => designer.setPageSeo(designer.currentPageSlug, { twitter_description: (e.target as HTMLTextAreaElement).value })"
                                    />
                                </div>
                                <div class="space-y-1">
                                    <Label class="text-xs">Twitter Image URL</Label>
                                    <input
                                        :value="designer.currentPageSeo.twitter_image"
                                        type="url"
                                        class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        placeholder="Bild-URL für Twitter (optional)"
                                        @blur="(e) => designer.setPageSeo(designer.currentPageSlug, { twitter_image: (e.target as HTMLInputElement).value })"
                                    >
                                </div>
                                <div class="space-y-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        class="w-full gap-2"
                                        :disabled="aiSeoLoading"
                                        @click="onOptimizeSeo"
                                    >
                                        <Sparkles v-if="!aiSeoLoading" class="h-3.5 w-3.5" />
                                        <span v-else class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        Mit KI optimieren
                                    </Button>
                                    <Alert v-if="aiSeoError" variant="destructive" class="py-2">
                                        <AlertTitle class="text-xs">Fehler</AlertTitle>
                                        <AlertDescription class="text-xs">
                                            {{ aiSeoError }}
                                            <Link v-if="aiSeoError?.includes('Token')" :href="billing.index.url()" class="ml-1 underline">
                                                Tokens aufladen
                                            </Link>
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div v-show="designer.leftSidebarTab === 'einstellungen'" class="space-y-3" role="tabpanel">
                        <Card v-if="designer.props.site && !designer.isTemplateMode">
                            <CardHeader class="pb-2">
                                <CardTitle class="text-sm">Autosave</CardTitle>
                                <CardDescription class="text-xs">Entwurf automatisch alle 30 Sekunden speichern.</CardDescription>
                            </CardHeader>
                            <CardContent class="pt-0">
                                <div class="flex items-center justify-between">
                                    <Label class="text-sm">Autosave aktiv</Label>
                                    <Switch
                                        :model-value="designer.autosaveEnabled"
                                        @update:model-value="(v: boolean) => (designer.autosaveEnabled = v)"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div v-show="designer.leftSidebarTab === 'medien'" class="space-y-3" role="tabpanel">
                        <Card v-if="designer.props.site">
                            <CardHeader class="pb-2">
                                <CardTitle class="text-sm">Media Library</CardTitle>
                                <CardDescription class="text-xs">Bilder und Dateien.</CardDescription>
                            </CardHeader>
                            <CardContent class="pt-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    class="w-full"
                                    @click="designer.mediaLibraryOpen = true"
                                >
                                    <ImageIcon class="mr-2 h-4 w-4" />
                                    Media Library öffnen
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    <div v-show="designer.leftSidebarTab === 'design'" class="space-y-3" role="tabpanel">
                        <template v-if="designer.designSection === null">
                            <p class="text-muted-foreground text-xs">Wählen Sie einen Bereich.</p>
                            <div class="space-y-4">
                                <div>
                                    <p class="mb-2 font-medium uppercase tracking-wide text-muted-foreground text-xs">Stil</p>
                                    <div class="space-y-1">
                                        <button
                                            type="button"
                                            class="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 text-left transition-colors hover:border-primary hover:bg-muted/50"
                                            @click="designer.designSection = 'farben'"
                                        >
                                            <Palette class="h-5 w-5 shrink-0 text-muted-foreground" />
                                            <span class="font-medium">Farben</span>
                                        </button>
                                        <button
                                            type="button"
                                            class="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 text-left transition-colors hover:border-primary hover:bg-muted/50"
                                            @click="designer.designSection = 'schriftarten'"
                                        >
                                            <Type class="h-5 w-5 shrink-0 text-muted-foreground" />
                                            <span class="font-medium">Schriftarten</span>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p class="mb-2 font-medium uppercase tracking-wide text-muted-foreground text-xs">UI-Kit</p>
                                    <div class="space-y-1">
                                        <button
                                            type="button"
                                            class="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 text-left transition-colors hover:border-primary hover:bg-muted/50"
                                            @click="designer.designSection = 'button'"
                                        >
                                            <Square class="h-5 w-5 shrink-0 text-muted-foreground" />
                                            <span class="font-medium">Button</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="designer.designSection === 'farben'">
                            <input
                                :ref="(el) => { if (el) designer.colorInputRef = el as HTMLInputElement; }"
                                type="color"
                                class="pointer-events-none absolute h-0 w-0 opacity-0"
                                aria-hidden="true"
                                @input="designer.onColorInput"
                            />
                            <Card>
                                <CardHeader class="pb-2">
                                    <CardTitle class="text-sm">Aktive Farben</CardTitle>
                                    <CardDescription class="text-xs">Klick auf einen Kreis zum Ändern.</CardDescription>
                                </CardHeader>
                                <CardContent class="pt-0">
                                    <div class="flex flex-wrap items-center gap-1">
                                        <button
                                            v-for="(key, idx) in COLOR_KEYS"
                                            :key="key"
                                            type="button"
                                            class="-ml-2 h-10 w-10 shrink-0 rounded-full border-2 border-border shadow-md transition-transform first:ml-0 hover:scale-110"
                                            :style="{ backgroundColor: designer.activeColors[key] || '#ccc', zIndex: COLOR_KEYS.length - idx }"
                                            :title="key"
                                            @click="designer.openColorPicker(key)"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader class="pb-2">
                                    <CardTitle class="text-sm">Farbpaletten</CardTitle>
                                    <CardDescription class="text-xs">Palette wählen, um sie zu übernehmen.</CardDescription>
                                </CardHeader>
                                <CardContent class="pt-0">
                                    <div class="max-h-64 space-y-2 overflow-y-auto">
                                        <button
                                            v-for="(palette, pIdx) in COLOR_PALETTE_PRESETS"
                                            :key="pIdx"
                                            type="button"
                                            class="flex w-full items-center gap-0 rounded-lg border-2 border-transparent px-2 py-2 transition-colors hover:border-primary hover:bg-muted/50"
                                            @click="designer.setPageColors(palette)"
                                        >
                                            <span
                                                v-for="(colorKey, cIdx) in COLOR_KEYS"
                                                :key="cIdx"
                                                class="-ml-2 h-6 w-6 shrink-0 rounded-full border border-border first:ml-0"
                                                :style="{ backgroundColor: palette[colorKey], zIndex: COLOR_KEYS.length - cIdx }"
                                            />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </template>
                        <template v-else-if="designer.designSection === 'schriftarten'">
                            <Card v-if="designer.activeGlobalFonts.heading || designer.activeGlobalFonts.body" class="mb-4">
                                <CardHeader class="pb-2">
                                    <CardTitle class="text-sm">Vorschau</CardTitle>
                                    <CardDescription class="text-xs">Aktuelle Kombination.</CardDescription>
                                </CardHeader>
                                <CardContent class="pt-0">
                                    <p
                                        class="text-lg font-semibold"
                                        :style="{ fontFamily: (designer.activeGlobalFonts.heading as string) || 'inherit' }"
                                    >
                                        Überschrift Beispiel
                                    </p>
                                    <p
                                        class="mt-1 text-base text-muted-foreground"
                                        :style="{ fontFamily: (designer.activeGlobalFonts.body as string) || 'inherit' }"
                                    >
                                        The quick brown fox jumps over the lazy dog.
                                    </p>
                                </CardContent>
                            </Card>
                            <div class="space-y-4">
                                <div>
                                    <p class="mb-2 font-medium uppercase tracking-wide text-muted-foreground text-xs">Überschriften</p>
                                    <div class="grid gap-2">
                                        <button
                                            v-for="opt in designer.FONT_OPTIONS"
                                            :key="'h-' + (opt.value || 'default')"
                                            type="button"
                                            class="rounded-lg border-2 p-3 text-left transition-colors"
                                            :class="(designer.activeGlobalFonts.heading ?? '') === opt.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30'"
                                            @click="designer.setPageGlobalFonts({ heading: opt.value === '' ? undefined : opt.value })"
                                        >
                                            <p class="text-muted-foreground text-xs">{{ opt.label }}</p>
                                            <p class="mt-1 text-lg font-semibold" :style="{ fontFamily: opt.value || 'inherit' }">
                                                Überschrift
                                            </p>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p class="mb-2 font-medium uppercase tracking-wide text-muted-foreground text-xs">Fließtext</p>
                                    <div class="grid gap-2">
                                        <button
                                            v-for="opt in designer.FONT_OPTIONS"
                                            :key="'b-' + (opt.value || 'default')"
                                            type="button"
                                            class="rounded-lg border-2 p-3 text-left transition-colors"
                                            :class="(designer.activeGlobalFonts.body ?? '') === opt.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30'"
                                            @click="designer.setPageGlobalFonts({ body: opt.value === '' ? undefined : opt.value })"
                                        >
                                            <p class="text-muted-foreground text-xs">{{ opt.label }}</p>
                                            <p class="mt-1 text-base" :style="{ fontFamily: opt.value || 'inherit' }">
                                                The quick brown fox.
                                            </p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="designer.designSection === 'button'">
                            <Card class="mb-4">
                                <CardHeader class="pb-2">
                                    <CardTitle class="text-sm">So sieht Ihr Button aus</CardTitle>
                                    <CardDescription class="text-xs">Live-Vorschau mit aktuellen Einstellungen.</CardDescription>
                                </CardHeader>
                                <CardContent class="flex flex-wrap items-center gap-3 pt-0">
                                    <Button
                                        :variant="(designer.activeGlobalButtonStyle.variant as 'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive') || 'default'"
                                        :size="(designer.activeGlobalButtonStyle.size as 'default' | 'sm' | 'lg' | 'icon') || 'default'"
                                        :class="[
                                            designer.activeGlobalButtonStyle.radius === 'none' && 'rounded-none',
                                            designer.activeGlobalButtonStyle.radius === 'sm' && 'rounded-sm',
                                            designer.activeGlobalButtonStyle.radius === 'md' && 'rounded-md',
                                            designer.activeGlobalButtonStyle.radius === 'lg' && 'rounded-lg',
                                            designer.activeGlobalButtonStyle.radius === 'full' && 'rounded-full',
                                        ]"
                                    >
                                        Beispiel-Button
                                    </Button>
                                </CardContent>
                            </Card>
                            <div class="mb-4 flex flex-wrap gap-2">
                                <button
                                    v-for="preset in [{ v: '', l: 'Primary' }, { v: 'outline', l: 'Outline' }, { v: 'ghost', l: 'Ghost' }]"
                                    :key="preset.v"
                                    type="button"
                                    class="rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
                                    :class="(designer.activeGlobalButtonStyle.variant ?? '') === preset.v ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted/50'"
                                    @click="designer.setPageGlobalButtonStyle({ variant: preset.v === '' ? undefined : preset.v })"
                                >
                                    {{ preset.l }}
                                </button>
                            </div>
                            <Card>
                                <CardHeader class="pb-2">
                                    <CardTitle class="text-sm">Einstellungen</CardTitle>
                                </CardHeader>
                                <CardContent class="space-y-3 pt-0">
                                    <div class="space-y-1">
                                        <Label class="text-xs">Variant</Label>
                                        <Select
                                            :model-value="designer.activeGlobalButtonStyle.variant ?? ''"
                                            class="h-9 w-full text-sm"
                                            @update:model-value="(v: string | number) => designer.setPageGlobalButtonStyle({ variant: (v === '' ? undefined : String(v)) })"
                                        >
                                            <option
                                                v-for="opt in designer.BUTTON_VARIANT_OPTIONS"
                                                :key="opt.value || 'default'"
                                                :value="opt.value"
                                            >
                                                {{ opt.label }}
                                            </option>
                                        </Select>
                                    </div>
                                    <div class="space-y-1">
                                        <Label class="text-xs">Eckenradius</Label>
                                        <Select
                                            :model-value="designer.activeGlobalButtonStyle.radius ?? ''"
                                            class="h-9 w-full text-sm"
                                            @update:model-value="(v: string | number) => designer.setPageGlobalButtonStyle({ radius: (v === '' ? undefined : String(v)) })"
                                        >
                                            <option
                                                v-for="opt in designer.BUTTON_RADIUS_OPTIONS"
                                                :key="opt.value || 'default'"
                                                :value="opt.value"
                                            >
                                                {{ opt.label }}
                                            </option>
                                        </Select>
                                    </div>
                                    <div class="space-y-1">
                                        <Label class="text-xs">Größe</Label>
                                        <Select
                                            :model-value="designer.activeGlobalButtonStyle.size ?? ''"
                                            class="h-9 w-full text-sm"
                                            @update:model-value="(v: string | number) => designer.setPageGlobalButtonStyle({ size: (v === '' ? undefined : String(v)) })"
                                        >
                                            <option
                                                v-for="opt in designer.BUTTON_SIZE_OPTIONS"
                                                :key="opt.value || 'default'"
                                                :value="opt.value"
                                            >
                                                {{ opt.label }}
                                            </option>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </template>
                    </div>
                </div>
            </div>
        </Transition>
    </aside>
</template>

<style scoped>
.sidebar-panel-enter-active,
.sidebar-panel-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.sidebar-panel-enter-from,
.sidebar-panel-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}
</style>
