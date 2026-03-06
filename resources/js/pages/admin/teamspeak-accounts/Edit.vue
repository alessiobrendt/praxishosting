<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Headphones, Pencil } from 'lucide-vue-next';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type User = { id: number; name: string; email: string };
type HostingPlan = { id: number; name: string };
type HostingServer = { id: number; name: string | null; hostname: string } | null;

type TeamSpeakServerAccount = {
    id: number;
    name: string;
    port: number | null;
    virtual_server_id: number | null;
    status: string;
    current_period_ends_at: string | null;
    option_values: Record<string, unknown> | null;
    custom_monthly_price?: number | string | null;
    user: User;
    hosting_plan: HostingPlan;
    hosting_server: HostingServer;
};

type Props = {
    teamSpeakServerAccount: TeamSpeakServerAccount;
};

const props = defineProps<Props>();

const slotsDefault = (props.teamSpeakServerAccount.option_values?.slots as number) ?? 32;
const slotsNum = typeof slotsDefault === 'number' ? slotsDefault : parseInt(String(slotsDefault), 10) || 32;

const customPrice = props.teamSpeakServerAccount.custom_monthly_price;
const customPriceStr =
    customPrice === null || customPrice === undefined || customPrice === ''
        ? ''
        : String(customPrice);

const form = useForm({
    name: props.teamSpeakServerAccount.name,
    port: props.teamSpeakServerAccount.port ?? '',
    slots: slotsNum,
    current_period_ends_at: props.teamSpeakServerAccount.current_period_ends_at
        ? new Date(props.teamSpeakServerAccount.current_period_ends_at).toISOString().slice(0, 10)
        : '',
    status: props.teamSpeakServerAccount.status || 'active',
    custom_monthly_price: customPriceStr,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'TeamSpeak-Server-Accounts', href: '/admin/teamspeak-accounts' },
    { title: props.teamSpeakServerAccount.name, href: `/admin/teamspeak-accounts/${props.teamSpeakServerAccount.id}` },
    { title: 'Bearbeiten', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`TeamSpeak bearbeiten: ${teamSpeakServerAccount.name}`" />

        <div class="space-y-6">
            <div class="flex items-center gap-2">
                <Headphones class="h-8 w-8" />
                <div>
                    <Heading level="h1">TeamSpeak-Account bearbeiten</Heading>
                    <Text class="mt-2" muted>
                        {{ teamSpeakServerAccount.name }} – Kunde: {{ teamSpeakServerAccount.user.name }}
                    </Text>
                </div>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Stammdaten</CardTitle>
                    <CardDescription>
                        Name, Port (nur in der Datenbank), Slots (wird am TeamSpeak-Server übernommen), Laufzeit und Status.
                    </CardDescription>
                </CardHeader>
                <form @submit.prevent="form.put(`/admin/teamspeak-accounts/${teamSpeakServerAccount.id}`)" class="space-y-6">
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="name">Server-Name *</Label>
                            <Input
                                id="name"
                                v-model="form.name"
                                type="text"
                                required
                                maxlength="255"
                                :aria-invalid="!!form.errors.name"
                            />
                            <InputError :message="form.errors.name" />
                        </div>
                        <div class="space-y-2">
                            <Label for="port">Port</Label>
                            <Input
                                id="port"
                                v-model.number="form.port"
                                type="number"
                                min="1"
                                max="65535"
                                placeholder="z. B. 9987"
                                :aria-invalid="!!form.errors.port"
                            />
                            <p class="text-muted-foreground text-sm">Nur in der Datenbank gespeichert. Port-Änderung am TeamSpeak-Host wird hier nicht durchgeführt.</p>
                            <InputError :message="form.errors.port" />
                        </div>
                        <div class="space-y-2">
                            <Label for="slots">Slots (Max. Clients) *</Label>
                            <Input
                                id="slots"
                                v-model.number="form.slots"
                                type="number"
                                min="1"
                                max="9999"
                                required
                                :aria-invalid="!!form.errors.slots"
                            />
                            <p class="text-muted-foreground text-sm">Wird am TeamSpeak-Server übernommen.</p>
                            <InputError :message="form.errors.slots" />
                        </div>
                        <div class="space-y-2">
                            <Label for="current_period_ends_at">Abo-Ende (Laufzeit)</Label>
                            <Input
                                id="current_period_ends_at"
                                v-model="form.current_period_ends_at"
                                type="date"
                                :aria-invalid="!!form.errors.current_period_ends_at"
                            />
                            <InputError :message="form.errors.current_period_ends_at" />
                        </div>
                        <div class="space-y-2">
                            <Label for="status">Status *</Label>
                            <Select id="status" v-model="form.status" required :aria-invalid="!!form.errors.status">
                                <option value="active">Aktiv</option>
                                <option value="suspended">Gesperrt (suspended)</option>
                                <option value="pending">Ausstehend (pending)</option>
                            </Select>
                            <InputError :message="form.errors.status" />
                        </div>
                        <div class="space-y-2">
                            <Label for="custom_monthly_price">Manueller Monatspreis (€)</Label>
                            <Input
                                id="custom_monthly_price"
                                v-model="form.custom_monthly_price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Leer = aus Plan + Optionen"
                                :aria-invalid="!!form.errors.custom_monthly_price"
                            />
                            <p class="text-muted-foreground text-sm">Optional. Wenn gesetzt, wird dieser Betrag für Abo/Verlängerung verwendet.</p>
                            <InputError :message="form.errors.custom_monthly_price" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="form.processing">
                            <Pencil class="mr-2 h-4 w-4" />
                            {{ form.processing ? 'Speichern …' : 'Speichern' }}
                        </Button>
                        <Link :href="`/admin/teamspeak-accounts/${teamSpeakServerAccount.id}`">
                            <Button type="button" variant="outline" class="ml-2">Abbrechen</Button>
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AdminLayout>
</template>
