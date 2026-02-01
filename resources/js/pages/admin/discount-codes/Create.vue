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

const form = useForm({
    code: '',
    type: 'percent',
    value: '',
    recurrence: 'once',
    valid_from: '',
    valid_until: '',
    max_redemptions: '' as string | number,
    is_active: true,
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rabattcodes', href: '/admin/discount-codes' },
    { title: 'Neu', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Rabattcode anlegen" />

        <div class="space-y-6">
            <Heading level="h1">Rabattcode anlegen</Heading>

            <Card class="max-w-xl">
                <CardHeader>
                    <CardTitle>Rabattcode</CardTitle>
                    <CardDescription>Code, Typ (percent/fixed), Wert, Gültigkeit</CardDescription>
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
                    <Button type="button" @click="form.post('/admin/discount-codes')" :disabled="form.processing">Anlegen</Button>
                    <Link href="/admin/discount-codes"><Button variant="outline">Abbrechen</Button></Link>
                </CardFooter>
            </Card>
        </div>
    </AppLayout>
</template>
