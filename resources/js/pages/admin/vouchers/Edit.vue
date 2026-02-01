<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Voucher = {
    id: number;
    code: string;
    balance: string;
    use_type: string;
    user_id: number | null;
    is_active: boolean;
    user?: { id: number; name: string; email: string } | null;
};

type Props = { voucher: Voucher };

const props = defineProps<Props>();

const form = useForm({
    code: props.voucher.code,
    balance: props.voucher.balance,
    use_type: props.voucher.use_type,
    user_id: props.voucher.user_id ?? '',
    is_active: props.voucher.is_active,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Gutscheine', href: '/admin/vouchers' },
    { title: props.voucher.code, href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Gutschein: ${voucher.code}`" />

        <div class="space-y-6">
            <Heading level="h1">Gutschein bearbeiten</Heading>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>{{ voucher.code }}</CardTitle>
                    <CardDescription>Betrag: {{ voucher.balance }} €</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="space-y-2">
                        <Label for="code">Code</Label>
                        <Input id="code" v-model="form.code" required :aria-invalid="!!form.errors.code" />
                        <InputError :message="form.errors.code" />
                    </div>
                    <div class="space-y-2">
                        <Label for="balance">Betrag (€)</Label>
                        <Input id="balance" v-model="form.balance" type="number" step="0.01" min="0" required :aria-invalid="!!form.errors.balance" />
                        <InputError :message="form.errors.balance" />
                    </div>
                    <div class="space-y-2">
                        <Label for="use_type">Nutzung</Label>
                        <Select id="use_type" v-model="form.use_type">
                            <option value="single_use">Einmal</option>
                            <option value="multi_use">Mehrfach</option>
                        </Select>
                    </div>
                    <div class="flex items-center gap-2">
                        <Switch id="is_active" :checked="form.is_active" @update:checked="(v: boolean) => (form.is_active = v)" />
                        <Label for="is_active">Aktiv</Label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="button" @click="form.put(`/admin/vouchers/${voucher.id}`)" :disabled="form.processing">Speichern</Button>
                    <Link href="/admin/vouchers"><Button variant="outline">Abbrechen</Button></Link>
                </CardFooter>
            </Card>
        </div>
    </AppLayout>
</template>
