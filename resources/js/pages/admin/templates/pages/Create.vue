<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import TemplatePageController from '@/actions/App/Http/Controllers/Admin/TemplatePageController';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/typography';
import InputError from '@/components/InputError.vue';
import templates from '@/routes/admin/templates';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft } from 'lucide-vue-next';

type Template = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    template: Template;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templates.index().url },
    { title: props.template.name, href: templates.show({ template: props.template.id }).url },
    { title: 'Seiten', href: templates.pages.index({ template: props.template.id }).url },
    { title: 'Neue Seite', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Neue Seite: ${template.name}`" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <Heading level="h1">Neue Seite</Heading>
                <Link :href="`/admin/templates/${template.id}/pages`">
                    <Button variant="outline">
                        <ArrowLeft class="mr-2 h-4 w-4" />
                        Zurück
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Seiten-Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form
                        :key="template.id"
                        v-bind="
                            TemplatePageController.store.form({
                                template: template.id,
                            })
                        "
                        class="space-y-6"
                        v-slot="{ errors }"
                    >
                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="z. B. Startseite"
                            />
                            <InputError :message="errors.name" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="slug">Slug</Label>
                            <Input
                                id="slug"
                                name="slug"
                                required
                                placeholder="startseite"
                            />
                            <InputError :message="errors.slug" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="order">Reihenfolge</Label>
                            <Input
                                id="order"
                                name="order"
                                type="number"
                                :default-value="0"
                                min="0"
                            />
                            <InputError :message="errors.order" />
                        </div>
                        <div class="flex gap-2">
                            <Button type="submit">Seite erstellen</Button>
                            <Link :href="templates.pages.index({ template: template.id }).url">
                                <Button type="button" variant="outline"
                                    >Abbrechen</Button
                                >
                            </Link>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
