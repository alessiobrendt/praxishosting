<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import {
    ArrowLeft,
    Info,
    Zap,
    FileText,
    Image,
    Lock,
    Tag,
    AlertCircle,
    User,
    Globe,
    GitMerge,
    Pencil,
    Maximize2,
    Minimize2,
} from 'lucide-vue-next';
import { ref, computed, onMounted, nextTick } from 'vue';
import InputError from '@/components/InputError.vue';
import TicketReplyEditor from '@/components/TicketReplyEditor.vue';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { sanitizeHtml, isHtml } from '@/lib/sanitize';
import { dashboard } from '@/routes';
import adminCustomers from '@/routes/admin/customers';
import adminSites from '@/routes/admin/sites';
import adminTickets from '@/routes/admin/tickets';
import type { BreadcrumbItem } from '@/types';

type UserType = { id: number; name: string; email?: string; is_admin?: boolean; avatar?: string };
type Site = { uuid: string; name: string; slug: string };
type TicketCategory = { id: number; name: string; slug: string };
type TicketPriority = { id: number; name: string; slug: string; color: string | null };
type MessageAttachment = { id: number; name: string; download_url: string };
type Message = {
    id: number;
    body: string;
    is_internal: boolean;
    sent_via_admin?: boolean;
    created_at: string;
    user: UserType;
    attachments?: MessageAttachment[];
};
type TagType = { id: number; name: string; slug: string; color: string | null };
type ActivityLog = {
    id: string;
    type: 'activity';
    action_type: string;
    created_at: string;
    user: { id: number; name: string } | null;
    description: string;
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
    user?: UserType;
    ticket_category?: TicketCategory;
    ticket_priority?: TicketPriority | null;
    site?: Site | null;
    assignedTo?: UserType | null;
    tags?: TagType[];
    messages?: Message[];
};
type RecentTicket = { id: number; subject: string; status: string; created_at: string };
type TicketMessageTemplateItem = { id: number; name: string; body: string | null };

type AffectedService = { type: string; id: number; label: string; url?: string | null };

type Props = {
    ticket: Ticket;
    categories: TicketCategory[];
    priorities: TicketPriority[];
    admins: UserType[];
    customerSites: Site[];
    recentTickets: RecentTicket[];
    lastMessageFromCustomer: boolean;
    allTags: TagType[];
    ticketActivityLogs: ActivityLog[];
    ticketMessageTemplates: TicketMessageTemplateItem[];
    serviceName: string;
    affectedServices?: AffectedService[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Tickets', href: adminTickets.index().url },
    { title: `#${props.ticket.id}`, href: '#' },
];

const statusLabels: Record<string, string> = {
    open: 'Offen',
    in_progress: 'In Bearbeitung',
    waiting_customer: 'Warte auf Kunde',
    resolved: 'Erledigt',
    closed: 'Geschlossen',
};

const timeline = computed(() => {
    const items: { sort_at: string; type: 'message' | 'activity'; data: Message | ActivityLog }[] = [];
    (props.ticket.messages ?? []).forEach((msg) => {
        items.push({ sort_at: msg.created_at, type: 'message', data: msg });
    });
    (props.ticketActivityLogs ?? []).forEach((log) => {
        items.push({ sort_at: log.created_at, type: 'activity', data: log });
    });
    items.sort((a, b) => new Date(a.sort_at).getTime() - new Date(b.sort_at).getTime());
    return items;
});

function formatMessageDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' Uhr';
}

function formatDateTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' um ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' Uhr';
}

const assignedToName = computed(() => {
    if (!props.ticket.assigned_to) return '–';
    const a = props.admins.find((x) => x.id === props.ticket.assigned_to);
    return a?.name ?? '–';
});

const templateReplacements = computed(() => {
    const t = props.ticket;
    const assigned = t.assigned_to != null ? props.admins.find((a) => a.id === t.assigned_to)?.name ?? '–' : '–';
    const now = new Date();
    const datum = now.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return {
        name: t.user?.name ?? '',
        email: t.user?.email ?? '',
        ticket_id: String(t.id),
        betreff: t.subject ?? '',
        produkt: props.serviceName ?? t.site?.name ?? '–',
        zugewiesen: assigned,
        datum,
    };
});

function activityIcon(actionType: string) {
    switch (actionType) {
        case 'status_change': return Lock;
        case 'category_change': return Tag;
        case 'priority_change': return AlertCircle;
        case 'assigned_change': return User;
        case 'site_change': return Globe;
        case 'merged': return GitMerge;
        default: return Pencil;
    }
}

function activityIconClasses(actionType: string): string {
    const base = 'relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 ';
    switch (actionType) {
        case 'status_change':
            return base + 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-300';
        case 'category_change':
            return base + 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300';
        case 'priority_change':
            return base + 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/50 dark:text-orange-300';
        case 'assigned_change':
            return base + 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-300';
        case 'site_change':
            return base + 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950/50 dark:text-sky-300';
        case 'merged':
            return base + 'border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400';
        default:
            return base + 'border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
}

function activityCardClasses(actionType: string): string {
    const base = 'overflow-hidden shadow-none ';
    switch (actionType) {
        case 'status_change':
            return base + 'border-l-4 border-l-blue-400 border-gray-200 bg-blue-50/30 dark:border-l-blue-600 dark:border-gray-700 dark:bg-blue-950/20';
        case 'category_change':
            return base + 'border-l-4 border-l-emerald-400 border-gray-200 bg-emerald-50/30 dark:border-l-emerald-600 dark:border-gray-700 dark:bg-emerald-950/20';
        case 'priority_change':
            return base + 'border-l-4 border-l-orange-400 border-gray-200 bg-orange-50/30 dark:border-l-orange-600 dark:border-gray-700 dark:bg-orange-950/20';
        case 'assigned_change':
            return base + 'border-l-4 border-l-violet-400 border-gray-200 bg-violet-50/30 dark:border-l-violet-600 dark:border-gray-700 dark:bg-violet-950/20';
        case 'site_change':
            return base + 'border-l-4 border-l-sky-400 border-gray-200 bg-sky-50/30 dark:border-l-sky-600 dark:border-gray-700 dark:bg-sky-950/20';
        case 'merged':
            return base + 'border-gray-200 dark:border-gray-700';
        default:
            return base + 'border-gray-200 dark:border-gray-700';
    }
}

function ticketAssignedToId(): string | number {
    const v = props.ticket.assigned_to;
    if (v == null) return '';
    if (typeof v === 'object' && v !== null && 'id' in v) return (v as { id: number }).id;
    return v as number;
}

const updateForm = useForm({
    status: props.ticket.status,
    ticket_category_id: props.ticket.ticket_category_id,
    ticket_priority_id: props.ticket.ticket_priority_id ?? '',
    assigned_to: ticketAssignedToId(),
    site_uuid: props.ticket.site?.uuid ?? '',
    tag_ids: (props.ticket.tags ?? []).map((t) => t.id),
});

function submitTicketUpdate() {
    const payload = {
        _method: 'PUT',
        status: updateForm.status,
        ticket_category_id: updateForm.ticket_category_id,
        ticket_priority_id: updateForm.ticket_priority_id === '' || updateForm.ticket_priority_id == null ? null : updateForm.ticket_priority_id,
        assigned_to: (() => {
            const v = updateForm.assigned_to;
            if (v === '' || v == null) return null;
            if (typeof v === 'object' && v !== null && 'id' in v) return (v as { id: number }).id;
            return Number(v);
        })(),
        site_uuid: updateForm.site_uuid === '' ? null : updateForm.site_uuid,
        tag_ids: Array.isArray(updateForm.tag_ids) ? updateForm.tag_ids : [],
    };
    updateSubmitting.value = true;
    router.post(adminTickets.update(props.ticket.id).url, payload, {
        preserveScroll: true,
        onError: (errors) => {
            Object.assign(updateForm.errors, errors);
            updateForm.hasErrors = Object.keys(updateForm.errors).length > 0;
        },
        onFinish: () => {
            updateSubmitting.value = false;
        },
    });
}

const messageForm = useForm({ body: '', is_internal: false });
const replyFormRef = ref<HTMLFormElement | null>(null);
const replyCardFullscreen = ref(false);
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

const ticketMessagesRef = ref<HTMLElement | null>(null);
const updateSubmitting = ref(false);
function fixTicketMessageHeight() {
    if (ticketMessagesRef.value) {
        const h = ticketMessagesRef.value.offsetHeight + 45;
        ticketMessagesRef.value.style.setProperty('--ticket-message-height', `${h}px`);
    }
}
onMounted(() => {
    nextTick(fixTicketMessageHeight);
});
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Ticket #${ticket.id}: ${ticket.subject}`" />

        <div class="page space-y-4">
            <!-- Page header (wie Support) -->
            <div class="page-header mb-3">
                <div class="flex flex-wrap items-center gap-4">
                    <div class="min-w-0 flex-1">
                        <h2 class="page-title flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            <Link
                                :href="adminTickets.index().url"
                                class="rounded p-1 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Zurück"
                            >
                                <ArrowLeft class="h-5 w-5" />
                            </Link>
                            <span class="truncate">Ticket #{{ ticket.id }} » {{ ticket.subject }}</span>
                        </h2>
                    </div>
                    <div class="shrink-0">
                        <Link :href="adminTickets.index().url">
                            <Button variant="outline" size="sm">Zurück zur Liste</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <!-- Left sidebar: Card im Support-Design, 3 Tabs -->
                <aside class="xl:col-span-3 xl:mb-4">
                    <div class="rounded-xl border border-gray-200 bg-white shadow-modern dark:border-gray-800 dark:bg-gray-900">
                        <Tabs default-tab="info" class="w-full">
                            <div class="flex flex-col space-y-1.5 border-b border-gray-200 bg-gray-50/50 p-6 py-3 dark:border-gray-800 dark:bg-gray-800/30">
                                <TabsList class="grid w-full grid-cols-3">
                                    <TabsTrigger value="info" class="gap-1.5">
                                        <Info class="h-4 w-4" />
                                        <span class="sr-only">Informationen</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="edit" class="gap-1.5">
                                        <Pencil class="h-4 w-4" />
                                        <span class="sr-only">Bearbeiten</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="actions" class="gap-1.5">
                                        <Zap class="h-4 w-4" />
                                        <span class="sr-only">Aktionen</span>
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                            <div class="p-6 space-y-4 py-4">
                                <!-- Tab 1: Nur Informationen (read-only) -->
                                <TabsContent value="info" class="mt-0 space-y-4">
                                    <div>
                                        <p class="mb-1 font-semibold">Betroffener Dienst</p>
                                        <ul
                                            v-if="affectedServices?.length"
                                            class="list-inside list-disc space-y-0.5 text-sm text-muted-foreground"
                                        >
                                            <li
                                                v-for="(svc, idx) in affectedServices"
                                                :key="`${svc.type}-${svc.id}-${idx}`"
                                            >
                                                <Link
                                                    v-if="svc.url"
                                                    :href="svc.url"
                                                    class="font-medium text-primary underline hover:no-underline"
                                                >
                                                    {{ svc.label }}
                                                </Link>
                                                <span v-else>{{ svc.label }}</span>
                                            </li>
                                        </ul>
                                        <span v-else class="text-sm">{{ serviceName }}</span>
                                    </div>
                                    <div>
                                        <p class="mb-1 font-semibold">Kategorie</p>
                                        <span class="text-sm">{{ ticket.ticket_category?.name ?? '–' }}</span>
                                    </div>
                                    <div>
                                        <p class="mb-1 font-semibold">Priorität</p>
                                        <span class="text-sm">{{ ticket.ticket_priority?.name ?? '–' }}</span>
                                    </div>
                                    <div>
                                        <p class="mb-1 font-semibold">Erstellt am</p>
                                        <span class="text-sm">{{ formatDateTime(ticket.created_at) }}</span>
                                    </div>
                                    <div>
                                        <p class="mb-1 font-semibold">Zugewiesen an</p>
                                        <span class="text-sm">{{ assignedToName }}</span>
                                    </div>
                                    <div>
                                        <p class="mb-1 font-semibold">Status</p>
                                        <span class="text-sm">{{ statusLabels[ticket.status] ?? ticket.status }}</span>
                                    </div>
                                    <div>
                                        <p class="mb-1 font-semibold">Interner Status</p>
                                        <span class="text-sm">{{ statusLabels[ticket.status] ?? ticket.status }}</span>
                                    </div>
                                    <div>
                                        <p class="mb-1 font-semibold">Kunde</p>
                                        <div class="space-y-0.5 text-sm">
                                            <span v-if="ticket.user">
                                                <Link
                                                    :href="adminCustomers.show(ticket.user_id).url"
                                                    class="font-medium text-primary underline hover:no-underline"
                                                >
                                                    {{ ticket.user.name }}
                                                </Link>
                                            </span>
                                            <span v-else>–</span>
                                            <span v-if="ticket.user?.email" class="block text-muted-foreground">{{ ticket.user.email }}</span>
                                            <span v-if="affectedServices?.length" class="block">
                                                Produkt/Site: {{ serviceName }}
                                            </span>
                                            <span v-else-if="ticket.site" class="block">
                                                Produkt/Site:
                                                <Link
                                                    :href="adminSites.show(ticket.site.uuid).url"
                                                    class="font-medium text-primary underline hover:no-underline"
                                                >
                                                    {{ ticket.site.name }}
                                                </Link>
                                            </span>
                                        </div>
                                    </div>
                              
                                    <div v-if="recentTickets.length">
                                                <p class="mb-1 font-semibold">Letzte Tickets</p>
                                                <ul class="space-y-1 text-sm">
                                                    <li v-for="t in recentTickets" :key="t.id">
                                                        <Link
                                                            :href="adminTickets.show(t.id).url"
                                                            class="block truncate rounded-md px-2 py-1.5 hover:bg-muted"
                                                        >
                                                            #{{ t.id }} – {{ t.subject.length > 35 ? t.subject.slice(0, 35) + '…' : t.subject }}
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                </TabsContent>
                                <!-- Tab 2: Bearbeiten (Formular) -->
                                <TabsContent value="edit" class="mt-0">
                                    <form @submit.prevent="submitTicketUpdate">
                                        <div class="space-y-4">
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
                                        </div>
                                        <div class="mt-4 flex flex-col gap-4 border-t border-gray-200 pt-4 dark:border-gray-800">
                                            <Button type="submit" :disabled="updateSubmitting">Aktualisieren</Button>
                                        </div>
                                    </form>
                                </TabsContent>
                                <!-- Tab 3: Aktionen -->
                                <TabsContent value="actions" class="mt-0">
                                    <div class="flex flex-col gap-3">
                                        <Button type="button" @click="focusReply(false)">Antworten</Button>
                                        <Button type="button" variant="outline" @click="noteDialogOpen = true">Notiz hinzufügen</Button>
                                        <Button
                                            v-if="ticket.status !== 'closed'"
                                            type="button"
                                            variant="outline"
                                            :disabled="closeForm.processing"
                                            @click="submitClose()"
                                        >
                                            Schließen
                                        </Button>
                                        <Button type="button" variant="outline" @click="mergeDialogOpen = true">Merge</Button>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </aside>

                <!-- Main: Timeline + Reply (wie Support rechts) -->
                <div class="xl:col-span-9">
                    <div v-if="lastMessageFromCustomer" class="mb-4 flex flex-wrap gap-2">
                        <Badge variant="default" class="bg-blue-600 text-white hover:bg-blue-700">Kunde hat geantwortet</Badge>
                    </div>

                    <!-- Timeline -->
                    <div ref="ticketMessagesRef" class="ticket_messages relative space-y-6">
                    <div
                        v-for="(item, _idx) in timeline"
                        :key="item.type === 'message' ? `msg-${(item.data as Message).id}` : (item.data as ActivityLog).id"
                        class="ticket_message_row flex gap-4"
                    >
                        <!-- Icon column -->
                        <div class="relative hidden shrink-0 md:block md:w-12">
                            <div
                                class="absolute inset-0 h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-950"
                                aria-hidden="true"
                            />
                            <div v-if="item.type === 'message'" class="relative flex h-12 w-12 overflow-hidden rounded-2xl">
                                <Avatar
                                    :name="(item.data as Message).user?.name"
                                    :src="(item.data as Message).user?.avatar"
                                    size="lg"
                                    class="h-12 w-12 rounded-2xl"
                                />
                            </div>
                            <div
                                v-else
                                :class="activityIconClasses((item.data as ActivityLog).action_type)"
                            >
                                <component
                                    :is="activityIcon((item.data as ActivityLog).action_type)"
                                    class="h-6 w-6"
                                />
                            </div>
                        </div>
                        <!-- Content -->
                        <div class="min-w-0 flex-1">
                            <Card
                                v-if="item.type === 'message'"
                                class="overflow-hidden shadow-none"
                                :class="(item.data as Message).is_internal ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800' : ''"
                            >
                                <CardHeader class="flex flex-row items-center justify-between space-y-0 border-b py-3">
                                    <h4 class="text-base font-medium">
                                        {{ (item.data as Message).user?.name }}
                                        <Badge v-if="(item.data as Message).sent_via_admin" class="ml-2 bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/50 dark:text-orange-200">Mitarbeiter</Badge>
                                        <Badge v-if="(item.data as Message).is_internal" variant="default" class="ml-2">Intern</Badge>
                                    </h4>
                                    <span class="text-sm text-gray-500 dark:text-gray-400">
                                        {{ formatMessageDate((item.data as Message).created_at) }}
                                    </span>
                                </CardHeader>
                                <CardContent class="py-3 [&>p]:mb-0.5">
                                    <div
                                        v-if="isHtml((item.data as Message).body)"
                                        class="ticket-message-body prose prose-sm max-w-none dark:prose-invert text-sm [&_p]:mb-1 [&_p:last-child]:mb-0 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:dark:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:pr-2 [&_blockquote]:py-1.5 [&_blockquote]:my-2 [&_blockquote]:text-gray-700 [&_blockquote]:dark:text-gray-300 [&_blockquote]:bg-gray-50 [&_blockquote]:dark:bg-gray-800/50 [&_blockquote]:rounded-r [&_blockquote]:not-italic [&_pre]:my-2 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:bg-gray-100 [&_pre]:dark:bg-gray-800 [&_pre]:p-3 [&_pre]:border [&_pre]:border-gray-200 [&_pre]:dark:border-gray-700 [&_pre]:text-sm [&_pre]:font-mono [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none [&_code]:font-mono [&_code]:text-sm [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded"
                                        v-html="sanitizeHtml((item.data as Message).body ?? '')"
                                    />
                                    <div v-else class="whitespace-pre-wrap text-sm">{{ (item.data as Message).body }}</div>
                                    <div
                                        v-if="(item.data as Message).attachments?.length"
                                        class="mt-3 flex flex-wrap gap-2"
                                    >
                                        <a
                                            v-for="att in (item.data as Message).attachments"
                                            :key="att.id"
                                            :href="att.download_url"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <FileText
                                                v-if="!/\.(jpe?g|png|webp)$/i.test(att.name)"
                                                class="h-4 w-4 shrink-0"
                                            />
                                            <Image v-else class="h-4 w-4 shrink-0" />
                                            <span class="truncate max-w-[200px]">{{ att.name }}</span>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card v-else :class="activityCardClasses((item.data as ActivityLog).action_type)">
                                <CardContent class="flex flex-row items-center justify-between gap-2 py-3">
                                    <p class="text-sm text-gray-700 dark:text-gray-300">{{ (item.data as ActivityLog).description }}</p>
                                    <span class="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                        {{ formatMessageDate((item.data as ActivityLog).created_at) }}
                                        <template v-if="(item.data as ActivityLog).user"> · {{ (item.data as ActivityLog).user?.name }}</template>
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                    <!-- Reply form (wie Support: Icon + Card mit orange Border) -->
                    <div class="mt-6 pb-24">
                        <div class="flex gap-4">
                            <div class="relative hidden shrink-0 md:block md:w-12">
                                <div
                                    class="absolute inset-0 h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-950"
                                    aria-hidden="true"
                                />
                                <div
                                    class="relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 text-orange-600 dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
                                >
                                    <Pencil class="h-6 w-6" />
                                </div>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div
                                    :class="
                                        replyCardFullscreen
                                            ? 'fixed inset-0 z-50 flex flex-col bg-white p-4 dark:bg-gray-950'
                                            : ''
                                    "
                                >
                                    <Card
                                        :class="
                                            replyCardFullscreen
                                                ? 'flex h-full min-h-0 flex-col border-t-4 border-t-orange-500'
                                                : 'border-t-4 border-t-orange-500'
                                        "
                                    >
                                        <CardHeader class="flex shrink-0 flex-row items-center justify-between space-y-0 border-b py-3">
                                            <CardTitle class="text-base">Antwort / Notiz</CardTitle>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                :aria-label="replyCardFullscreen ? 'Vollbild beenden' : 'Vollbild'"
                                                @click="replyCardFullscreen = !replyCardFullscreen"
                                            >
                                                <Minimize2 v-if="replyCardFullscreen" class="h-4 w-4" />
                                                <Maximize2 v-else class="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                    <form
                                        ref="replyFormRef"
                                        class="flex min-h-0 flex-1 flex-col"
                                        @submit.prevent="messageForm.post(adminTickets.messages.store(ticket.id).url)"
                                    >
                                        <CardContent class="flex min-h-0 flex-1 flex-col space-y-4 overflow-auto pt-4">
                                            <div
                                                class="space-y-2"
                                                :class="{ 'flex min-h-0 flex-1 flex-col': replyCardFullscreen }"
                                            >
                                                <div :class="{ 'min-h-0 flex-1': replyCardFullscreen }">
                                                    <TicketReplyEditor
                                                        v-model="messageForm.body"
                                                        placeholder="Antwort..."
                                                        :aria-invalid="!!messageForm.errors.body"
                                                        :min-height="replyCardFullscreen ? '100%' : undefined"
                                                        show-templates
                                                        :templates="ticketMessageTemplates"
                                                        :template-replacements="templateReplacements"
                                                    />
                                                </div>
                                                <InputError :message="messageForm.errors.body" />
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <input
                                                    id="is_internal"
                                                    v-model="messageForm.is_internal"
                                                    type="checkbox"
                                                    class="h-4 w-4 rounded border-gray-300"
                                                />
                                                <Label for="is_internal">Nur intern (Kunde sieht diese Nachricht nicht)</Label>
                                            </div>
                                        </CardContent>
                                        <CardFooter class="shrink-0 flex flex-row justify-end gap-2 border-t py-3">
                                            <Button
                                                type="submit"
                                                :disabled="messageForm.processing"
                                                class="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
                                            >
                                                Antwort senden
                                            </Button>
                                        </CardFooter>
                                    </form>
                                </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dialogs (aus Sidebar geöffnet) -->
            <Dialog v-model:open="noteDialogOpen">
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
            <Dialog v-model:open="mergeDialogOpen">
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
    </AdminLayout>
</template>

<style scoped>
.ticket_messages::before {
    border-left: 2px dashed gray;
    content: '';
    position: absolute;
    height: var(--ticket-message-height, 0);
    margin-left: 23px;
    margin-top: 5px;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 0;
}

.ticket_message_row {
    position: relative;
    z-index: 1;
}

:root.dark .ticket_messages::before {
    border-left-color: rgb(75 85 99);
}
</style>
