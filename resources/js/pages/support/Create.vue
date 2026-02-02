<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import { index as supportIndex, store } from '@/routes/support';
import type { BreadcrumbItem } from '@/types';

type Site = { uuid: string; name: string; slug: string };
type Category = { id: number; name: string; slug: string };
type Priority = { id: number; name: string; slug: string; color: string | null };

type Props = {
    sites: Site[];
    categories: Category[];
    priorities: Priority[];
};

defineProps<Props>();

const form = useForm({
    subject: '',
    body: '',
    ticket_category_id: '' as string | number,
    ticket_priority_id: '' as string | number,
    site_uuid: '' as string,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Support', href: supportIndex().url },
    { title: 'Neues Ticket', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Neues Ticket" />

        <div class="space-y-6">
            <Heading level="h1">Neues Ticket</Heading>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>Support-Anfrage</CardTitle>
                    <CardDescription>Beschreiben Sie Ihr Anliegen. Wir melden uns bei Ihnen.</CardDescription>
                </CardHeader>
                <form @submit.prevent="form.post(store().url)">
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="subject">Betreff</Label>
                            <Input id="subject" v-model="form.subject" required :aria-invalid="!!form.errors.subject" />
                            <InputError :message="form.errors.subject" />
                        </div>
                        <div class="space-y-2">
                            <Label for="ticket_category_id">Kategorie</Label>
                            <Select id="ticket_category_id" v-model="form.ticket_category_id" required>
                                <option value="">Bitte wählen</option>
                                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                            </Select>
                            <InputError :message="form.errors.ticket_category_id" />
                        </div>
                        <div v-if="priorities.length" class="space-y-2">
                            <Label for="ticket_priority_id">Priorität (optional)</Label>
                            <Select id="ticket_priority_id" v-model="form.ticket_priority_id">
                                <option value="">–</option>
                                <option v-for="p in priorities" :key="p.id" :value="p.id">{{ p.name }}</option>
                            </Select>
                        </div>
                        <div v-if="sites.length" class="space-y-2">
                            <Label for="site_uuid">Betrifft Website (optional)</Label>
                            <Select id="site_uuid" v-model="form.site_uuid">
                                <option value="">–</option>
                                <option v-for="s in sites" :key="s.uuid" :value="s.uuid">{{ s.name }}</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label for="body">Nachricht</Label>
                            <textarea
                                id="body"
                                v-model="form.body"
                                class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                :aria-invalid="!!form.errors.body"
                            />
                            <InputError :message="form.errors.body" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="form.processing">Ticket erstellen</Button>
                        <Link :href="supportIndex().url"><Button type="button" variant="outline">Abbrechen</Button></Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AppLayout>
</template>
