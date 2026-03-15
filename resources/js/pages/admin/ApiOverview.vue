<!-- Admin: API-Übersicht -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Props = {
    apiBaseUrl: string;
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'API', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="API Übersicht" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Public API</h4>
                    <p class="text-muted small mb-0">
                        Die API liefert Daten für Ihre Landing-Page und Konfiguratoren: Unternehmens-Statistiken,
                        Domain-Preise und Verfügbarkeit, Hosting-Pläne inkl. Konfiguration sowie Pterodactyl Nests und Eggs.
                    </p>
                </div>

                <BRow>
                    <BCol md="6">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0 d-flex align-items-center gap-2">
                                    <Icon icon="book" />Dokumentation
                                </BCardTitle>
                                <p class="text-muted small mb-0 mt-1">
                                    Alle Endpoints mit Methode, URL, Headers und Request/Response-Beispielen
                                </p>
                            </BCardHeader>
                            <BCardBody>
                                <Link href="/admin/api/docs">
                                    <BButton variant="outline-primary">
                                        <Icon icon="external-link" class="me-2" />Zur API-Dokumentation
                                    </BButton>
                                </Link>
                            </BCardBody>
                        </BCard>
                    </BCol>
                    <BCol md="6">
                        <BCard no-body class="mb-4">
                            <BCardHeader>
                                <BCardTitle class="mb-0 d-flex align-items-center gap-2">
                                    <Icon icon="key" />API-Tokens
                                </BCardTitle>
                                <p class="text-muted small mb-0 mt-1">
                                    Erstellen und verwalten Sie Tokens in den Einstellungen. Jeder Token wird einmalig im Klartext angezeigt.
                                </p>
                            </BCardHeader>
                            <BCardBody>
                                <Link href="/settings/api-tokens">
                                    <BButton variant="outline-primary">
                                        <Icon icon="key" class="me-2" />API-Tokens verwalten
                                    </BButton>
                                </Link>
                            </BCardBody>
                        </BCard>
                    </BCol>
                </BRow>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Authentifizierung</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Alle API-Anfragen müssen den Header
                            <code class="rounded bg-light px-1 py-0 font-monospace">Authorization: Bearer &lt;Ihr-Token&gt;</code>
                            enthalten. Tokens erstellen Sie unter Einstellungen → API-Tokens.
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <p class="small text-muted mb-0">
                            Basis-URL: <code class="rounded bg-light px-1 py-0 font-monospace text-break">{{ apiBaseUrl }}</code>
                        </p>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
