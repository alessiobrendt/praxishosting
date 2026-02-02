<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InputError from '@/components/InputError.vue';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, Trash2 } from 'lucide-vue-next';
import { dashboard } from '@/routes';
import adminCustomers from '@/routes/admin/customers';
import adminSites from '@/routes/admin/sites';
import adminTickets from '@/routes/admin/tickets';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email?: string };
type Site = { uuid: string; name: string; slug: string };
type TicketCategory = { id: number; name: string; slug: string };
type TicketPriority = { id: number; name: string; slug: string; color: string | null };
type Message = {
    id: number;
    body: string;
    is_internal: boolean;
    created_at: string;
    user: User;
};

type Tag = { id: number; name: string; slug: string; color: string | null };
type TimeLog = { id: number; minutes: number; description: string | null; logged_at: string; user: { id: number; name: string } };
type Todo = { id: number; title: string; is_done: boolean; sort_order: number };

type Ticket = {
    id: number;
    subject: string;
    status: string;
    user_id: number;
    site_id: number | null;
    ticket_category_id: number;
    ticket_priority_id: number | null;
    assigned_to: number | null;
    due_at: string | null;
    created_at: string;
    user?: User;
    ticket_category?: TicketCategory;
    ticket_priority?: TicketPriority | null;
    site?: Site | null;
    assignedTo?: User | null;
    tags?: Tag[];
    timeLogs?: TimeLog[];
    todos?: Todo[];
    messages?: Message[];
};

type RecentTicket = { id: number; subject: string; status: string; created_at: string };

type Props = {
    ticket: Ticket;
    categories: TicketCategory[];
    priorities: TicketPriority[];
    admins: User[];
    customerSites: Site[];
    recentTickets: RecentTicket[];
    lastMessageFromCustomer: boolean;
    allTags: Tag[];
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

function formatDatetimeLocal(iso: string | null | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 16);
}

const updateForm = useForm({
    status: props.ticket.status,
    ticket_category_id: props.ticket.ticket_category_id,
    ticket_priority_id: props.ticket.ticket_priority_id ?? '',
    assigned_to: props.ticket.assigned_to ?? '',
    site_uuid: props.ticket.site?.uuid ?? '',
    due_at: formatDatetimeLocal(props.ticket.due_at ?? undefined),
    tag_ids: (props.ticket.tags ?? []).map((t) => t.id),
});

const messageForm = useForm({ body: '', is_internal: false });
const replyFormRef = ref<HTMLFormElement | null>(null);
const noteForm = useForm({ body: '', is_internal: true });
const noteDialogOpen = ref(false);
const mergeForm = useForm({ target_ticket_id: '' as string | number });
const mergeDialogOpen = ref(false);

function focusReply(asInternal: boolean) {
    messageForm.is_internal = asInternal;
    replyFormRef.value?.scrollIntoView({ behavior: 'smooth' });
}

function submitNote() {
    noteForm.post(adminTickets.messages.store(props.ticket.id).url, {
        onSuccess: () => {
            noteDialogOpen.value = false;
            noteForm.reset();
        },
    });
}

const closeForm = useForm({ status: 'closed' });
function submitClose() {
    closeForm.put(adminTickets.update(props.ticket.id).url);
}

const timeLogForm = useForm({ minutes: '', description: '', logged_at: '' });
function submitTimeLog() {
    timeLogForm.post(adminTickets.timeLogs.store(props.ticket.id).url, {
        onSuccess: () => timeLogForm.reset(),
    });
}

const todoForm = useForm({ title: '' });
function submitTodo() {
    todoForm.post(adminTickets.todos.store(props.ticket.id).url, {
        onSuccess: () => todoForm.reset(),
    });
}
function toggleTodoDone(todo: Todo) {
    router.patch(adminTickets.todos.update(props.ticket.id, todo.id).url, { is_done: !todo.is_done });
}
function deleteTodo(todo: Todo) {
    if (confirm('To-do wirklich löschen?')) {
        router.delete(adminTickets.todos.destroy(props.ticket.id, todo.id).url);
    }
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Ticket #${ticket.id}: ${ticket.subject}`" />

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <!-- Main -->
            <div class="min-w-0 space-y-6">
                <div class="flex items-center justify-between gap-4">
                    <Heading level="h1" class="truncate">Ticket #{{ ticket.id }}: {{ ticket.subject }}</Heading>
                    <Link :href="adminTickets.index().url"><Button variant="outline">Zurück zur Liste</Button></Link>
                </div>

                <div v-if="ticket.due_at && new Date(ticket.due_at) < new Date() || lastMessageFromCustomer" class="flex flex-wrap gap-2">
                    <Badge v-if="ticket.due_at && new Date(ticket.due_at) < new Date()" variant="destructive">Überfällig</Badge>
                    <Badge v-if="lastMessageFromCustomer" variant="default" class="bg-blue-600 text-white hover:bg-blue-700">Kunde hat geantwortet</Badge>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="default" @click="focusReply(false)">Antworten</Button>
                    <Dialog v-model:open="noteDialogOpen">
                        <DialogTrigger as-child>
                            <Button type="button" variant="outline">Notiz hinzufügen</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Interne Notiz hinzufügen</DialogTitle>
                                <DialogDescription>
                                    Diese Notiz ist nur für Mitarbeiter sichtbar. Der Kunde sieht sie nicht.
                                </DialogDescription>
                            </DialogHeader>
                            <form class="space-y-4" @submit.prevent="submitNote()">
                                <div class="space-y-2">
                                    <Label for="note_body">Notiz</Label>
                                    <textarea
                                        id="note_body"
                                        v-model="noteForm.body"
                                        class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Interne Notiz..."
                                        required
                                        :aria-invalid="!!noteForm.errors.body"
                                    />
                                    <InputError :message="noteForm.errors.body" />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" @click="noteDialogOpen = false">Abbrechen</Button>
                                    <Button type="submit" :disabled="noteForm.processing">Notiz speichern</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Button
                        v-if="ticket.status !== 'closed'"
                        type="button"
                        variant="outline"
                        :disabled="closeForm.processing"
                        @click="submitClose()"
                    >
                        Schließen
                    </Button>
                    <Dialog v-model:open="mergeDialogOpen">
                        <DialogTrigger as-child>
                            <Button type="button" variant="outline">Merge</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Ticket zusammenführen</DialogTitle>
                                <DialogDescription>
                                    Dieses Ticket (#{{ ticket.id }}) wird in ein Ziel-Ticket verschoben. Alle Nachrichten werden dem Ziel-Ticket zugeordnet; dieses Ticket wird geschlossen.
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                class="space-y-4"
                                @submit.prevent="mergeForm.post(adminTickets.merge(ticket.id).url)"
                            >
                                <div class="space-y-2">
                                    <Label for="target_ticket_id">Ziel-Ticket-ID</Label>
                                    <Input
                                        id="target_ticket_id"
                                        v-model="mergeForm.target_ticket_id"
                                        type="text"
                                        inputmode="numeric"
                                        placeholder="z. B. 42"
                                        required
                                        :aria-invalid="!!mergeForm.errors.target_ticket_id"
                                    />
                                    <InputError :message="mergeForm.errors.target_ticket_id" />
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" @click="mergeDialogOpen = false">Abbrechen</Button>
                                    <Button type="submit" :disabled="mergeForm.processing">Zusammenführen</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

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
                            ref="replyFormRef"
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
                                    v-model="messageForm.is_internal"
                                />
                                <Label for="is_internal">Nur intern (Kunde sieht diese Nachricht nicht)</Label>
                            </div>
                            <Button type="submit" :disabled="messageForm.processing">Antwort senden</Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>

            <!-- Sidebar -->
            <aside class="space-y-6 lg:sticky lg:top-6 lg:self-start">
                <Card>
                    <CardHeader>
                        <CardTitle>Eigenschaften</CardTitle>
                        <CardDescription>Status, Kategorie, Priorität, Zuweisung, Produkt/Site</CardDescription>
                    </CardHeader>
                    <form @submit.prevent="updateForm.put(adminTickets.update(ticket.id).url)">
                        <CardContent class="space-y-4">
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
                            <div v-if="customerSites.length" class="space-y-2">
                                <Label>Produkt/Site</Label>
                                <Select v-model="updateForm.site_uuid" name="site_uuid">
                                    <option value="">–</option>
                                    <option v-for="s in customerSites" :key="s.uuid" :value="s.uuid">{{ s.name }}</option>
                                </Select>
                            </div>
                            <div class="space-y-2">
                                <Label for="due_at">Fälligkeitsdatum</Label>
                                <input
                                    id="due_at"
                                    v-model="updateForm.due_at"
                                    type="datetime-local"
                                    name="due_at"
                                    class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div v-if="allTags.length" class="space-y-2">
                                <Label>Tags</Label>
                                <select
                                    v-model="updateForm.tag_ids"
                                    name="tag_ids[]"
                                    multiple
                                    class="flex h-auto min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option v-for="tag in allTags" :key="tag.id" :value="tag.id">
                                        {{ tag.name }}
                                    </option>
                                </select>
                                <Text variant="small" class="text-muted-foreground">Strg+Klick für Mehrfachauswahl</Text>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" :disabled="updateForm.processing">Aktualisieren</Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Kunde</CardTitle>
                        <CardDescription class="space-y-1">
                            <span>
                                <Link
                                    v-if="ticket.user"
                                    :href="adminCustomers.show(ticket.user_id).url"
                                    class="font-medium text-primary underline hover:no-underline"
                                >
                                    {{ ticket.user.name }}
                                </Link>
                                <template v-else>–</template>
                            </span>
                            <span v-if="ticket.user?.email" class="block text-sm">{{ ticket.user.email }}</span>
                            <span v-if="ticket.site" class="mt-1 block">
                                Produkt/Site:
                                <Link
                                    :href="adminSites.show(ticket.site.uuid).url"
                                    class="font-medium text-primary underline hover:no-underline"
                                >
                                    {{ ticket.site.name }}
                                </Link>
                            </span>
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card v-if="recentTickets.length">
                    <CardHeader>
                        <CardTitle>Letzte Tickets</CardTitle>
                        <CardDescription>Weitere Tickets dieses Kunden</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul class="space-y-2">
                            <li v-for="t in recentTickets" :key="t.id">
                                <Link
                                    :href="adminTickets.show(t.id).url"
                                    class="block truncate rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                                >
                                    #{{ t.id }} – {{ t.subject.length > 35 ? t.subject.slice(0, 35) + '…' : t.subject }} – {{ statusLabels[t.status] ?? t.status }}
                                </Link>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <Collapsible default-open>
                        <CardHeader class="py-3">
                            <CollapsibleTrigger class="flex w-full items-center justify-between text-left">
                                <CardTitle class="text-base">Zeitprotokoll</CardTitle>
                                <ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                            </CollapsibleTrigger>
                        </CardHeader>
                        <CollapsibleContent>
                            <CardContent class="space-y-3 pt-0">
                                <ul v-if="ticket.timeLogs?.length" class="space-y-2 text-sm">
                                    <li
                                        v-for="log in ticket.timeLogs"
                                        :key="log.id"
                                        class="flex justify-between rounded-md border px-2 py-1.5"
                                    >
                                        <span>{{ log.minutes }} min</span>
                                        <span>{{ new Date(log.logged_at).toLocaleDateString('de-DE') }}</span>
                                    </li>
                                </ul>
                                <p v-else class="text-sm text-muted-foreground">Keine Einträge.</p>
                                <form class="space-y-2 border-t pt-2" @submit.prevent="submitTimeLog()">
                                    <div class="flex gap-2">
                                        <Input
                                            v-model="timeLogForm.minutes"
                                            type="number"
                                            min="1"
                                            placeholder="Min"
                                            required
                                            class="w-20"
                                            :aria-invalid="!!timeLogForm.errors.minutes"
                                        />
                                        <Input
                                            v-model="timeLogForm.logged_at"
                                            type="datetime-local"
                                            class="flex-1 min-w-0"
                                        />
                                    </div>
                                    <Input
                                        v-model="timeLogForm.description"
                                        type="text"
                                        placeholder="Beschreibung (optional)"
                                        class="w-full"
                                    />
                                    <InputError :message="timeLogForm.errors.minutes" />
                                    <Button type="submit" size="sm" :disabled="timeLogForm.processing">Eintrag hinzufügen</Button>
                                </form>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>

                <Card>
                    <Collapsible default-open>
                        <CardHeader class="py-3">
                            <CollapsibleTrigger class="flex w-full items-center justify-between text-left">
                                <CardTitle class="text-base">To-dos</CardTitle>
                                <ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                            </CollapsibleTrigger>
                        </CardHeader>
                        <CollapsibleContent>
                            <CardContent class="space-y-3 pt-0">
                                <ul v-if="ticket.todos?.length" class="space-y-2 text-sm">
                                    <li
                                        v-for="todo in ticket.todos"
                                        :key="todo.id"
                                        class="flex items-center gap-2 rounded-md border px-2 py-1.5"
                                    >
                                        <Checkbox
                                            :model-value="todo.is_done"
                                            :aria-label="`${todo.title} erledigt`"
                                            @update:model-value="toggleTodoDone(todo)"
                                        />
                                        <span
                                            class="min-w-0 flex-1 truncate"
                                            :class="{ 'text-muted-foreground line-through': todo.is_done }"
                                        >
                                            {{ todo.title }}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            class="h-7 w-7 shrink-0"
                                            aria-label="To-do löschen"
                                            @click="deleteTodo(todo)"
                                        >
                                            <Trash2 class="h-3.5 w-3.5" />
                                        </Button>
                                    </li>
                                </ul>
                                <p v-else class="text-sm text-muted-foreground">Keine To-dos.</p>
                                <form class="flex gap-2 border-t pt-2" @submit.prevent="submitTodo()">
                                    <Input
                                        v-model="todoForm.title"
                                        type="text"
                                        placeholder="Neues To-do"
                                        required
                                        class="min-w-0 flex-1"
                                        :aria-invalid="!!todoForm.errors.title"
                                    />
                                    <Button type="submit" size="sm" :disabled="todoForm.processing">Hinzufügen</Button>
                                </form>
                                <InputError :message="todoForm.errors.title" />
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>
            </aside>
        </div>
    </AppLayout>
</template>
