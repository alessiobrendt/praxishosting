<!-- Admin: E-Mail-Vorlagen -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import { edit as emailsEdit, index as emailsIndex } from '@/routes/admin/emails';
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
    templates: EmailTemplate[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'E-Mails', href: emailsIndex().url },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="E-Mails" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">E-Mails</h4>
                    <p class="text-muted small mb-0">
                        E-Mail-Vorlagen und Benachrichtigungen (Bestellung, Rechnung, Zahlung, Abo, Sperrung,
                        Löschung)
                    </p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Vorlagen</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Diese E-Mails werden automatisch versendet. Vorschau und Test-Versand können später
                            ergänzt werden.
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <ul class="list-group list-group-flush">
                            <li
                                v-for="template in templates"
                                :key="template.key"
                                class="list-group-item d-flex align-items-center justify-content-between px-0"
                            >
                                <div>
                                    <span class="fw-medium">{{ template.name }}</span>
                                    <span class="text-muted small ms-2">({{ template.key }})</span>
                                </div>
                                <Link :href="emailsEdit.url({ emailTemplate: template.key })">
                                    <BButton variant="outline-primary" size="sm">
                                        <Icon icon="pencil" class="me-1" />
                                        Bearbeiten
                                    </BButton>
                                </Link>
                            </li>
                        </ul>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
