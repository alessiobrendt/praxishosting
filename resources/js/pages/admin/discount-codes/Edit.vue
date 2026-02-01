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

type DiscountCode = {
    id: number;
    code: string;
    type: string;
    value: string;
    recurrence: string;
    valid_from: string | null;
    valid_until: string | null;
    max_redemptions: number | null;
    times_redeemed: number;
    is_active: boolean;
};

type Props = { discountCode: DiscountCode };

const props = defineProps<Props>();

const form = useForm({
    code: props.discountCode.code,
    type: props.discountCode.type,
    value: props.discountCode.value,
    recurrence: props.discountCode.recurrence,
    valid_from: props.discountCode.valid_from ? props.discountCode.valid_from.slice(0, 16) : '',
    valid_until: props.discountCode.valid_until ? props.discountCode.valid_until.slice(0, 16) : '',
    max_redemptions: props.discountCode.max_redemptions ?? '',
    is_active: props.discountCode.is_active,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rabattcodes', href: '/admin/discount-codes' },
    { title: props.discountCode.code, href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Rabattcode: ${discountCode.code}`" />

        <div class="space-y-6">
            <Heading level="h1">Rabattcode bearbeiten</Heading>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>{{ discountCode.code }}</CardTitle>
                    <CardDescription>Eingelöst: {{ discountCode.times_redeemed }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="space-y-2">
                        <Label for="code">Code</Label>
                        <Input id="code" v-model="form.code" required :aria-invalid="!!form.errors.code" />
                        <InputError :message="form.errors.code" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="type">Typ</Label>
                            <Select id="type" v-model="form.type">
                                <option value="percent">Prozent</option>
                                <option value="fixed">Fester Betrag</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label for="value">Wert</Label>
                            <Input id="value" v-model="form.value" type="number" step="0.01" min="0" :aria-invalid="!!form.errors.value" />
                            <InputError :message="form.errors.value" />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label for="recurrence">Wiederholung</Label>
                        <Select id="recurrence" v-model="form.recurrence">
                            <option value="once">Einmalig</option>
                            <option value="recurring">Jede Abrechnung</option>
                        </Select>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="valid_from">Gültig von</Label>
                            <Input id="valid_from" v-model="form.valid_from" type="datetime-local" />
                        </div>
                        <div class="space-y-2">
                            <Label for="valid_until">Gültig bis</Label>
                            <Input id="valid_until" v-model="form.valid_until" type="datetime-local" />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label for="max_redemptions">Max. Einlösungen (optional)</Label>
                        <Input id="max_redemptions" v-model="form.max_redemptions" type="number" min="1" />
                    </div>
                    <div class="flex items-center gap-2">
                        <Switch id="is_active" :checked="form.is_active" @update:checked="(v: boolean) => (form.is_active = v)" />
                        <Label for="is_active">Aktiv</Label>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="button" @click="form.put(`/admin/discount-codes/${discountCode.id}`)" :disabled="form.processing">Speichern</Button>
                    <Link href="/admin/discount-codes"><Button variant="outline">Abbrechen</Button></Link>
                </CardFooter>
            </Card>
        </div>
    </AppLayout>
</template>
