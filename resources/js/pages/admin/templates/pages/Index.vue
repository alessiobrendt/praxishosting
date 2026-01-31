<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/typography';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import JsonViewer from '@/components/JsonViewer.vue';
import templates from '@/routes/admin/templates';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { getTemplateEntry } from '@/templates/template-registry';
import { Plus, ArrowLeft, FileText, ChevronDown, Layout } from 'lucide-vue-next';
import { computed } from 'vue';

type TemplatePage = {
    id: number;
    name: string;
    slug: string;
    order: number;
    data: Record<string, unknown> | null;
};

type Template = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    template: Template;
    pages: TemplatePage[];
};

const props = defineProps<Props>();

const hasPageDesigner = computed(
    () => getTemplateEntry(props.template.slug)?.getComponentRegistry != null,
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templates.index().url },
    { title: props.template.name, href: templates.show({ template: props.template.id }).url },
    { title: 'Seiten', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Seiten: ${template.name}`" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">Seiten</Heading>
                    <p class="mt-2 text-muted-foreground">
                        Seiten dieses Templates: {{ template.name }}
                    </p>
                </div>
                <div class="flex gap-2">
                    <Link :href="templates.show({ template: template.id }).url">
                        <Button variant="outline">
                            <ArrowLeft class="mr-2 h-4 w-4" />
                            Zurück
                        </Button>
                    </Link>
                    <Link v-if="hasPageDesigner" :href="templates.design({ template: template.id }).url">
                        <Button>
                            <Layout class="mr-2 h-4 w-4" />
                            Standard-Seiten designen
                        </Button>
                    </Link>
                    <Link :href="templates.pages.create({ template: template.id }).url">
                        <Button>
                            <Plus class="mr-2 h-4 w-4" />
                            Neue Seite
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Seiten dieses Templates</CardTitle>
                    <CardDescription>
                        Standardseiten dieser Vorlage. Kunden erhalten diese beim Kauf; hier legen Sie Inhalt und Reihenfolge fest.
                    </CardDescription>
                </CardHeader>
                <CardContent class="p-0 pt-0">
                    <div v-if="pages.length === 0" class="text-center py-12 text-muted-foreground">
                        <FileText class="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p class="mb-4">Noch keine Seiten vorhanden</p>
                        <Link :href="templates.pages.create({ template: template.id }).url">
                            <Button>
                                <Plus class="mr-2 h-4 w-4" />
                                Erste Seite hinzufügen
                            </Button>
                        </Link>
                    </div>
                    <div v-else class="divide-y divide-sidebar-border">
                        <div
                            v-for="page in pages"
                            :key="page.id"
                            class="p-4 hover:bg-muted/50 transition-colors space-y-4"
                        >
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <span class="text-sm text-muted-foreground font-mono w-8">
                                        #{{ page.order }}
                                    </span>
                                    <div>
                                        <p class="font-medium">{{ page.name }}</p>
                                        <p class="text-sm text-muted-foreground">{{ page.slug }}</p>
                                    </div>
                                </div>
                                <Link :href="templates.pages.show({ template: template.id, page: page.id }).url">
                                    <Button size="sm" variant="ghost">Anzeigen</Button>
                                </Link>
                            </div>
                            <Collapsible v-if="page.data" class="mt-4">
                                <CollapsibleTrigger class="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    <ChevronDown class="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                    <span>Seiten-Daten</span>
                                    <span class="text-xs ml-1">(JSON-Daten dieser Seite)</span>
                                </CollapsibleTrigger>
                                <CollapsibleContent class="mt-3">
                                    <JsonViewer :value="page.data" max-height="300px" />
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
