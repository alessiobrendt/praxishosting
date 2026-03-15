<!-- Admin: E-Mail-Vorlage bearbeiten -->
<script setup lang="ts">
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import { useDebounceFn } from '@vueuse/core';
import { ref, watch, onMounted } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BCardFooter,
    BForm,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import {
    index as emailsIndex,
    update as emailsUpdate,
    preview as emailsPreview,
    sendTest as emailsSendTest,
} from '@/routes/admin/emails';
import type { BreadcrumbItem } from '@/types';

type EmailTemplate = {
    key: string;
    name: string;
    subject: string;
    greeting: string;
    body: string;
    action_text: string | null;
};

type Props = {
    emailTemplate: EmailTemplate;
    placeholders: string[];
};

const props = defineProps<Props>();

const form = useForm({
    subject: props.emailTemplate.subject,
    greeting: props.emailTemplate.greeting,
    body: props.emailTemplate.body,
    action_text: props.emailTemplate.action_text ?? '',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'E-Mails', href: emailsIndex().url },
    { title: props.emailTemplate.name, href: '#' },
];

const submit = () => {
    form.put(emailsUpdate.url({ emailTemplate: props.emailTemplate.key }));
};

const previewLoading = ref(false);
const previewError = ref<string | null>(null);
const previewHtml = ref('');

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function fetchPreview() {
    previewError.value = null;
    previewLoading.value = true;
    try {
        const res = await fetch(emailsPreview.url({ emailTemplate: props.emailTemplate.key }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                subject: form.subject,
                greeting: form.greeting,
                body: form.body,
                action_text: form.action_text || null,
            }),
            credentials: 'same-origin',
        });
        const data = await res.json();
        if (!res.ok) {
            previewError.value = data.message ?? 'Vorschau konnte nicht geladen werden.';
            return;
        }
        previewHtml.value = data.html ?? '';
    } catch {
        previewError.value = 'Vorschau konnte nicht geladen werden.';
    } finally {
        previewLoading.value = false;
    }
}

const debouncedFetchPreview = useDebounceFn(fetchPreview, 400);

watch(
    () => [form.subject, form.greeting, form.body, form.action_text],
    () => debouncedFetchPreview(),
    { deep: true },
);

onMounted(() => {
    fetchPreview();
});

function sendTestEmail() {
    router.post(emailsSendTest.url({ emailTemplate: props.emailTemplate.key }), {}, {
        preserveScroll: true,
    });
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`E-Mail-Vorlage: ${emailTemplate.name}`" />

        <BRow>
            <BCol cols="12">
                <div class="mb-3">
                    <h4 class="mb-1">{{ emailTemplate.name }}</h4>
                    <p class="text-muted small mb-0">
                        Vorlage „{{ emailTemplate.key }}“. Platzhalter z. B. :user_name, :site_name werden beim
                        Versand ersetzt.
                    </p>
                </div>
            </BCol>
        </BRow>

        <BRow>
            <BCol xl="6" class="mb-4">
                <BForm @submit.prevent="submit">
                    <BCard no-body>
                        <BCardHeader>
                            <BCardTitle class="mb-0">Inhalt</BCardTitle>
                            <p v-if="placeholders.length" class="text-muted small mb-0 mt-1">
                                Verfügbare Platzhalter: {{ placeholders.map((p) => `:${p}`).join(', ') }}
                            </p>
                        </BCardHeader>
                        <BCardBody>
                            <BFormGroup label="Betreff" label-for="subject">
                                <BFormInput
                                    id="subject"
                                    v-model="form.subject"
                                    required
                                    :aria-invalid="!!form.errors.subject"
                                />
                                <InputError :message="form.errors.subject" />
                            </BFormGroup>
                            <BFormGroup label="Anrede" label-for="greeting">
                                <BFormInput
                                    id="greeting"
                                    v-model="form.greeting"
                                    required
                                    :aria-invalid="!!form.errors.greeting"
                                />
                                <InputError :message="form.errors.greeting" />
                            </BFormGroup>
                            <BFormGroup
                                label="Nachricht (Zeilenumbrüche bleiben erhalten, **fett** für Markdown)"
                                label-for="body"
                            >
                                <BFormTextarea
                                    id="body"
                                    v-model="form.body"
                                    required
                                    rows="12"
                                    class="font-monospace small"
                                    :aria-invalid="!!form.errors.body"
                                />
                                <InputError :message="form.errors.body" />
                            </BFormGroup>
                            <BFormGroup label="Button-Text (optional)" label-for="action_text">
                                <BFormInput
                                    id="action_text"
                                    v-model="form.action_text"
                                    :aria-invalid="!!form.errors.action_text"
                                />
                                <InputError :message="form.errors.action_text" />
                            </BFormGroup>
                        </BCardBody>
                        <BCardFooter class="d-flex flex-wrap gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">
                                Speichern
                            </BButton>
                            <BButton type="button" variant="outline-primary" @click="sendTestEmail">
                                Test senden
                            </BButton>
                            <Link :href="emailsIndex().url">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </BCardFooter>
                    </BCard>
                </BForm>
            </BCol>

            <BCol xl="6" class="mb-4">
                <BCard no-body class="sticky-top">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Live-Vorschau</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Wie die E-Mail beim Versand aussieht (aktualisiert beim Tippen)
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <div
                            v-if="previewError"
                            class="rounded border border-danger bg-danger bg-opacity-10 p-3 small text-danger"
                        >
                            {{ previewError }}
                        </div>
                        <div
                            v-else
                            class="overflow-hidden rounded border border-secondary bg-light"
                            style="min-height: 400px"
                        >
                            <div
                                v-if="previewLoading && !previewHtml"
                                class="d-flex align-items-center justify-content-center text-muted"
                                style="height: 16rem"
                            >
                                Lädt…
                            </div>
                            <iframe
                                v-else
                                :srcdoc="previewHtml"
                                title="E-Mail-Vorschau"
                                class="w-100 border-0"
                                style="height: 70vh; min-height: 400px"
                                sandbox="allow-same-origin"
                            />
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
