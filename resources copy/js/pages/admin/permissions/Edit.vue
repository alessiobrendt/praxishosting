<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heading } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; key: string; name: string; label: string | null };

type Props = { permission: Permission };

const props = defineProps<Props>();

const form = useForm({
    key: props.permission.key,
    name: props.permission.name,
    label: props.permission.label ?? '',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Berechtigungen', href: '/admin/permissions' },
    { title: props.permission.key, href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Berechtigung: ${permission.key}`" />

        <div class="space-y-6">
            <Heading level="h1">Berechtigung bearbeiten</Heading>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>{{ permission.key }}</CardTitle>
                </CardHeader>
                <form @submit.prevent="form.put(`/admin/permissions/${permission.id}`)">
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="key">Key</Label>
                            <Input id="key" v-model="form.key" required :aria-invalid="!!form.errors.key" />
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
                        <Button type="submit" :disabled="form.processing">Speichern</Button>
                        <Link href="/admin/permissions"><Button type="button" variant="outline">Abbrechen</Button></Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AdminLayout>
</template>
