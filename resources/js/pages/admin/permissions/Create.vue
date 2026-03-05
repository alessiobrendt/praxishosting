<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heading } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const form = useForm({
    key: '',
    name: '',
    label: '',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Berechtigungen', href: '/admin/permissions' },
    { title: 'Berechtigung anlegen', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Berechtigung anlegen" />

        <div class="space-y-6">
            <Heading level="h1">Berechtigung anlegen</Heading>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>Berechtigung</CardTitle>
                    <CardDescription>Key (eindeutig, z. B. admin.invoices), Name, Label</CardDescription>
                </CardHeader>
                <form @submit.prevent="form.post('/admin/permissions')">
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="key">Key</Label>
                            <Input id="key" v-model="form.key" placeholder="admin.invoices" required :aria-invalid="!!form.errors.key" />
                            <InputError :message="form.errors.key" />
                        </div>
                        <div class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input id="name" v-model="form.name" required :aria-invalid="!!form.errors.name" />
                            <InputError :message="form.errors.name" />
                        </div>
                        <div class="space-y-2">
                            <Label for="label">Label (optional)</Label>
                            <Input id="label" v-model="form.label" :aria-invalid="!!form.errors.label" />
                            <InputError :message="form.errors.label" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="form.processing">Anlegen</Button>
                        <Link href="/admin/permissions"><Button type="button" variant="outline">Abbrechen</Button></Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AdminLayout>
</template>
