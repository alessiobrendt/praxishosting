<!-- Admin: Support-Ticket (Detail) -->
<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { ref, computed, onMounted, nextTick } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BCardFooter,
    BNav,
    BNavItem,
    BModal,
    BForm,
    BFormGroup,
    BFormSelect,
    BFormCheckbox,
    BButton,
    BBadge,
} from 'bootstrap-vue-next';
import InputError from '@/components/InputError.vue';
import Icon from '@/components/wrappers/Icon.vue';
import TicketReplyEditor from '@/components/TicketReplyEditor.vue';
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
    uuid: string;
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
type RecentTicket = { id: number; uuid: string; subject: string; status: string; created_at: string };
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

const statusOptions = computed(() =>
    Object.entries(statusLabels).map(([value, text]) => ({ value, text })),
);
const categoryOptions = computed(() =>
    props.categories.map((c) => ({ value: String(c.id), text: c.name })),
);
const priorityOptions = computed(() => [
    { value: '', text: '–' },
    ...props.priorities.map((p) => ({ value: String(p.id), text: p.name })),
]);
const assignedOptions = computed(() => [
    { value: '', text: '–' },
    ...props.admins.map((a) => ({ value: String(a.id), text: a.name })),
]);
const siteOptions = computed(() => [
    { value: '', text: '–' },
    ...props.customerSites.map((s) => ({ value: s.uuid, text: s.name })),
]);
const mergeTargetOptions = computed(() =>
    props.recentTickets
        .filter((rt) => rt.uuid !== props.ticket.uuid)
        .map((rt) => ({ value: rt.uuid, text: `#${rt.id} – ${rt.subject}` })),
);

function activityIcon(actionType: string): string {
    switch (actionType) {
        case 'status_change': return 'lock';
        case 'category_change': return 'tag';
        case 'priority_change': return 'alert-circle';
        case 'assigned_change': return 'user';
        case 'site_change': return 'world';
        case 'merged': return 'git-merge';
        default: return 'pencil';
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

function ticketAssignedToId(): string {
    const v = props.ticket.assigned_to;
    if (v == null) return '';
    if (typeof v === 'object' && v !== null && 'id' in v) return String((v as { id: number }).id);
    return String(v as number);
}

const updateForm = useForm({
    status: props.ticket.status,
    ticket_category_id: String(props.ticket.ticket_category_id),
    ticket_priority_id: props.ticket.ticket_priority_id != null ? String(props.ticket.ticket_priority_id) : '',
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
    router.post(adminTickets.update(props.ticket.uuid).url, payload, {
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
const mergeForm = useForm({ target_ticket_uuid: '' as string });
const mergeDialogOpen = ref(false);
const sidebarTab = ref<'info' | 'edit' | 'actions'>('info');

function focusReply(asInternal: boolean) {
    messageForm.is_internal = asInternal;
    replyFormRef.value?.scrollIntoView({ behavior: 'smooth' });
}

function submitNote() {
    noteForm.post(adminTickets.messages.store(props.ticket.uuid).url, {
        onSuccess: () => {
            noteDialogOpen.value = false;
            noteForm.reset();
        },
    });
}

const closeForm = useForm({ status: 'closed' });
function submitClose() {
    closeForm.put(adminTickets.update(props.ticket.uuid).url);
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

        <BRow>
            <BCol>
                <div class="mb-3 d-flex flex-wrap align-items-center gap-2">
                    <Link
                        :href="adminTickets.index().url"
                        class="text-body rounded p-1 d-inline-flex"
                        aria-label="Zurück"
                    >
                        <Icon icon="arrow-left" class="flex-shrink-0" />
                    </Link>
                    <h4 class="mb-0 flex-grow-1 text-truncate">Ticket #{{ ticket.id }} » {{ ticket.subject }}</h4>
                    <Link :href="adminTickets.index().url">
                        <BButton variant="outline-primary" size="sm">Zurück zur Liste</BButton>
                    </Link>
                </div>
                <p class="text-muted small mb-3">Support-Ticket-Detail: Verlauf, Antworten und Einstellungen</p>
            </BCol>
        </BRow>

        <BRow>
            <!-- Sidebar: Infos, Bearbeiten, Aktionen -->
            <BCol cols="12" xl="3" class="mb-4">
                <BCard no-body>
                    <BCardHeader class="py-3">
                        <BNav tabs class="card-header-tabs mb-0 flex-wrap">
                            <BNavItem :active="sidebarTab === 'info'" @click="sidebarTab = 'info'">
                                <Icon icon="info" class="me-1" /> Informationen
                            </BNavItem>
                            <BNavItem :active="sidebarTab === 'edit'" @click="sidebarTab = 'edit'">
                                <Icon icon="pencil" class="me-1" /> Bearbeiten
                            </BNavItem>
                            <BNavItem :active="sidebarTab === 'actions'" @click="sidebarTab = 'actions'">
                                <Icon icon="bolt" class="me-1" /> Aktionen
                            </BNavItem>
                        </BNav>
                    </BCardHeader>
                    <BCardBody class="py-4">
                        <!-- Tab: Informationen (read-only) -->
                        <div v-show="sidebarTab === 'info'" class="space-y-3">
                            <div>
                                <p class="mb-1 fw-semibold small">Betroffener Dienst</p>
                                <ul v-if="affectedServices?.length" class="list-inside list-disc small text-muted mb-0 ps-2">
                                    <li v-for="(svc, idx) in affectedServices" :key="`${svc.type}-${svc.id}-${idx}`">
                                        <Link v-if="svc.url" :href="svc.url">{{ svc.label }}</Link>
                                        <span v-else>{{ svc.label }}</span>
                                    </li>
                                </ul>
                                <span v-else class="small">{{ serviceName }}</span>
                            </div>
                            <div>
                                <p class="mb-1 fw-semibold small">Kategorie</p>
                                <span class="small">{{ ticket.ticket_category?.name ?? '–' }}</span>
                            </div>
                            <div>
                                <p class="mb-1 fw-semibold small">Priorität</p>
                                <span class="small">{{ ticket.ticket_priority?.name ?? '–' }}</span>
                            </div>
                            <div>
                                <p class="mb-1 fw-semibold small">Erstellt am</p>
                                <span class="small">{{ formatDateTime(ticket.created_at) }}</span>
                            </div>
                            <div>
                                <p class="mb-1 fw-semibold small">Zugewiesen an</p>
                                <span class="small">{{ assignedToName }}</span>
                            </div>
                            <div>
                                <p class="mb-1 fw-semibold small">Status</p>
                                <span class="small">{{ statusLabels[ticket.status] ?? ticket.status }}</span>
                            </div>
                            <div>
                                <p class="mb-1 fw-semibold small">Kunde</p>
                                <div class="small">
                                    <span v-if="ticket.user">
                                        <Link :href="adminCustomers.show(ticket.user_id).url">{{ ticket.user.name }}</Link>
                                    </span>
                                    <span v-else>–</span>
                                    <span v-if="ticket.user?.email" class="d-block text-muted">{{ ticket.user.email }}</span>
                                    <span v-if="affectedServices?.length" class="d-block">Produkt/Site: {{ serviceName }}</span>
                                    <span v-else-if="ticket.site" class="d-block">
                                        Produkt/Site: <Link :href="adminSites.show(ticket.site.uuid).url">{{ ticket.site.name }}</Link>
                                    </span>
                                </div>
                            </div>
                            <div v-if="recentTickets.length">
                                <p class="mb-1 fw-semibold small">Letzte Tickets</p>
                                <ul class="list-unstyled small mb-0">
                                    <li v-for="t in recentTickets" :key="t.id">
                                        <Link :href="adminTickets.show(t.id).url" class="d-block rounded px-2 py-1 text-truncate text-body text-decoration-none hover-bg-light">
                                            #{{ t.id }} – {{ t.subject.length > 35 ? t.subject.slice(0, 35) + '…' : t.subject }}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Tab: Bearbeiten -->
                        <div v-show="sidebarTab === 'edit'">
                            <BForm @submit.prevent="submitTicketUpdate">
                                <BFormGroup label="Status" label-for="status">
                                    <BFormSelect id="status" v-model="updateForm.status" :options="statusOptions" />
                                </BFormGroup>
                                <BFormGroup label="Kategorie" label-for="ticket_category_id">
                                    <BFormSelect id="ticket_category_id" v-model="updateForm.ticket_category_id" :options="categoryOptions" />
                                </BFormGroup>
                                <BFormGroup label="Priorität" label-for="ticket_priority_id">
                                    <BFormSelect id="ticket_priority_id" v-model="updateForm.ticket_priority_id" :options="priorityOptions" />
                                </BFormGroup>
                                <BFormGroup label="Zugewiesen an" label-for="assigned_to">
                                    <BFormSelect id="assigned_to" v-model="updateForm.assigned_to" :options="assignedOptions" />
                                </BFormGroup>
                                <BFormGroup v-if="customerSites.length" label="Produkt/Site" label-for="site_uuid">
                                    <BFormSelect id="site_uuid" v-model="updateForm.site_uuid" :options="siteOptions" />
                                </BFormGroup>
                                <BFormGroup v-if="allTags.length" label="Tags" label-for="tag_ids">
                                    <select
                                        id="tag_ids"
                                        v-model="updateForm.tag_ids"
                                        name="tag_ids[]"
                                        multiple
                                        class="form-select form-control"
                                        style="min-height: 80px"
                                    >
                                        <option v-for="tag in allTags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
                                    </select>
                                    <p class="text-muted small mb-0 mt-1">Strg+Klick für Mehrfachauswahl</p>
                                </BFormGroup>
                                <div class="mt-3 pt-3 border-top">
                                    <BButton type="submit" variant="primary" :disabled="updateSubmitting">Aktualisieren</BButton>
                                </div>
                            </BForm>
                        </div>

                        <!-- Tab: Aktionen -->
                        <div v-show="sidebarTab === 'actions'" class="d-flex flex-column gap-2">
                            <BButton variant="primary" @click="focusReply(false)">Antworten</BButton>
                            <BButton variant="outline-secondary" @click="noteDialogOpen = true">Notiz hinzufügen</BButton>
                            <BButton
                                v-if="ticket.status !== 'closed'"
                                variant="outline-secondary"
                                :disabled="closeForm.processing"
                                @click="submitClose()"
                            >
                                Schließen
                            </BButton>
                            <BButton variant="outline-secondary" @click="mergeDialogOpen = true">Merge</BButton>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>

            <!-- Hauptbereich: Timeline + Antwort -->
            <BCol cols="12" xl="9">
                <div v-if="lastMessageFromCustomer" class="mb-3">
                    <BBadge variant="primary">Kunde hat geantwortet</BBadge>
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
                            <div v-if="item.type === 'message'" class="relative d-flex align-items-center justify-content-center h-12 w-12 rounded-3 bg-light overflow-hidden">
                                <template v-if="(item.data as Message).user?.avatar">
                                    <img :src="(item.data as Message).user!.avatar" :alt="(item.data as Message).user?.name" class="w-100 h-100 object-fit-cover" />
                                </template>
                                <span v-else class="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center small fw-semibold w-100 h-100">
                                    {{ ((item.data as Message).user?.name ?? '?').charAt(0).toUpperCase() }}
                                </span>
                            </div>
                            <div
                                v-else
                                :class="activityIconClasses((item.data as ActivityLog).action_type)"
                            >
                                <Icon :icon="activityIcon((item.data as ActivityLog).action_type)" class="fs-5" />
                            </div>
                        </div>
                        <!-- Content -->
                        <div class="min-w-0 flex-grow-1">
                            <BCard
                                v-if="item.type === 'message'"
                                no-body
                                class="overflow-hidden shadow-none"
                                :class="(item.data as Message).is_internal ? 'border-warning bg-warning bg-opacity-10' : ''"
                            >
                                <BCardHeader class="d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom py-3">
                                    <span class="fw-medium">
                                        {{ (item.data as Message).user?.name }}
                                        <BBadge v-if="(item.data as Message).sent_via_admin" variant="warning" class="ms-2">Mitarbeiter</BBadge>
                                        <BBadge v-if="(item.data as Message).is_internal" variant="secondary" class="ms-2">Intern</BBadge>
                                    </span>
                                    <span class="small text-muted">{{ formatMessageDate((item.data as Message).created_at) }}</span>
                                </BCardHeader>
                                <BCardBody class="py-3">
                                    <div
                                        v-if="isHtml((item.data as Message).body)"
                                        class="ticket-message-body small"
                                        v-html="sanitizeHtml((item.data as Message).body ?? '')"
                                    />
                                    <div v-else class="small text-break whitespace-pre-wrap">{{ (item.data as Message).body }}</div>
                                    <div v-if="(item.data as Message).attachments?.length" class="mt-3 d-flex flex-wrap gap-2">
                                        <a
                                            v-for="att in (item.data as Message).attachments"
                                            :key="att.id"
                                            :href="att.download_url"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 text-decoration-none"
                                        >
                                            <Icon :icon="!/\.(jpe?g|png|webp)$/i.test(att.name) ? 'file-text' : 'photo'" />
                                            <span class="text-truncate" style="max-width: 200px">{{ att.name }}</span>
                                        </a>
                                    </div>
                                </BCardBody>
                            </BCard>
                            <BCard v-else no-body :class="activityCardClasses((item.data as ActivityLog).action_type)">
                                <BCardBody class="d-flex flex-wrap align-items-center justify-content-between gap-2 py-3">
                                    <p class="small mb-0 text-body">{{ (item.data as ActivityLog).description }}</p>
                                    <span class="small text-muted">
                                        {{ formatMessageDate((item.data as ActivityLog).created_at) }}
                                        <template v-if="(item.data as ActivityLog).user"> · {{ (item.data as ActivityLog).user?.name }}</template>
                                    </span>
                                </BCardBody>
                            </BCard>
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
                                <div class="relative d-flex align-items-center justify-content-center h-12 w-12 rounded-3 border border-2 border-warning border-dashed bg-warning bg-opacity-10 text-warning">
                                    <Icon icon="pencil" class="fs-4" />
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
                                    <BCard
                                        no-body
                                        :class="replyCardFullscreen ? 'd-flex flex-column h-100 min-h-0 border-top border-warning border-3' : 'border-top border-warning border-3'"
                                    >
                                        <BCardHeader class="d-flex align-items-center justify-content-between border-bottom py-3">
                                            <BCardTitle class="mb-0">Antwort / Notiz</BCardTitle>
                                            <BButton
                                                type="button"
                                                variant="link"
                                                size="sm"
                                                :aria-label="replyCardFullscreen ? 'Vollbild beenden' : 'Vollbild'"
                                                @click="replyCardFullscreen = !replyCardFullscreen"
                                            >
                                                <Icon :icon="replyCardFullscreen ? 'minimize' : 'maximize'" />
                                            </BButton>
                                        </BCardHeader>
                                        <form
                                            ref="replyFormRef"
                                            class="d-flex flex-column min-h-0 flex-grow-1"
                                            @submit.prevent="messageForm.post(adminTickets.messages.store(ticket.uuid).url)"
                                        >
                                            <BCardBody class="d-flex flex-column min-h-0 flex-grow-1 overflow-auto pt-4">
                                                <div class="mb-3" :class="{ 'd-flex flex-column flex-grow-1 min-h-0': replyCardFullscreen }">
                                                    <div :class="{ 'min-h-0 flex-grow-1': replyCardFullscreen }">
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
                                                <BFormCheckbox id="is_internal" v-model="messageForm.is_internal" class="mb-0">
                                                    Nur intern (Kunde sieht diese Nachricht nicht)
                                                </BFormCheckbox>
                                            </BCardBody>
                                            <BCardFooter class="d-flex justify-content-end gap-2 border-top py-3">
                                                <BButton type="submit" variant="warning" :disabled="messageForm.processing">
                                                    Antwort senden
                                                </BButton>
                                            </BCardFooter>
                                        </form>
                                    </BCard>
                                </div>
                            </div>
                        </div>
                </div>
            </BCol>
        </BRow>

        <!-- Modals -->
        <BModal v-model="noteDialogOpen" title="Interne Notiz hinzufügen" hide-footer>
            <p class="text-muted small mb-3">Diese Notiz ist nur für Mitarbeiter sichtbar. Der Kunde sieht sie nicht.</p>
            <BForm @submit.prevent="submitNote()">
                <BFormGroup label="Notiz" label-for="note_body">
                    <textarea
                        id="note_body"
                        v-model="noteForm.body"
                        class="form-control"
                        rows="4"
                        placeholder="Interne Notiz..."
                        required
                        :aria-invalid="!!noteForm.errors.body"
                    />
                    <InputError :message="noteForm.errors.body" />
                </BFormGroup>
                <div class="d-flex justify-content-end gap-2">
                    <BButton variant="outline-secondary" @click="noteDialogOpen = false">Abbrechen</BButton>
                    <BButton type="submit" variant="primary" :disabled="noteForm.processing">Notiz speichern</BButton>
                </div>
            </BForm>
        </BModal>
        <BModal v-model="mergeDialogOpen" title="Ticket zusammenführen" hide-footer>
            <p class="text-muted small mb-3">
                Dieses Ticket (#{{ ticket.id }}) wird in ein Ziel-Ticket verschoben. Alle Nachrichten werden dem Ziel-Ticket zugeordnet; dieses Ticket wird geschlossen.
            </p>
            <BForm @submit.prevent="mergeForm.post(adminTickets.merge(ticket.uuid).url)">
                <BFormGroup label="Ziel-Ticket" label-for="target_ticket_uuid">
                    <BFormSelect
                        id="target_ticket_uuid"
                        v-model="mergeForm.target_ticket_uuid"
                        :options="[{ value: '', text: 'Bitte wählen …' }, ...mergeTargetOptions]"
                        required
                        :aria-invalid="!!mergeForm.errors.target_ticket_uuid"
                    />
                    <InputError :message="mergeForm.errors.target_ticket_uuid" />
                </BFormGroup>
                <div class="d-flex justify-content-end gap-2">
                    <BButton variant="outline-secondary" @click="mergeDialogOpen = false">Abbrechen</BButton>
                    <BButton type="submit" variant="primary" :disabled="mergeForm.processing">Zusammenführen</BButton>
                </div>
            </BForm>
        </BModal>
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
