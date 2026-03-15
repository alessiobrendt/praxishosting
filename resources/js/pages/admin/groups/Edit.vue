<!-- Admin: Gruppe bearbeiten -->
<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed, ref, watch } from 'vue';
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
    BFormCheckbox,
    BButton,
    BNav,
    BNavItem,
    BModal,
    BFormSelect,
} from 'bootstrap-vue-next';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; key: string; name: string; label: string | null; category: string | null };
type Group = {
    id: number;
    key: string;
    name: string;
    label: string;
    color?: string | null;
    permissions?: { id: number }[];
};
type GroupForCopy = { id: number; name: string; label: string; permission_ids: number[] };

type Props = { group: Group; permissions: Permission[]; groupsForCopy: GroupForCopy[] };

const props = defineProps<Props>();

const copyFromModalOpen = ref(false);
const selectedGroupIdForCopy = ref<number | ''>('');

const form = useForm({
    key: props.group.key,
    name: props.group.name,
    label: props.group.label,
    color: (props.group.color ?? '') as string,
    permission_ids: (props.group.permissions ?? []).map((p) => p.id),
});

const permissionSearch = ref('');

const categories = computed(() => {
    const set = new Set<string>();
    for (const p of props.permissions) {
        set.add(p.category ?? 'Sonstiges');
    }
    return Array.from(set).sort();
});

const permissionsByCategory = computed(() => {
    const map = new Map<string, Permission[]>();
    for (const p of props.permissions) {
        const cat = p.category ?? 'Sonstiges';
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat)!.push(p);
    }
    for (const arr of map.values()) arr.sort((a, b) => a.key.localeCompare(b.key));
    return map;
});

const filteredPermissionsByCategory = computed(() => {
    const q = permissionSearch.value.trim().toLowerCase();
    if (!q) return permissionsByCategory.value;
    const map = new Map<string, Permission[]>();
    for (const [cat, perms] of permissionsByCategory.value) {
        const filtered = perms.filter(
            (p) =>
                p.key.toLowerCase().includes(q) ||
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.label && p.label.toLowerCase().includes(q)),
        );
        if (filtered.length > 0) map.set(cat, filtered);
    }
    return map;
});

const activeTab = ref(categories.value[0] ?? 'Sonstiges');
watch(
    () => categories.value[0],
    (first) => {
        if (first && !categories.value.includes(activeTab.value)) activeTab.value = first;
    },
);

function setPermission(id: number, checked: boolean) {
    if (checked) {
        form.permission_ids = [...form.permission_ids, id];
    } else {
        form.permission_ids = form.permission_ids.filter((x) => x !== id);
    }
}

function selectAllPermissions() {
    const ids = props.permissions.map((p) => p.id);
    form.permission_ids = [...ids];
}

function copyFromGroup() {
    const g = props.groupsForCopy.find((x) => x.id === selectedGroupIdForCopy.value);
    if (g) {
        form.permission_ids = [...g.permission_ids];
        copyFromModalOpen.value = false;
        selectedGroupIdForCopy.value = '';
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Gruppen', href: '/admin/groups' },
    { title: props.group.name, href: '#' },
];

const copyGroupOptions = computed(() => [
    { value: '', text: 'Bitte wählen…' },
    ...props.groupsForCopy.map((g) => ({ value: g.id, text: g.label || g.name })),
]);
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Gruppe: ${group.name}`" />

        <BRow>
            <BCol>
                <div class="mb-3">
                    <h4 class="mb-1">Gruppe bearbeiten</h4>
                    <p class="text-muted small mb-0">Key, Name, Label, Farbe und zugewiesene Berechtigungen</p>
                </div>

                <BCard no-body>
                    <BCardHeader>
                        <BCardTitle class="mb-0">{{ group.name }}</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">Key, Name, Label, Farbe und zugewiesene Berechtigungen</p>
                    </BCardHeader>
                    <BForm @submit.prevent="form.put(`/admin/groups/${group.id}`)">
                        <BCardBody>
                            <BRow>
                                <BCol md="6" class="mb-3">
                                    <BFormGroup label="Key" label-for="key">
                                        <BFormInput id="key" v-model="form.key" :aria-invalid="!!form.errors.key" />
                                        <InputError :message="form.errors.key" />
                                    </BFormGroup>
                                </BCol>
                                <BCol md="6" class="mb-3">
                                    <BFormGroup label="Name" label-for="name">
                                        <BFormInput
                                            id="name"
                                            v-model="form.name"
                                            required
                                            :aria-invalid="!!form.errors.name"
                                        />
                                        <InputError :message="form.errors.name" />
                                    </BFormGroup>
                                </BCol>
                            </BRow>
                            <BRow>
                                <BCol md="6" class="mb-3">
                                    <BFormGroup label="Label" label-for="label">
                                        <BFormInput
                                            id="label"
                                            v-model="form.label"
                                            required
                                            :aria-invalid="!!form.errors.label"
                                        />
                                        <InputError :message="form.errors.label" />
                                    </BFormGroup>
                                </BCol>
                                <BCol md="6" class="mb-3">
                                    <BFormGroup label="Farbe (für Badge)" label-for="color">
                                        <div class="d-flex align-items-center gap-2">
                                            <input
                                                id="color"
                                                :value="form.color || '#3b82f6'"
                                                type="color"
                                                class="form-control form-control-color p-1"
                                                style="width: 3rem; height: 2.25rem"
                                                @input="form.color = ($event.target as HTMLInputElement).value"
                                            />
                                            <BFormInput
                                                v-model="form.color"
                                                type="text"
                                                placeholder="#3b82f6"
                                                maxlength="7"
                                                class="font-monospace"
                                                :aria-invalid="!!form.errors.color"
                                            />
                                        </div>
                                        <InputError :message="form.errors.color" />
                                    </BFormGroup>
                                </BCol>
                            </BRow>
                            <BFormGroup label="Berechtigungen" class="mb-2">
                                <BFormInput
                                    v-model="permissionSearch"
                                    type="search"
                                    placeholder="In allen Kategorien durchsuchen (Key, Name, Label)…"
                                    class="mb-2"
                                />
                                <div class="d-flex flex-wrap gap-2 mb-3">
                                    <BButton type="button" variant="outline-secondary" size="sm" @click="selectAllPermissions">
                                        Alle Berechtigungen anwählen
                                    </BButton>
                                    <BButton
                                        type="button"
                                        variant="outline-secondary"
                                        size="sm"
                                        @click="copyFromModalOpen = true"
                                    >
                                        Berechtigungen von anderer Rolle übernehmen
                                    </BButton>
                                </div>
                                <BNav tabs class="mb-2 flex-wrap">
                                    <BNavItem
                                        v-for="cat in categories"
                                        :key="cat"
                                        :active="activeTab === cat"
                                        @click="activeTab = cat"
                                    >
                                        {{ cat }}
                                    </BNavItem>
                                </BNav>
                                <div class="border rounded p-3 overflow-auto" style="max-height: 16rem">
                                    <div
                                        v-for="cat in categories"
                                        v-show="activeTab === cat"
                                        :key="cat"
                                        class="small"
                                    >
                                        <div
                                            v-if="filteredPermissionsByCategory.get(cat)?.length"
                                            class="d-flex flex-column gap-2"
                                        >
                                            <div
                                                v-for="p in filteredPermissionsByCategory.get(cat)"
                                                :key="p.id"
                                                class="form-check"
                                            >
                                                <BFormCheckbox
                                                    :id="`perm-${p.id}`"
                                                    :model-value="form.permission_ids.includes(p.id)"
                                                    @update:model-value="(v: boolean) => setPermission(p.id, v)"
                                                >
                                                    <code class="small">{{ p.key }}</code> — {{ p.name }}
                                                </BFormCheckbox>
                                            </div>
                                        </div>
                                        <p v-else class="text-muted small mb-0">
                                            Keine Berechtigungen in dieser Kategorie
                                            {{ permissionSearch ? ' (Filter aktiv)' : '' }}.
                                        </p>
                                    </div>
                                </div>
                                <InputError :message="form.errors.permission_ids" />
                            </BFormGroup>
                        </BCardBody>
                        <BCardFooter class="d-flex gap-2">
                            <BButton type="submit" variant="primary" :disabled="form.processing">
                                <Icon icon="pencil" class="me-2" />
                                Speichern
                            </BButton>
                            <Link href="/admin/groups">
                                <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                            </Link>
                        </BCardFooter>
                    </BForm>
                </BCard>

                <BModal
                    v-model="copyFromModalOpen"
                    title="Berechtigungen von Rolle übernehmen"
                    hide-footer
                    @hidden="selectedGroupIdForCopy = ''"
                >
                    <p class="text-muted small mb-3">
                        Wählen Sie eine Gruppe. Deren Berechtigungen ersetzen die aktuell ausgewählten.
                    </p>
                    <div v-if="groupsForCopy.length">
                        <BFormGroup label="Gruppe" label-for="copy-from-group">
                            <BFormSelect
                                id="copy-from-group"
                                v-model="selectedGroupIdForCopy"
                                :options="copyGroupOptions"
                            />
                        </BFormGroup>
                        <div class="d-flex justify-content-end gap-2 mt-3">
                            <BButton variant="outline-secondary" @click="copyFromModalOpen = false">
                                Abbrechen
                            </BButton>
                            <BButton
                                variant="primary"
                                :disabled="selectedGroupIdForCopy === ''"
                                @click="copyFromGroup"
                            >
                                Übernehmen
                            </BButton>
                        </div>
                    </div>
                    <p v-else class="text-muted small mb-0">Keine anderen Gruppen vorhanden.</p>
                </BModal>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
