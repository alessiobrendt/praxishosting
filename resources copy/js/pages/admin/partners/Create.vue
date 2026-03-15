<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Heading } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Brand = { id: number; key: string; name: string };
type User = { id: number; name: string; email: string };

type Props = { brands: Brand[]; users: User[] };

defineProps<Props>();

const form = useForm({
    brand_id: '' as number | '',
    name: '',
    description: '',
    image: null as File | null,
    user_id: '' as number | '',
    discount_percent: '0',
    expires_at: '',
    is_active: true,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Partner', href: '/admin/partners' },
    { title: 'Neu', href: '#' },
];

function onImageChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    form.image = target.files?.[0] ?? null;
}

function submit(): void {
    form.post('/admin/partners', { forceFormData: true });
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Partner anlegen" />

        <div class="space-y-6">
            <Heading level="h1">Partner anlegen</Heading>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>Partner</CardTitle>
                    <CardDescription>Brand, Name, Beschreibung, Bild, Nutzer, Rabatt %, Ablaufdatum, Aktiv</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="space-y-2">
                        <Label for="brand_id">Brand</Label>
                        <Select id="brand_id" v-model="form.brand_id" required :aria-invalid="!!form.errors.brand_id">
                            <option value="">Bitte wählen</option>
                            <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                        </Select>
                        <InputError :message="form.errors.brand_id" />
                    </div>
                    <div class="space-y-2">
                        <Label for="name">Name</Label>
                        <Input id="name" v-model="form.name" required :aria-invalid="!!form.errors.name" />
                        <InputError :message="form.errors.name" />
                    </div>
                    <div class="space-y-2">
                        <Label for="description">Beschreibung</Label>
                        <Textarea id="description" v-model="form.description" rows="3" :aria-invalid="!!form.errors.description" />
                        <InputError :message="form.errors.description" />
                    </div>
                    <div class="space-y-2">
                        <Label for="image">Bild (optional, max. 2 MB)</Label>
                        <Input id="image" type="file" accept="image/*" :aria-invalid="!!form.errors.image" @change="onImageChange" />
                        <InputError :message="form.errors.image" />
                    </div>
                    <div class="space-y-2">
                        <Label for="user_id">Nutzer (optional)</Label>
                        <Select id="user_id" v-model="form.user_id" :aria-invalid="!!form.errors.user_id">
                            <option value="">– Keiner –</option>
                            <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }} ({{ u.email }})</option>
                        </Select>
                        <InputError :message="form.errors.user_id" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="discount_percent">Rabatt %</Label>
                            <Input id="discount_percent" v-model="form.discount_percent" type="number" step="0.01" min="0" max="100" :aria-invalid="!!form.errors.discount_percent" />
                            <InputError :message="form.errors.discount_percent" />
                        </div>
                        <div class="space-y-2">
                            <Label for="expires_at">Ablaufdatum (optional)</Label>
                            <Input id="expires_at" v-model="form.expires_at" type="date" :aria-invalid="!!form.errors.expires_at" />
                            <InputError :message="form.errors.expires_at" />
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <Switch id="is_active" v-model="form.is_active" />
                        <Label for="is_active">Aktiv</Label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="button" @click="submit" :disabled="form.processing">Anlegen</Button>
                    <Link href="/admin/partners"><Button variant="outline">Abbrechen</Button></Link>
                </CardFooter>
            </Card>
        </div>
    </AdminLayout>
</template>
