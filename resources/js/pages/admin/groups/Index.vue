<!-- Admin: Gruppen -->
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
    BBadge,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; key: string; name: string; label: string | null };
type Group = {
    id: number;
    key: string;
    name: string;
    label: string;
    color?: string | null;
    permissions?: Permission[];
};

type Props = { groups: Group[] };

const props = defineProps<Props>();

const tableItems = computed(() => (props.groups ?? []).filter((g): g is Group => g != null));

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Gruppen', href: '#' },
];

function destroy(id: number): void {
    if (confirm('Gruppe wirklich löschen? Benutzer-Zuweisungen gehen verloren.')) {
        router.delete(`/admin/groups/${id}`);
    }
}

const tableFields = [
    { key: 'key', label: 'Key', sortable: false },
    { key: 'name', label: 'Name', sortable: false },
    { key: 'label', label: 'Label', sortable: false },
    { key: 'permissions_display', label: 'Berechtigungen', sortable: false },
    { key: 'actions', label: 'Aktionen', sortable: false, thClass: 'text-end' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Gruppen" />

        <BRow>
            <BCol>
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                    <div>
                        <h4 class="mb-1">Gruppen</h4>
                        <p class="text-muted small mb-0">
                            Gruppen mit Berechtigungen verwalten. Benutzer können mehreren Gruppen angehören.
                        </p>
                    </div>
                    <Link href="/admin/groups/create">
                        <BButton variant="primary">
                            <Icon icon="plus" class="me-2" />
                            Neu
                        </BButton>
                    </Link>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">Gruppen</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Key, Name, Label, Berechtigungen</p>
                    </BCardHeader>
                    <BCardBody class="p-0">
                        <BTable
                            :items="tableItems"
                            :fields="tableFields"
                            striped
                            responsive
                            class="mb-0"
                            show-empty
                            empty-text="Keine Gruppen"
                        >
                            <template #cell(key)="row">
                                <code class="small">{{ row.item.key }}</code>
                            </template>
                            <template #cell(name)="row">
                                <span v-if="row.item" class="d-inline-flex align-items-center gap-2">
                                    <span
                                        v-if="row.item.color"
                                        class="rounded-circle border d-inline-block flex-shrink-0"
                                        style="width: 1rem; height: 1rem; border-color: var(--bs-gray-300) !important"
                                        :style="{ backgroundColor: row.item.color }"
                                        :title="row.item.color"
                                    />
                                    {{ row.item.name }}
                                </span>
                                <span v-else class="text-muted">–</span>
                            </template>
                            <template #cell(permissions_display)="row">
                                <span v-if="row.item.permissions?.length" class="d-flex flex-wrap gap-1">
                                    <BBadge
                                        v-for="p in (row.item?.permissions ?? []).slice(0, 5)"
                                        :key="p.id"
                                        variant="secondary"
                                        class="small"
                                    >
                                        {{ p.key }}
                                    </BBadge>
                                    <BBadge
                                        v-if="(row.item?.permissions?.length ?? 0) > 5"
                                        variant="outline-secondary"
                                    >
                                        +{{ (row.item.permissions?.length ?? 0) - 5 }}
                                    </BBadge>
                                </span>
                                <span v-else class="text-muted small">—</span>
                            </template>
                            <template #cell(actions)="row">
                                <template v-if="row.item">
                                    <Link :href="`/admin/groups/${row.item.id}/edit`" class="me-1">
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
