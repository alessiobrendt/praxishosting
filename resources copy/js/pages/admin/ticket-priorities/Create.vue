<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Heading } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const form = useForm({
    name: '',
    slug: '',
    color: '',
    sort_order: 0 as number | string,
    is_active: true,
});

const settingsSupportUrl = '/admin/settings?tab=support';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Einstellungen', href: '/admin/settings' },
    { title: 'Priorität anlegen', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Priorität anlegen" />

        <div class="space-y-6">
            <Heading level="h1">Ticket-Priorität anlegen</Heading>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>Priorität</CardTitle>
                    <CardDescription>Name, Slug, Farbe (z. B. #ff0000), Sortierung</CardDescription>
                </CardHeader>
                <form @submit.prevent="form.post('/admin/ticket-priorities')">
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
                            <Label for="color">Farbe (optional, z. B. #3b82f6)</Label>
                            <Input id="color" v-model="form.color" type="text" placeholder="#3b82f6" />
                            <InputError :message="form.errors.color" />
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
                        <Link :href="settingsSupportUrl"><Button type="button" variant="outline">Abbrechen</Button></Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AdminLayout>
</template>
