<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Pencil, Server } from 'lucide-vue-next';
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

type GameServerAccount = {
    id: number;
    name: string;
    status: string;
    current_period_ends_at: string | null;
    option_values: Record<string, unknown> | null;
    custom_monthly_price?: number | string | null;
    user: User;
    hosting_plan: HostingPlan | null;
    hosting_server: HostingServer;
};

type PlanOption = { id: string; name: string; type?: string; min?: number; max?: number; unit?: string };
type HostingPlanConfig = {
    plan_options?: PlanOption[];
    memory?: number;
    disk?: number;
    swap?: number;
    io?: number;
    cpu?: number;
    databases?: number;
    backups?: number;
};

type Props = {
    gameServerAccount: GameServerAccount;
    hostingPlanConfig: HostingPlanConfig;
    isCloudAccount?: boolean;
};

const props = withDefaults(defineProps<Props>(), { isCloudAccount: false });

const config = props.hostingPlanConfig ?? {};
const opt = props.gameServerAccount.option_values ?? {};
const num = (v: unknown, def: number) => (v != null && v !== '' ? Number(v) : def);
const defaultMemory = num(opt.memory, config.memory ?? 512);
const defaultDisk = num(opt.disk, config.disk ?? 5120);
const defaultSwap = num(opt.swap, config.swap ?? 0);
const defaultIo = num(opt.io, config.io ?? 500);
const defaultCpu = num(opt.cpu, config.cpu ?? 0);
const defaultDatabases = num(opt.databases, config.databases ?? 0);
const defaultBackups = num(opt.backups, config.backups ?? 0);

const customPrice = props.gameServerAccount.custom_monthly_price;
const customPriceStr =
    customPrice === null || customPrice === undefined || customPrice === ''
        ? ''
        : String(customPrice);

const form = useForm({
    name: props.gameServerAccount.name,
    status: props.gameServerAccount.status || 'active',
    current_period_ends_at: props.gameServerAccount.current_period_ends_at
        ? new Date(props.gameServerAccount.current_period_ends_at).toISOString().slice(0, 10)
        : '',
    custom_monthly_price: customPriceStr,
    option_values: {
        memory: defaultMemory,
        disk: defaultDisk,
        swap: defaultSwap,
        io: defaultIo,
        cpu: defaultCpu,
        databases: defaultDatabases,
        backups: defaultBackups,
    },
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Game-Server-Accounts', href: '/admin/gaming-accounts' },
    { title: props.gameServerAccount.name, href: `/admin/gaming-accounts/${props.gameServerAccount.id}` },
    { title: 'Bearbeiten', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Game-Server bearbeiten: ${gameServerAccount.name}`" />

        <div class="space-y-6">
            <div class="flex items-center gap-2">
                <Server class="h-8 w-8" />
                <div>
                    <Heading level="h1">Game-Server-Account bearbeiten</Heading>
                    <Text class="mt-2" muted>
                        {{ gameServerAccount.name }} – Kunde: {{ gameServerAccount.user.name }}
                    </Text>
                </div>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Stammdaten</CardTitle>
                    <CardDescription>
                        Name, Status, Laufzeit, manueller Monatspreis und Pterodactyl-Limits (RAM, Disk, …).
                    </CardDescription>
                </CardHeader>
                <form @submit.prevent="form.put(`/admin/gaming-accounts/${gameServerAccount.id}`)" class="space-y-6">
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
                            <Label for="status">Status *</Label>
                            <Select id="status" v-model="form.status" required :aria-invalid="!!form.errors.status">
                                <option value="active">Aktiv</option>
                                <option value="suspended">Gesperrt (suspended)</option>
                                <option value="pending">Ausstehend (pending)</option>
                            </Select>
                            <InputError :message="form.errors.status" />
                        </div>
                        <template v-if="!isCloudAccount">
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
                        </template>
                        <p v-else class="text-muted-foreground text-sm">Cloud-Server: Laufzeit und Preis werden über das Cloud-Abo verwaltet.</p>

                        <div class="border-t pt-4">
                            <Text class="font-medium">Pterodactyl-Limits (Upgrade)</Text>
                            <p class="text-muted-foreground text-sm mb-3">Änderungen werden im Pterodactyl-Panel übernommen.</p>
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="opt_memory">RAM (MB)</Label>
                                    <Input
                                        id="opt_memory"
                                        v-model.number="form.option_values.memory"
                                        type="number"
                                        min="0"
                                        :aria-invalid="!!form.errors['option_values.memory']"
                                    />
                                    <InputError :message="form.errors['option_values.memory']" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="opt_disk">Disk (MB)</Label>
                                    <Input
                                        id="opt_disk"
                                        v-model.number="form.option_values.disk"
                                        type="number"
                                        min="0"
                                        :aria-invalid="!!form.errors['option_values.disk']"
                                    />
                                    <InputError :message="form.errors['option_values.disk']" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="opt_swap">Swap (MB)</Label>
                                    <Input
                                        id="opt_swap"
                                        v-model.number="form.option_values.swap"
                                        type="number"
                                        min="0"
                                        :aria-invalid="!!form.errors['option_values.swap']"
                                    />
                                    <InputError :message="form.errors['option_values.swap']" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="opt_io">IO</Label>
                                    <Input
                                        id="opt_io"
                                        v-model.number="form.option_values.io"
                                        type="number"
                                        min="0"
                                        :aria-invalid="!!form.errors['option_values.io']"
                                    />
                                    <InputError :message="form.errors['option_values.io']" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="opt_cpu">CPU (%)</Label>
                                    <Input
                                        id="opt_cpu"
                                        v-model.number="form.option_values.cpu"
                                        type="number"
                                        min="0"
                                        :aria-invalid="!!form.errors['option_values.cpu']"
                                    />
                                    <InputError :message="form.errors['option_values.cpu']" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="opt_databases">Datenbanken</Label>
                                    <Input
                                        id="opt_databases"
                                        v-model.number="form.option_values.databases"
                                        type="number"
                                        min="0"
                                        :aria-invalid="!!form.errors['option_values.databases']"
                                    />
                                    <InputError :message="form.errors['option_values.databases']" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="opt_backups">Backups</Label>
                                    <Input
                                        id="opt_backups"
                                        v-model.number="form.option_values.backups"
                                        type="number"
                                        min="0"
                                        :aria-invalid="!!form.errors['option_values.backups']"
                                    />
                                    <InputError :message="form.errors['option_values.backups']" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="form.processing">
                            <Pencil class="mr-2 h-4 w-4" />
                            {{ form.processing ? 'Speichern …' : 'Speichern' }}
                        </Button>
                        <Link :href="`/admin/gaming-accounts/${gameServerAccount.id}`">
                            <Button type="button" variant="outline" class="ml-2">Abbrechen</Button>
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AdminLayout>
</template>
