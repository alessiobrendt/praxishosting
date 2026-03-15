<!-- Admin: Berechtigungen -->
<script setup lang="ts">
import { computed } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardHeader,
    BCardTitle,
    BTable,
    BButton,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; key: string; name: string; label: string | null };

type Props = { permissions: Permission[] };

const props = defineProps<Props>();

const tableItems = computed(() => (props.permissions ?? []).filter((p): p is Permission => p != null));

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Berechtigungen', href: '#' },
];

function destroy(id: number): void {
    if (confirm('Berechtigung wirklich löschen? Sie wird aus allen Gruppen entfernt.')) {
        router.delete(`/admin/permissions/${id}`);
    }
}

const tableFields = [
    { key: 'key', label: 'Key', sortable: false },
    { key: 'name', label: 'Name', sortable: false },
    { key: 'label', label: 'Label', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Berechtigungen" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Berechtigungen</h4>
                        <p class="text-muted small mb-0">
                            Berechtigungs-Keys verwalten. Werte * und admin.access gewähren Zugriff.
                        </p>
                    </div>
                    <Link href="/admin/permissions/create">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Neu
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Berechtigungen</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Key, Name, Label</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="tableItems"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Berechtigungen"
                        >
                            <template #cell(key)="row">
                                <code class="small">{{ row.item?.key ?? '–' }}</code>
                            </template>
                            <template #cell(label)="row">
                                {{ row.item?.label ?? '—' }}
                            </template>
                            <template #cell(actions)="row">
                                <template v-if="row.item">
                                    <Link :href="`/admin/permissions/${row.item.id}/edit`" class="me-1">
                                        <BButton variant="outline-primary" size="sm">
                                            <Icon icon="pencil" />
                                        </BButton>
                                    </Link>
                                    <BButton variant="outline-danger" size="sm" @click="destroy(row.item.id)">
                                        <Icon icon="trash" />
                                    </BButton>
                                </template>
                            </template>
                        </BTable>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
