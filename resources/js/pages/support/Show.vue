<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import support from '@/routes/support';
import type { BreadcrumbItem } from '@/types';

type Ticket = { id: number; subject: string; status: string; created_at: string };
type TicketCategory = { id: number; name: string; slug: string } | null;
type TicketPriority = { id: number; name: string; slug: string; color: string | null } | null;
type Site = { id: number; name: string; slug: string } | null;
type Message = {
    id: number;
    body: string | null;
    is_internal: boolean;
    is_hidden?: boolean;
    created_at: string;
    user: { id: number; name: string };
};

type Props = {
    ticket: Ticket;
    ticketCategory: TicketCategory;
    ticketPriority: TicketPriority;
    site: Site;
    messages: Message[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Support', href: support.index().url },
    { title: props.ticket.subject, href: '#' },
];

const statusLabels: Record<string, string> = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    waiting_customer: 'Warte auf Kunde',
    resolved: 'Erledigt',
    closed: 'Geschlossen',
};

const form = useForm({ body: '' });
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Ticket: ${ticket.subject}`" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <Heading level="h1">{{ ticket.subject }}</Heading>
                <Link :href="support.index().url"><Button variant="outline">Zurück zur Liste</Button></Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ticket #{{ ticket.id }}</CardTitle>
                    <CardDescription>
                        Kategorie: {{ ticketCategory?.name ?? '–' }}
                        <span v-if="ticketPriority">
                            · Priorität:
                            <Badge
                                :style="ticketPriority.color ? { backgroundColor: ticketPriority.color, color: '#fff', border: 'none' } : undefined"
                            >
                                {{ ticketPriority.name }}
                            </Badge>
                        </span>
                        <span v-if="site"> · Site: {{ site.name }}</span>
                        · Status: {{ statusLabels[ticket.status] ?? ticket.status }}
                        · Erstellt: {{ new Date(ticket.created_at).toLocaleString('de-DE') }}
                    </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div v-for="msg in messages" :key="msg.id" class="rounded-lg border p-4">
                        <div class="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                            <span>{{ msg.user.name }}</span>
                            <span>{{ new Date(msg.created_at).toLocaleString('de-DE') }}</span>
                        </div>
                        <p v-if="!msg.is_hidden" class="whitespace-pre-wrap">{{ msg.body }}</p>
                        <p v-else class="italic text-muted-foreground">[ Interne Notiz – nur für Support sichtbar ]</p>
                    </div>
                </CardContent>
                <CardFooter v-if="ticket.status !== 'closed' && ticket.status !== 'resolved'">
                    <form
                        class="flex w-full flex-col gap-4"
                        @submit.prevent="form.post(support.messages.store(ticket.id).url)"
                    >
                        <div class="space-y-2">
                            <textarea
                                v-model="form.body"
                                class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Ihre Nachricht..."
                                required
                                :aria-invalid="!!form.errors.body"
                            />
                            <InputError :message="form.errors.body" />
                        </div>
                        <Button type="submit" :disabled="form.processing">Nachricht senden</Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    </AppLayout>
</template>
