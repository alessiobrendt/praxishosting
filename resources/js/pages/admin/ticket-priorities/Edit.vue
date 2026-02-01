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

type TicketPriority = {
    id: number;
    name: string;
    slug: string;
    color: string | null;
    sort_order: number;
    is_active: boolean;
};

type Props = { ticketPriority: TicketPriority };

const props = defineProps<Props>();

const form = useForm({
    name: props.ticketPriority.name,
    slug: props.ticketPriority.slug,
    color: props.ticketPriority.color ?? '',
    sort_order: props.ticketPriority.sort_order,
    is_active: props.ticketPriority.is_active,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Ticket-Prioritäten', href: '/admin/ticket-priorities' },
    { title: props.ticketPriority.name, href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Priorität: ${ticketPriority.name}`" />

        <div class="space-y-6">
            <Heading level="h1">Priorität bearbeiten</Heading>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>{{ ticketPriority.name }}</CardTitle>
                </CardHeader>
                <form @submit.prevent="form.put(`/admin/ticket-priorities/${ticketPriority.id}`)">
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
                            <Label for="color">Farbe (optional)</Label>
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
                        <Button type="submit" :disabled="form.processing">Speichern</Button>
                        <Link href="/admin/ticket-priorities"><Button type="button" variant="outline">Abbrechen</Button></Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AppLayout>
</template>
