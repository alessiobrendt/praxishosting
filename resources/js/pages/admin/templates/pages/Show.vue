<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/typography';
import templates from '@/routes/admin/templates';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit } from 'lucide-vue-next';

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
    page: TemplatePage;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templates.index().url },
    { title: props.template.name, href: templates.show({ template: props.template.id }).url },
    { title: 'Seiten', href: templates.pages.index({ template: props.template.id }).url },
    { title: props.page.name, href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="page.name" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">{{ page.name }}</Heading>
                    <p class="mt-2 text-muted-foreground">
                        Seite für Template: {{ template.name }}
                    </p>
                </div>
                <div class="flex gap-2">
                    <Link :href="templates.pages.index({ template: template.id }).url">
                        <Button variant="outline">
                            <ArrowLeft class="mr-2 h-4 w-4" />
                            Zurück
                        </Button>
                    </Link>
                    <div class="flex gap-2">
                        <Link :href="`/admin/templates/${template.id}/pages/${page.id}/data`">
                            <Button variant="outline">
                                <Edit class="mr-2 h-4 w-4" />
                                Daten bearbeiten
                            </Button>
                        </Link>
                        <Link :href="templates.pages.edit({ template: template.id, page: page.id }).url">
                            <Button variant="outline">
                                Einstellungen
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Grundinformationen</CardTitle>
                        <CardDescription>Basis-Details der Seite</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div>
                            <p class="text-sm text-muted-foreground">Name:</p>
                            <p class="font-medium">{{ page.name }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Slug:</p>
                            <code class="text-sm">{{ page.slug }}</code>
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Reihenfolge:</p>
                            <p class="font-medium">#{{ page.order }}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card v-if="page.data">
                    <CardHeader>
                        <CardTitle>Seiten-Daten</CardTitle>
                        <CardDescription>JSON-Daten dieser Seite</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre class="text-xs bg-muted p-3 rounded overflow-auto max-h-96">{{
                            JSON.stringify(page.data, null, 2)
                        }}</pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
