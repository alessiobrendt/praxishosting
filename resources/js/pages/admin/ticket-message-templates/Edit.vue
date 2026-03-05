<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heading } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Template = {
    id: number;
    name: string;
    body: string | null;
    sort_order: number;
};

type Props = { template: Template };

const props = defineProps<Props>();

const form = useForm({
    name: props.template.name,
    body: props.template.body ?? '',
    sort_order: props.template.sort_order,
});

const settingsVorlagenUrl = '/admin/settings?tab=vorlagen';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Einstellungen', href: '/admin/settings' },
    { title: props.template.name, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Vorlage: ${template.name}`" />

        <div class="space-y-6">
            <Heading level="h1">Vorlage bearbeiten</Heading>

            <Card class="w-full">
                <CardHeader>
                    <CardTitle>{{ template.name }}</CardTitle>
                    <CardDescription>
                        Platzhalter:
                        <span v-pre>{{name}}, {{email}}, {{ticket_id}}, {{betreff}}, {{produkt}}, {{zugewiesen}}, {{datum}}</span>
                    </CardDescription>
                </CardHeader>
                <form @submit.prevent="form.put(`/admin/ticket-message-templates/${template.id}`)">
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input id="name" v-model="form.name" required :aria-invalid="!!form.errors.name" />
                            <InputError :message="form.errors.name" />
                        </div>
                        <div class="space-y-2">
                            <Label for="body">Inhalt (HTML erlaubt)</Label>
                            <Textarea id="body" v-model="form.body" class="min-h-[160px]" :aria-invalid="!!form.errors.body" />
                            <InputError :message="form.errors.body" />
                        </div>
                        <div class="space-y-2">
                            <Label for="sort_order">Sortierung</Label>
                            <Input id="sort_order" v-model="form.sort_order" type="number" min="0" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="form.processing">Speichern</Button>
                        <Link :href="settingsVorlagenUrl"><Button type="button" variant="outline">Abbrechen</Button></Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AdminLayout>
</template>
