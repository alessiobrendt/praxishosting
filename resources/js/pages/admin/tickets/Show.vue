<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import adminTickets from '@/routes/admin/tickets';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email?: string };
type Site = { id: number; name: string; slug: string };
type TicketCategory = { id: number; name: string; slug: string };
type TicketPriority = { id: number; name: string; slug: string; color: string | null };
type Message = {
    id: number;
    body: string;
    is_internal: boolean;
    created_at: string;
    user: User;
};

type Ticket = {
    id: number;
    subject: string;
    status: string;
    user_id: number;
    site_id: number | null;
    ticket_category_id: number;
    ticket_priority_id: number | null;
    assigned_to: number | null;
    created_at: string;
    user?: User;
    ticket_category?: TicketCategory;
    ticket_priority?: TicketPriority | null;
    site?: Site | null;
    assignedTo?: User | null;
    messages?: Message[];
};

type Props = {
    ticket: Ticket;
    categories: TicketCategory[];
    priorities: TicketPriority[];
    admins: User[];
    customerSites: Site[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Tickets', href: '/admin/tickets' },
    { title: `#${props.ticket.id}`, href: '#' },
];

const statusLabels: Record<string, string> = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    waiting_customer: 'Warte auf Kunde',
    resolved: 'Erledigt',
    closed: 'Geschlossen',
};

const updateForm = useForm({
    status: props.ticket.status,
    ticket_category_id: props.ticket.ticket_category_id,
    ticket_priority_id: props.ticket.ticket_priority_id ?? '',
    assigned_to: props.ticket.assigned_to ?? '',
    site_id: props.ticket.site_id ?? '',
});

const messageForm = useForm({ body: '', is_internal: false });
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Ticket #${ticket.id}: ${ticket.subject}`" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <Heading level="h1">Ticket #{{ ticket.id }}: {{ ticket.subject }}</Heading>
                <Link :href="adminTickets.index().url"><Button variant="outline">Zurück zur Liste</Button></Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ticket bearbeiten</CardTitle>
                    <CardDescription>Status, Kategorie, Priorität, Zuweisung, Produkt/Site</CardDescription>
                </CardHeader>
                <form @submit.prevent="updateForm.put(adminTickets.update(ticket.id).url)">
                    <CardContent class="space-y-4">
                        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div class="space-y-2">
                                <Label>Status</Label>
                                <Select v-model="updateForm.status" name="status">
                                    <option v-for="(label, key) in statusLabels" :key="key" :value="key">{{ label }}</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label>Kategorie</Label>
                                <Select v-model="updateForm.ticket_category_id" name="ticket_category_id">
                                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label>Priorität</Label>
                                <Select v-model="updateForm.ticket_priority_id" name="ticket_priority_id">
                                    <option value="">–</option>
                                    <option v-for="p in priorities" :key="p.id" :value="p.id">{{ p.name }}</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label>Zugewiesen an</Label>
                                <Select v-model="updateForm.assigned_to" name="assigned_to">
                                    <option value="">–</option>
                                    <option v-for="a in admins" :key="a.id" :value="a.id">{{ a.name }}</option>
                                </Select>
                            </div>
                        </div>
                        <div v-if="customerSites.length" class="space-y-2">
                            <Label>Produkt/Site</Label>
                            <Select v-model="updateForm.site_id" name="site_id">
                                <option value="">–</option>
                                <option v-for="s in customerSites" :key="s.id" :value="s.id">{{ s.name }}</option>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="updateForm.processing">Speichern</Button>
                    </CardFooter>
                </form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Kunde</CardTitle>
                    <CardDescription>
                        {{ ticket.user?.name }} · {{ ticket.user?.email }}
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Nachrichtenverlauf</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div
                        v-for="msg in ticket.messages"
                        :key="msg.id"
                        class="rounded-lg border p-4"
                        :class="{ 'border-amber-200 bg-amber-50 dark:bg-amber-950/20': msg.is_internal }"
                    >
                        <div class="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                            <span>{{ msg.user.name }} <Badge v-if="msg.is_internal" variant="secondary">Intern</Badge></span>
                            <span>{{ new Date(msg.created_at).toLocaleString('de-DE') }}</span>
                        </div>
                        <p class="whitespace-pre-wrap">{{ msg.body }}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <form
                        class="flex w-full flex-col gap-4"
                        @submit.prevent="messageForm.post(adminTickets.messages.store(ticket.id).url)"
                    >
                        <div class="space-y-2">
                            <textarea
                                v-model="messageForm.body"
                                class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Antwort..."
                                required
                                :aria-invalid="!!messageForm.errors.body"
                            />
                            <InputError :message="messageForm.errors.body" />
                        </div>
                        <div class="flex items-center gap-2">
                            <Switch
                                id="is_internal"
                                :checked="messageForm.is_internal"
                                @update:checked="(v: boolean) => (messageForm.is_internal = v)"
                            />
                            <Label for="is_internal">Nur intern (Kunde sieht diese Nachricht nicht)</Label>
                        </div>
                        <Button type="submit" :disabled="messageForm.processing">Antwort senden</Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    </AppLayout>
</template>
