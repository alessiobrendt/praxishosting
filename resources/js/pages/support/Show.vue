<script setup lang="ts">
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import { ArrowLeft, Signal, Info, Home, Paperclip, X, FileText, Image, Lock, Maximize2, Minimize2 } from 'lucide-vue-next';
import { ref, computed, onMounted, nextTick } from 'vue';
import InputError from '@/components/InputError.vue';
import TicketReplyEditor from '@/components/TicketReplyEditor.vue';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';
import { sanitizeHtml, isHtml } from '@/lib/sanitize';
import { dashboard } from '@/routes';
import support from '@/routes/support';
import type { BreadcrumbItem } from '@/types';

type Ticket = { id: number; subject: string; status: string; created_at: string; updated_at: string };
type TicketCategory = { id: number; name: string; slug: string } | null;
type TicketPriority = { id: number; name: string; slug: string; color: string | null } | null;
type Site = { uuid: string; name: string; slug: string } | null;
type MessageAttachment = { id: number; name: string; download_url: string };

type Message = {
    id: number;
    body: string | null;
    is_internal: boolean;
    is_hidden?: boolean;
    sent_via_admin?: boolean;
    created_at: string;
    user: { id: number; name: string; avatar?: string };
    attachments?: MessageAttachment[];
};

type StatusChange = { id: string; type: string; created_at: string; label: string };

type Props = {
    ticket: Ticket;
    ticketCategory: TicketCategory;
    ticketPriority: TicketPriority;
    site: Site;
    statusLabel: string;
    serviceName: string;
    messages: Message[];
    statusChanges?: StatusChange[];
};

const props = defineProps<Props>();

const timeline = computed(() => {
    const items: { sort_at: string; type: 'message' | 'status_change'; data: Message | StatusChange }[] = [];
    (props.messages ?? []).forEach((msg) => {
        items.push({ sort_at: msg.created_at, type: 'message', data: msg });
    });
    (props.statusChanges ?? []).forEach((sc) => {
        items.push({ sort_at: sc.created_at, type: 'status_change', data: sc });
    });
    items.sort((a, b) => new Date(a.sort_at).getTime() - new Date(b.sort_at).getTime());
    return items;
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Start', href: dashboard().url },
    { title: 'Support Tickets', href: support.index().url },
    { title: `Ticket #${props.ticket.id}`, href: support.show(props.ticket.id).url },
];

function formatDateTime(iso: string): string {
    const d = new Date(iso);
    const date = d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${date} um ${time} Uhr`;
}

function formatMessageDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' Uhr';
}

const form = useForm({ body: '' });
const replyCardFullscreen = ref(false);
const ticketMessagesRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const attachmentFiles = ref<File[]>([]);
const sending = ref(false);

function triggerFileInput() {
    fileInputRef.value?.click();
}

function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const maxSize = 4 * 1024 * 1024; // 4 MB
    const allowedTypes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/webp', 'application/pdf'];
    for (const file of Array.from(input.files)) {
        if (file.size > maxSize) continue;
        if (!allowedTypes.includes(file.type)) continue;
        attachmentFiles.value.push(file);
    }
    input.value = '';
}

function removeAttachment(index: number) {
    attachmentFiles.value.splice(index, 1);
}

function submitMessage() {
    sending.value = true;
    const formData = new FormData();
    formData.append('body', form.body);
    attachmentFiles.value.forEach((file) => formData.append('attachments[]', file));
    router.post(support.messages.store(props.ticket.id).url, formData, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            attachmentFiles.value = [];
        },
        onFinish: () => {
            sending.value = false;
        },
    });
}

function fixTicketMessageHeight() {
    if (ticketMessagesRef.value) {
        const h = ticketMessagesRef.value.offsetHeight;
        ticketMessagesRef.value.style.setProperty('--ticket-message-height', `${h}px`);
    }
}

onMounted(() => {
    nextTick(fixTicketMessageHeight);
});

function back() {
    router.visit(support.index().url);
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Ticket #${ticket.id} » ${ticket.subject}`" />

        <div class="page space-y-4">
            <!-- Page header -->
            <div class="page-header mb-3">
                <div class="flex flex-wrap items-center gap-4">
                    <div class="min-w-0 flex-1">
                        <h2 class="page-title flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            <button
                                type="button"
                                class="cursor-pointer rounded p-1 transition-modern hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Zurück"
                                @click="back"
                            >
                                <ArrowLeft class="h-5 w-5" />
                            </button>
                            <span class="truncate">Ticket #{{ ticket.id }} » {{ ticket.subject }}</span>
                        </h2>
                    </div>
                    <div v-if="ticket.status !== 'closed' && ticket.status !== 'resolved'" class="shrink-0">
                        <Link :href="support.index().url">
                            <Button variant="outline" size="sm">Zurück zur Liste</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <!-- Left sidebar -->
                <aside class="xl:col-span-3 xl:mb-4">
                    <!-- Verzögerter Support in der Nacht -->
                    <Card class="mb-4 border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40">
                        <CardContent class="flex gap-4 pt-6">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-red-600 dark:bg-red-900/50 dark:text-red-400">
                                <Home class="h-6 w-6" />
                            </div>
                            <div>
                                <h3 class="font-semibold text-red-900 dark:text-red-100">Verzögerter Support in der Nacht</h3>
                                <p class="mt-1 text-sm text-red-800 dark:text-red-200">
                                    Bitte beachte, dass es in der Nacht länger dauern kann, bis wir dein Support-Ticket bearbeiten. Wir geben aber unser Bestes, um dein Anliegen so schnell wie möglich zu bearbeiten!
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Ticket Status -->
                    <Card class="mb-4">
                        <CardHeader class="border-b border-gray-200 bg-gray-50/50 py-3 dark:border-gray-800 dark:bg-gray-800/30">
                            <CardTitle class="flex items-center gap-2 text-base">
                                <Signal class="h-4 w-4" />
                                Ticket Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="py-4">
                            <p class="mb-1 font-semibold">{{ statusLabel }}</p>
                            <p class="text-sm italic text-gray-600 dark:text-gray-400">
                                Zuletzt aktualisiert:<br />
                                {{ formatDateTime(ticket.updated_at) }}
                            </p>
                        </CardContent>
                    </Card>

                    <!-- Informationen -->
                    <Card>
                        <CardHeader class="border-b border-gray-200 bg-gray-50/50 py-3 dark:border-gray-800 dark:bg-gray-800/30">
                            <CardTitle class="flex items-center gap-2 text-base">
                                <Info class="h-4 w-4" />
                                Informationen
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4 py-4">
                            <div>
                                <p class="mb-1 font-semibold">Betroffener Dienst</p>
                                <span class="text-sm">{{ serviceName }}</span>
                            </div>
                            <div>
                                <p class="mb-1 font-semibold">Kategorie</p>
                                <span class="text-sm">{{ ticketCategory?.name ?? '–' }}</span>
                            </div>
                            <div>
                                <p class="mb-1 font-semibold">Priorität</p>
                                <span class="text-sm">{{ ticketPriority?.name ?? '–' }}</span>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                <!-- Main: messages + reply -->
                <div class="xl:col-span-9">
                    <div ref="ticketMessagesRef" class="ticket_messages relative space-y-6">
                        <div
                            v-for="item in timeline"
                            :key="item.type === 'message' ? `msg-${(item.data as Message).id}` : (item.data as StatusChange).id"
                            class="ticket_message_row flex gap-4"
                        >
                            <div class="relative hidden shrink-0 md:block md:w-12">
                                <div v-if="item.type === 'message'" class="relative flex h-12 w-12 overflow-hidden rounded-2xl">
                                    <Avatar
                                        :name="(item.data as Message).user?.name"
                                        :src="(item.data as Message).user?.avatar"
                                        size="lg"
                                        class="h-12 w-12 rounded-2xl"
                                    />
                                </div>
                                <template v-else>
                                    <div
                                        class="absolute inset-0 h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-950"
                                        aria-hidden="true"
                                    />
                                    <div
                                        class="relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white text-gray-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
                                    >
                                        <Lock class="h-6 w-6" />
                                    </div>
                                </template>
                            </div>
                            <div class="min-w-0 flex-1">
                                <Card
                                    v-if="item.type === 'message'"
                                    class="overflow-hidden shadow-none"
                                >
                                    <CardHeader class="flex flex-row items-center justify-between space-y-0 border-b py-3">
                                        <h4 class="text-base font-medium">
                                            {{ (item.data as Message).user.name }}
                                            <Badge
                                                v-if="(item.data as Message).sent_via_admin"
                                                class="ml-2 bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/50 dark:text-orange-200"
                                            >
                                                Mitarbeiter
                                            </Badge>
                                        </h4>
                                        <span class="text-sm text-gray-500 dark:text-gray-400">
                                            {{ formatMessageDate((item.data as Message).created_at) }}
                                        </span>
                                    </CardHeader>
                                    <CardContent class="py-3 [&>p]:mb-0.5">
                                        <template v-if="!(item.data as Message).is_hidden">
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
                                                    <Image
                                                        v-else
                                                        class="h-4 w-4 shrink-0"
                                                    />
                                                    <span class="truncate max-w-[200px]">{{ att.name }}</span>
                                                </a>
                                            </div>
                                        </template>
                                        <p v-else class="italic text-gray-500 dark:text-gray-400">
                                            [ Interne Notiz – nur für Support sichtbar ]
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card v-else class="overflow-hidden shadow-none border-gray-200 dark:border-gray-700">
                                    <CardContent class="flex flex-row items-center justify-between gap-2 py-3">
                                        <p class="text-sm text-gray-700 dark:text-gray-300">{{ (item.data as StatusChange).label }}</p>
                                        <span class="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                            {{ formatMessageDate((item.data as StatusChange).created_at) }}
                                        </span>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <!-- Reply form -->
                    <div v-if="ticket.status !== 'closed' && ticket.status !== 'resolved'" class="mt-6 pb-24">
                        <div class="flex gap-4">
                            <div class="relative hidden shrink-0 md:block md:w-12">
                                <div
                                    class="absolute inset-0 h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-950"
                                    aria-hidden="true"
                                />
                                <div
                                    class="relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 text-orange-600 dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
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
                                            <CardTitle class="text-base">Neue Antwort verfassen</CardTitle>
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
                                        class="flex min-h-0 flex-1 flex-col"
                                        @submit.prevent="submitMessage"
                                    >
                                        <CardContent
                                            :class="
                                                replyCardFullscreen
                                                    ? 'flex min-h-0 flex-1 flex-col space-y-4 overflow-auto pt-4'
                                                    : 'space-y-4 pt-4'
                                            "
                                        >
                                            <div :class="{ 'min-h-0 flex-1': replyCardFullscreen }">
                                                <TicketReplyEditor
                                                    v-model="form.body"
                                                    placeholder="Deine Nachricht..."
                                                    :aria-invalid="!!form.errors.body"
                                                    :min-height="replyCardFullscreen ? '100%' : undefined"
                                                />
                                                <InputError :message="form.errors.body" />
                                            </div>
                                            <div v-if="attachmentFiles.length > 0" class="flex flex-wrap gap-2">
                                                <div
                                                    v-for="(file, index) in attachmentFiles"
                                                    :key="index"
                                                    class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
                                                >
                                                    <span class="truncate max-w-[180px]">{{ file.name }}</span>
                                                    <button
                                                        type="button"
                                                        class="shrink-0 rounded p-0.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                                                        aria-label="Anhang entfernen"
                                                        @click="removeAttachment(index)"
                                                    >
                                                        <X class="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter class="shrink-0 flex flex-row flex-wrap items-center justify-between gap-2 border-t py-3">
                                            <div class="flex items-center gap-2">
                                                <input
                                                    ref="fileInputRef"
                                                    type="file"
                                                    class="hidden"
                                                    accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                                                    multiple
                                                    @change="onFileChange"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    class="gap-2"
                                                    @click="triggerFileInput"
                                                >
                                                    <Paperclip class="h-4 w-4" />
                                                    Datei anhängen
                                                </Button>
                                            </div>
                                            <Button
                                                type="submit"
                                                :disabled="sending"
                                                class="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
                                            >
                                                Nachricht senden
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
        </div>
    </AppLayout>
</template>

<style scoped>
.ticket_messages::before {
    border-left: 2px dashed gray;
    content: '';
    position: absolute;
    height: var(--ticket-message-height, 0);
    margin-left: 23px;
    margin-top: 48px;
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
