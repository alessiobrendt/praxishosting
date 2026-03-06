<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { ChevronDown, Home, MessageCircle } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import { index as supportIndex, store } from '@/routes/support';
import type { BreadcrumbItem } from '@/types';

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

type Props = {
    services: ServicesPayload;
    categories: Category[];
    priorities: Priority[];
};

const props = defineProps<Props>();

const page = usePage();
const discordInviteUrl = computed(() => (page.props.discordInviteUrl as string | null) ?? null);

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
    if (n === 0) {
        return 'Allgemein / Kein Dienst';
    }
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
    if (props.services.websites?.length) {
        groups.push({ title: 'Websites', key: 'websites', items: props.services.websites });
    }
    if (props.services.domains?.length) {
        groups.push({ title: 'Domains', key: 'domains', items: props.services.domains });
    }
    if (props.services.webspaces?.length) {
        groups.push({ title: 'Webspaces', key: 'webspaces', items: props.services.webspaces });
    }
    if (props.services.gameserver?.length) {
        groups.push({ title: 'Gameserver', key: 'gameserver', items: props.services.gameserver });
    }
    if (props.services.teamspeak?.length) {
        groups.push({ title: 'TeamSpeak-Server', key: 'teamspeak', items: props.services.teamspeak });
    }
    return groups;
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Start', href: dashboard().url },
    { title: 'Support Tickets', href: supportIndex().url },
    { title: 'Ticket erstellen', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Ticket erstellen" />

        <div class="page space-y-4">
            <!-- Page header -->
            <div class="page-header mb-3">
                <h2 class="page-title text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Ticket erstellen
                </h2>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-12" style="margin-bottom: 3rem;">
                <!-- Left sidebar -->
                <aside class="md:col-span-3">
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

                    <!-- Discord Community -->
                    <Card
                        v-if="discordInviteUrl"
                        class="border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-950/40"
                    >
                        <CardContent class="flex gap-4 pt-6">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 dark:bg-orange-900/50 dark:text-orange-400">
                                <MessageCircle class="h-6 w-6" />
                            </div>
                            <div>
                                <h3 class="font-semibold text-orange-900 dark:text-orange-100">
                                    Kennst du schon unseren Community-Discord?
                                </h3>
                                <p class="mt-1 text-sm text-orange-800 dark:text-orange-200">
                                    Auf unserem Community-Discord kannst du dich mit anderen Nutzern austauschen,
                                    Fragen stellen, Tipps und Tricks erhalten und immer auf dem Laufenden bleiben.
                                    Schau gerne vorbei und werde Teil der Community!
                                </p>
                                <a
                                    :href="discordInviteUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="mt-2 inline-block text-sm font-medium text-orange-700 underline hover:text-orange-800 dark:text-orange-300 dark:hover:text-orange-200"
                                >
                                    Zum Community-Discord
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                <!-- Form -->
                <div class="md:col-span-9">
                    <Card>
                        <CardHeader class="border-b py-4">
                            <CardTitle class="flex items-center gap-2 text-lg">
                                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </span>
                                Neues Support-Ticket erstellen
                            </CardTitle>
                        </CardHeader>
                        <form @submit.prevent="form.post(store().url)">
                            <CardContent class="space-y-4 pt-6">
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div class="sm:col-span-2">
                                        <Label for="subject">Betreff</Label>
                                        <Input
                                            id="subject"
                                            v-model="form.subject"
                                            class="mt-1"
                                            placeholder="Beschreibe dein Anliegen möglichst genau"
                                            required
                                            :aria-invalid="!!form.errors.subject"
                                        />
                                        <InputError :message="form.errors.subject" />
                                    </div>
                                    <div>
                                        <Label for="ticket_category_id">Kategorie</Label>
                                        <Select
                                            id="ticket_category_id"
                                            v-model="form.ticket_category_id"
                                            class="mt-1"
                                            required
                                            :aria-invalid="!!form.errors.ticket_category_id"
                                        >
                                            <option value="">-- Bitte wählen --</option>
                                            <option v-for="c in props.categories" :key="c.id" :value="c.id">
                                                {{ c.name }}
                                            </option>
                                        </Select>
                                        <InputError :message="form.errors.ticket_category_id" />
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div ref="serviceSelectRef" class="relative sm:col-span-2">
                                        <Label id="affected_service_label">Betroffener Dienst</Label>
                                        <button
                                            type="button"
                                            id="affected_service"
                                            :aria-expanded="serviceSelectOpen"
                                            :aria-invalid="!!form.errors.affected_services"
                                            :aria-labelledby="'affected_service_label'"
                                            :aria-haspopup="'listbox'"
                                            :class="cn(
                                                'mt-1 flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm',
                                                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                                                'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
                                                form.errors.affected_services && 'border-red-500 focus:ring-red-500 dark:border-red-500',
                                            )"
                                            @click="serviceSelectOpen = !serviceSelectOpen"
                                        >
                                            <span class="truncate">{{ serviceSelectLabel }}</span>
                                            <ChevronDown
                                                class="ml-2 h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400 transition-transform"
                                                :class="serviceSelectOpen && 'rotate-180'"
                                            />
                                        </button>
                                        <div
                                            v-show="serviceSelectOpen"
                                            class="absolute top-full left-0 z-50 mt-1 max-h-[min(20rem,70vh)] min-w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                            role="listbox"
                                        >
                                            <template v-if="hasAnyServices">
                                                <div
                                                    v-for="group in serviceGroups"
                                                    :key="group.key"
                                                    class="mb-3 last:mb-0"
                                                >
                                                    <div class="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        {{ group.title }}
                                                    </div>
                                                    <div class="space-y-0.5">
                                                        <label
                                                            v-for="item in group.items"
                                                            :key="`${item.type}-${item.id}`"
                                                            class="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        >
                                                            <Checkbox
                                                                :id="`service-${item.type}-${item.id}`"
                                                                :model-value="isSelected(item.type, item.id)"
                                                                @update:model-value="(v: boolean) => setService(item.type, item.id, v)"
                                                            />
                                                            <span class="text-gray-700 dark:text-gray-300">{{ item.label }}</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </template>
                                            <p v-else class="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">
                                                Keine Dienste zugeordnet
                                            </p>
                                        </div>
                                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Optional: Ein oder mehrere Dienste wählen. Keine Auswahl = Allgemein / Kein Dienst.
                                        </p>
                                        <InputError :message="form.errors.affected_services" />
                                    </div>
                                    <div v-if="props.priorities.length">
                                        <Label for="ticket_priority_id">Priorität</Label>
                                        <Select id="ticket_priority_id" v-model="form.ticket_priority_id" class="mt-1">
                                            <option value="">-- Bitte wählen --</option>
                                            <option v-for="p in props.priorities" :key="p.id" :value="p.id">
                                                {{ p.name }}
                                            </option>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label for="body">Nachricht</Label>
                                    <textarea
                                        id="body"
                                        v-model="form.body"
                                        class="mt-1 flex min-h-[160px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-700 dark:bg-gray-900 dark:placeholder:text-gray-500"
                                        placeholder="Beschreibe dein Anliegen..."
                                        required
                                        :aria-invalid="!!form.errors.body"
                                    />
                                    <InputError :message="form.errors.body" />
                                </div>
                            </CardContent>
                            <CardFooter class="flex flex-row flex-wrap items-center justify-between gap-4 border-t py-4">
                                <div class="order-2 sm:order-1">
                                    <Link :href="supportIndex().url">
                                        <Button type="button" variant="outline">Abbrechen</Button>
                                    </Link>
                                </div>
                                <div class="order-1 w-full sm:order-2 sm:w-auto">
                                    <Button
                                        type="submit"
                                        :disabled="form.processing"
                                        class="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 sm:w-auto"
                                    >
                                        Ticket erstellen
                                    </Button>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
