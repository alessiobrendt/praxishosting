<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const form = useForm({
    name: '',
    slug: '',
    description: '',
    sort_order: 0 as number | string,
    is_active: true,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Ticket-Kategorien', href: '/admin/ticket-categories' },
    { title: 'Neu', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Kategorie anlegen" />

        <div class="space-y-6">
            <Heading level="h1">Ticket-Kategorie anlegen</Heading>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>Kategorie</CardTitle>
                    <CardDescription>Name, Slug, Beschreibung, Sortierung</CardDescription>
                </CardHeader>
                <form @submit.prevent="form.post('/admin/ticket-categories')">
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input id="name" v-model="form.name" required :aria-invalid="!!form.errors.name" />
                            <InputError :message="form.errors.name" />
                        </div>
                        <div class="space-y-2">
                            <Label for="slug">Slug</Label>
                            <Input id="slug" v-model="form.slug" required :aria-invalid="!!form.errors.slug" />
                            <InputError :message="form.errors.slug" />
                        </div>
                        <div class="space-y-2">
                            <Label for="description">Beschreibung (optional)</Label>
                            <textarea
                                id="description"
                                v-model="form.description"
                                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="sort_order">Sortierung</Label>
                            <Input id="sort_order" v-model="form.sort_order" type="number" min="0" />
                        </div>
                        <div class="flex items-center gap-2">
                            <Switch id="is_active" :checked="form.is_active" @update:checked="(v: boolean) => (form.is_active = v)" />
                            <Label for="is_active">Aktiv</Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="form.processing">Anlegen</Button>
                        <Link href="/admin/ticket-categories"><Button type="button" variant="outline">Abbrechen</Button></Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AppLayout>
</template>
