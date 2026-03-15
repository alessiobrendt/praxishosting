<template>
    <DefaultLayout>
        <Head title="Ticket erstellen" />
        <PageBreadcrumb
            title="Ticket erstellen"
            subtitle="Support Tickets"
            subtitle-url="/support"
        />

        <BRow>
            <BCol md="3" class="mb-4">
                <BCard class="mb-3 border-danger">
                    <BCardBody class="d-flex gap-3">
                        <div class="rounded bg-danger bg-opacity-10 p-2 flex-shrink-0">
                            <Icon icon="home" class="text-danger" />
                        </div>
                        <div>
                            <h6 class="fw-semibold text-danger">Verzögerter Support in der Nacht</h6>
                            <p class="small text-muted mb-0">
                                Bitte beachte, dass es in der Nacht länger dauern kann, bis wir dein Support-Ticket bearbeiten.
                            </p>
                        </div>
                    </BCardBody>
                </BCard>
                <BCard v-if="discordInviteUrl" class="border-warning">
                    <BCardBody class="d-flex gap-3">
                        <div class="rounded bg-warning bg-opacity-10 p-2 flex-shrink-0">
                            <Icon icon="message-circle" class="text-warning" />
                        </div>
                        <div>
                            <h6 class="fw-semibold">Community-Discord</h6>
                            <p class="small text-muted mb-2">Austausch mit anderen Nutzern.</p>
                            <a :href="discordInviteUrl" target="_blank" rel="noopener noreferrer" class="small">Zum Community-Discord</a>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
            <BCol md="9">
                <BCard>
                    <BCardHeader class="d-flex align-items-center gap-2">
                        <span class="rounded-circle bg-primary bg-opacity-10 p-2">
                            <Icon icon="plus" class="text-primary" />
                        </span>
                        Neues Support-Ticket erstellen
                    </BCardHeader>
                    <BCardBody>
                        <BForm @submit.prevent="form.post(store.url)">
                            <BRow>
                                <BCol md="8" class="mb-3">
                                    <BFormGroup label="Betreff" label-for="subject">
                                        <BFormInput
                                            id="subject"
                                            v-model="form.subject"
                                            placeholder="Beschreibe dein Anliegen möglichst genau"
                                            :class="{ 'is-invalid': form.errors.subject }"
                                        />
                                        <div v-if="form.errors.subject" class="invalid-feedback d-block">{{ form.errors.subject }}</div>
                                    </BFormGroup>
                                </BCol>
                                <BCol md="4" class="mb-3">
                                    <BFormGroup label="Kategorie" label-for="ticket_category_id">
                                        <BFormSelect
                                            id="ticket_category_id"
                                            v-model="form.ticket_category_id"
                                            :options="categoryOptions"
                                            :class="{ 'is-invalid': form.errors.ticket_category_id }"
                                        />
                                        <div v-if="form.errors.ticket_category_id" class="invalid-feedback d-block">{{ form.errors.ticket_category_id }}</div>
                                    </BFormGroup>
                                </BCol>
                            </BRow>

                            <BRow>
                                <BCol md="8" class="mb-3">
                                    <BFormGroup label="Betroffener Dienst" label-for="affected_services">
                                        <div ref="serviceSelectRef" class="position-relative">
                                            <BButton
                                                id="affected_services"
                                                type="button"
                                                variant="outline-secondary"
                                                class="w-100 d-flex align-items-center justify-content-between"
                                                :class="{ 'is-invalid': form.errors.affected_services }"
                                                @click="serviceSelectOpen = !serviceSelectOpen"
                                            >
                                                <span class="text-start text-truncate">{{ serviceSelectLabel }}</span>
                                                <Icon icon="chevron-down" class="ms-2 flex-shrink-0" />
                                            </BButton>
                                            <div
                                                v-show="serviceSelectOpen"
                                                class="position-absolute top-100 start-0 end-0 mt-1 border rounded bg-white shadow-lg p-2 z-3"
                                                style="max-height: 280px; overflow-y: auto;"
                                            >
                                                <template v-if="hasAnyServices">
                                                    <div v-for="group in serviceGroups" :key="group.key" class="mb-2">
                                                        <div class="small fw-semibold text-muted px-2 py-1">{{ group.title }}</div>
                                                        <div v-for="item in group.items" :key="`${item.type}-${item.id}`" class="form-check">
                                                            <BFormCheckbox
                                                                :id="`service-${item.type}-${item.id}`"
                                                                :checked="isSelected(item.type, item.id)"
                                                                @change="(e: Event) => setService(item.type, item.id, (e.target as HTMLInputElement).checked)"
                                                            >
                                                                {{ item.label }}
                                                            </BFormCheckbox>
                                                        </div>
                                                    </div>
                                                </template>
                                                <p v-else class="small text-muted mb-0 px-2">Keine Dienste zugeordnet</p>
                                            </div>
                                        </div>
                                        <div class="form-text">Optional: Ein oder mehrere Dienste wählen.</div>
                                        <div v-if="form.errors.affected_services" class="invalid-feedback d-block">{{ form.errors.affected_services }}</div>
                                    </BFormGroup>
                                </BCol>
                                <BCol v-if="priorities.length" md="4" class="mb-3">
                                    <BFormGroup label="Priorität" label-for="ticket_priority_id">
                                        <BFormSelect id="ticket_priority_id" v-model="form.ticket_priority_id" :options="priorityOptions" />
                                    </BFormGroup>
                                </BCol>
                            </BRow>

                            <BFormGroup label="Nachricht" label-for="body" class="mb-3">
                                <BFormTextarea
                                    id="body"
                                    v-model="form.body"
                                    rows="6"
                                    placeholder="Beschreibe dein Anliegen..."
                                    :class="{ 'is-invalid': form.errors.body }"
                                />
                                <div v-if="form.errors.body" class="invalid-feedback d-block">{{ form.errors.body }}</div>
                            </BFormGroup>

                            <div class="d-flex flex-wrap justify-content-between gap-2">
                                <Link :href="supportIndex.url">
                                    <BButton type="button" variant="outline-secondary">Abbrechen</BButton>
                                </Link>
                                <BButton type="submit" variant="primary" :disabled="form.processing">
                                    Ticket erstellen
                                </BButton>
                            </div>
                        </BForm>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </DefaultLayout>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormCheckbox,
    BFormTextarea,
    BButton,
} from 'bootstrap-vue-next';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import PageBreadcrumb from '@/components/PageBreadcrumb.vue';
import Icon from '@/components/wrappers/Icon.vue';
import { dashboard } from '@/routes';
import { index as supportIndex, store } from '@/routes/support';

type ServiceItem = { type: string; id: number; label: string };
type ServicesPayload = {
    websites: ServiceItem[];
    domains: ServiceItem[];
    webspaces: ServiceItem[];
    gameserver: ServiceItem[];
    teamspeak: ServiceItem[];
};
type Category = { id: number; name: string; slug: string };
type Priority = { id: number; name: string; slug: string; color: string | null };

const page = usePage();
const discordInviteUrl = computed(() => (page.props.discordInviteUrl as string | null) ?? null);

const props = defineProps<{
    services: ServicesPayload;
    categories: Category[];
    priorities: Priority[];
}>();

type AffectedService = { type: string; id: number };
const form = useForm({
    subject: '',
    body: '',
    ticket_category_id: '' as string | number,
    ticket_priority_id: '' as string | number,
    affected_services: [] as AffectedService[],
});

function isSelected(type: string, id: number): boolean {
    return form.affected_services.some((s) => s.type === type && s.id === id);
}

function setService(type: string, id: number, checked: boolean): void {
    if (checked) {
        form.affected_services = [...form.affected_services, { type, id }];
    } else {
        form.affected_services = form.affected_services.filter((s) => !(s.type === type && s.id === id));
    }
}

const serviceSelectLabel = computed(() => {
    const n = form.affected_services.length;
    if (n === 0) return 'Allgemein / Kein Dienst';
    if (n === 1) {
        const [s] = form.affected_services;
        const group = serviceGroups.value.find((g) => g.items.some((i) => i.type === s.type && i.id === s.id));
        const item = group?.items.find((i) => i.type === s.type && i.id === s.id);
        return item?.label ?? `${n} Dienst`;
    }
    return `${n} Dienste ausgewählt`;
});

const hasAnyServices = computed(() => serviceGroups.value.length > 0);

const serviceSelectOpen = ref(false);
const serviceSelectRef = ref<HTMLElement | null>(null);
onClickOutside(serviceSelectRef, () => {
    serviceSelectOpen.value = false;
});

const serviceGroups = computed(() => {
    const groups: { title: string; key: keyof ServicesPayload; items: ServiceItem[] }[] = [];
    if (props.services.websites?.length) groups.push({ title: 'Websites', key: 'websites', items: props.services.websites });
    if (props.services.domains?.length) groups.push({ title: 'Domains', key: 'domains', items: props.services.domains });
    if (props.services.webspaces?.length) groups.push({ title: 'Webspaces', key: 'webspaces', items: props.services.webspaces });
    if (props.services.gameserver?.length) groups.push({ title: 'Gameserver', key: 'gameserver', items: props.services.gameserver });
    if (props.services.teamspeak?.length) groups.push({ title: 'TeamSpeak-Server', key: 'teamspeak', items: props.services.teamspeak });
    return groups;
});

const categoryOptions = computed(() => [
    { value: '', text: '-- Bitte wählen --' },
    ...props.categories.map((c) => ({ value: c.id, text: c.name })),
]);

const priorityOptions = computed(() => [
    { value: '', text: '-- Bitte wählen --' },
    ...props.priorities.map((p) => ({ value: p.id, text: p.name })),
]);
</script>
