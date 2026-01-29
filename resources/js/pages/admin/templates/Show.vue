<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import templates from '@/routes/admin/templates';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Edit, Plus, FileText } from 'lucide-vue-next';

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
    is_active: boolean;
    price: string;
    colors: Record<string, string> | null;
    general_information: Record<string, string> | null;
    page_data: Record<string, unknown> | null;
    pages?: TemplatePage[];
};

type Props = {
    template: Template;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templates.index().url },
    { title: props.template.name, href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="template.name" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">{{ template.name }}</Heading>
                    <Text class="mt-2" muted>
                        Template-Details
                    </Text>
                </div>
                <div class="flex gap-2">
                    <Link :href="templates.pages.index({ template: template.id }).url">
                        <Button variant="outline">
                            <FileText class="mr-2 h-4 w-4" />
                            Seiten verwalten
                        </Button>
                    </Link>
                    <Link :href="templates.edit({ template: template.id }).url">
                        <Button variant="outline">
                            <Edit class="mr-2 h-4 w-4" />
                            Bearbeiten
                        </Button>
                    </Link>
                </div>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Grundinformationen</CardTitle>
                        <CardDescription>Basis-Details des Templates</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div>
                            <Text variant="small" muted>Slug:</Text>
                            <code class="ml-2 rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                                {{ template.slug }}
                            </code>
                        </div>
                        <div>
                            <Text variant="small" muted>Status:</Text>
                            <div class="mt-1">
                                <Badge :variant="template.is_active ? 'success' : 'error'">
                                    {{ template.is_active ? 'Aktiv' : 'Inaktiv' }}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <Text variant="small" muted>Preis:</Text>
                            <Text class="ml-2 font-medium">{{ template.price }} €</Text>
                        </div>
                    </CardContent>
                </Card>

                <Card v-if="template.colors || template.page_data">
                    <CardHeader>
                        <CardTitle>Zusätzliche Daten</CardTitle>
                        <CardDescription>Erweiterte Template-Informationen</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div v-if="template.colors">
                            <Text variant="small" class="font-medium mb-2">Farben</Text>
                            <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">{{
                                JSON.stringify(template.colors, null, 2)
                            }}</pre>
                        </div>
                        <div v-if="template.page_data">
                            <Text variant="small" class="font-medium mb-2">Page Data</Text>
                            <pre class="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-64">{{
                                JSON.stringify(template.page_data, null, 2)
                            }}</pre>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div class="flex items-center justify-between">
                        <div>
                            <CardTitle>Seiten</CardTitle>
                            <CardDescription>Seiten dieses Templates</CardDescription>
                        </div>
                        <Link :href="`/admin/templates/${template.id}/pages/create`">
                            <Button size="sm">
                                <Plus class="mr-2 h-4 w-4" />
                                Neue Seite
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div v-if="!template.pages || template.pages.length === 0" class="text-center py-8 text-muted-foreground">
                        <FileText class="mx-auto h-12 w-12 mb-2 opacity-50" />
                        <p>Noch keine Seiten vorhanden</p>
                        <Link :href="templates.pages.create({ template: template.id }).url" class="mt-4 inline-block">
                            <Button size="sm" variant="outline">
                                <Plus class="mr-2 h-4 w-4" />
                                Erste Seite hinzufügen
                            </Button>
                        </Link>
                    </div>
                    <div v-else class="space-y-2">
                        <div
                            v-for="page in template.pages"
                            :key="page.id"
                            class="flex items-center justify-between p-3 rounded-lg border border-sidebar-border hover:bg-muted/50"
                        >
                            <div class="flex items-center gap-3">
                                <span class="text-sm text-muted-foreground">#{{ page.order }}</span>
                                <div>
                                    <p class="font-medium">{{ page.name }}</p>
                                    <p class="text-sm text-muted-foreground">{{ page.slug }}</p>
                                </div>
                            </div>
                            <Link :href="templates.pages.show({ template: template.id, page: page.id }).url">
                                <Button size="sm" variant="ghost">Anzeigen</Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
