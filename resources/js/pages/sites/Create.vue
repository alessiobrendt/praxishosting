<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import { store as sitesStore } from '@/routes/sites';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { index as sitesIndex } from '@/routes/sites';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Template = {
    id: number;
    name: string;
    slug: string;
    price: string;
};

type Props = {
    template: Template | null;
    templates: Template[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Sites', href: sitesIndex().url },
    { title: 'Neue Site', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Neue Site erstellen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Neue Site erstellen</Heading>
                <Text class="mt-2" muted>
                    Wählen Sie ein Template und geben Sie einen Namen ein
                </Text>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Site-Details</CardTitle>
                    <CardDescription>Geben Sie die Informationen für Ihre neue Site ein</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form
                        :action="sitesStore.url()"
                        method="post"
                        class="space-y-6"
                        v-slot="{ errors }"
                    >
                        <input
                            v-if="template"
                            type="hidden"
                            name="template_id"
                            :value="template.id"
                        />
                        <div class="space-y-2">
                            <Label for="template_id">Template</Label>
                            <Select
                                id="template_id"
                                name="template_id"
                                required
                                :aria-invalid="!!errors.template_id"
                            >
                                <option value="">Bitte wählen...</option>
                                <option
                                    v-for="t in templates"
                                    :key="t.id"
                                    :value="t.id"
                                    :selected="template?.id === t.id"
                                >
                                    {{ t.name }} ({{ t.price }} €)
                                </option>
                            </Select>
                            <InputError :message="errors.template_id" />
                        </div>
                        <div class="space-y-2">
                            <Label for="name">Name der Site</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="z. B. Praxis Mustermann"
                                :aria-invalid="!!errors.name"
                            />
                            <InputError :message="errors.name" />
                        </div>
                        <CardFooter class="px-0 pb-0">
                            <div class="flex gap-2">
                                <Button type="submit">Zur Kasse</Button>
                                <Link :href="sitesIndex().url">
                                    <Button type="button" variant="outline">Abbrechen</Button>
                                </Link>
                            </div>
                        </CardFooter>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
