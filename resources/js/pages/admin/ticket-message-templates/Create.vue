<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const form = useForm({
    name: '',
    body: '',
    sort_order: 0 as number | string,
});

const settingsVorlagenUrl = '/admin/settings?tab=vorlagen';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Einstellungen', href: '/admin/settings' },
    { title: 'Vorlage anlegen', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Vorlage anlegen" />

        <div class="space-y-6">
            <Heading level="h1">Antwort-Vorlage anlegen</Heading>

            <Card class="w-full">
                <CardHeader>
                    <CardTitle>Vorlage</CardTitle>
                    <CardDescription>
                        Name und Inhalt. Platzhalter:
                        <span v-pre>{{name}}, {{email}}, {{ticket_id}}, {{betreff}}, {{produkt}}, {{zugewiesen}}, {{datum}}</span>
                    </CardDescription>
                </CardHeader>
                <form @submit.prevent="form.post('/admin/ticket-message-templates')">
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input id="name" v-model="form.name" required placeholder="z. B. Begrüßung" :aria-invalid="!!form.errors.name" />
                            <InputError :message="form.errors.name" />
                        </div>
                        <div class="space-y-2">
                            <Label for="body">Inhalt (HTML erlaubt)</Label>
                            <Textarea
                                id="body"
                                v-model="form.body"
                                class="min-h-[160px]"
                                placeholder="z. B. Hallo {{name}},&#10;&#10;vielen Dank für Ihre Anfrage (Ticket #{{ticket_id}})."
                                :aria-invalid="!!form.errors.body"
                            />
                            <InputError :message="form.errors.body" />
                        </div>
                        <div class="space-y-2">
                            <Label for="sort_order">Sortierung</Label>
                            <Input id="sort_order" v-model="form.sort_order" type="number" min="0" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="form.processing">Anlegen</Button>
                        <Link :href="settingsVorlagenUrl"><Button type="button" variant="outline">Abbrechen</Button></Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AdminLayout>
</template>
