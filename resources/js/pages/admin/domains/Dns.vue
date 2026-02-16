<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Plus, Trash2 } from 'lucide-vue-next';

type DnsRecord = {
    name: string;
    type: string;
    data: string;
};

type Domain = {
    id: number;
    domain: string;
};

type Props = {
    domain: Domain;
    records: DnsRecord[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Domains', href: '/admin/domains' },
    { title: props.domain.domain, href: `/admin/domains/${props.domain.id}` },
    { title: 'DNS', href: '#' },
];

const recordTypes = ['A', 'AAAA', 'CNAME', 'ALIAS', 'MX', 'SRV', 'TXT', 'CAA', 'PTR', 'TLSA', 'DS', 'DNSKEY'];

const form = useForm({
    records: props.records.length
        ? props.records.map((r) => ({ name: r.name, type: r.type, data: r.data }))
        : [{ name: '@', type: 'A', data: '' }],
});

const addRecord = () => {
    form.records.push({ name: '', type: 'A', data: '' });
};

const removeRecord = (index: number) => {
    form.records.splice(index, 1);
};

const submit = () => {
    const valid = form.records.filter((r) => r.name.trim() && r.data.trim());
    form.records = valid;
    form.put(`/admin/domains/${props.domain.id}/dns`, { preserveScroll: true });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`DNS: ${domain.domain}`" />

        <div class="space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Heading level="h1">DNS-Zone: {{ domain.domain }}</Heading>
                    <Text class="mt-2" muted>
                        Alle Einträge müssen übermittelt werden. Löschen = Eintrag entfernen und speichern.
                    </Text>
                </div>
                <Button variant="outline" @click="addRecord">
                    <Plus class="mr-2 h-4 w-4" />
                    Neuer Record
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>DNS-Records</CardTitle>
                    <CardDescription>Typ, Name, Wert – mind. 2–6 Nameserver bei Skrime konfiguriert lassen</CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="submit" class="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Typ</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Wert (Data)</TableHead>
                                    <TableHead class="w-24">Aktion</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="(rec, idx) in form.records" :key="idx">
                                    <TableCell>
                                        <select
                                            v-model="form.records[idx].type"
                                            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                        >
                                            <option
                                                v-for="t in recordTypes"
                                                :key="t"
                                                :value="t"
                                            >
                                                {{ t }}
                                            </option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            v-model="form.records[idx].name"
                                            placeholder="@ oder www"
                                            class="min-w-[120px]"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            v-model="form.records[idx].data"
                                            placeholder="127.0.0.1 oder Ziel"
                                            class="min-w-[200px]"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            :disabled="form.records.length <= 1"
                                            @click="removeRecord(idx)"
                                        >
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <InputError :message="form.errors.records" />
                        <div class="flex gap-2">
                            <Button type="submit" :disabled="form.processing">
                                DNS-Zone speichern
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                :disabled="form.processing"
                                @click="() => router.visit(`/admin/domains/${domain.id}`)"
                            >
                                Zurück zur Domain
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
