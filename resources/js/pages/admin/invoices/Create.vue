<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import { index as invoicesIndex, store } from '@/routes/admin/invoices';
import type { BreadcrumbItem } from '@/types';
import { Plus, Trash2 } from 'lucide-vue-next';

type Customer = {
    id: number;
    name: string;
    email: string;
};

type LineItem = {
    position: number;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    amount: number;
};

type Props = {
    customers: Customer[];
};

const props = defineProps<Props>();

const form = useForm({
    user_id: '' as string | number,
    invoice_date: new Date().toISOString().slice(0, 10),
    due_date: '' as string,
    status: 'draft' as string,
    line_items: [
        { position: 1, description: '', quantity: 1, unit: 'Stück', unit_price: 0, amount: 0 },
    ] as LineItem[],
});

function addRow() {
    const pos = form.line_items.length + 1;
    form.line_items.push({
        position: pos,
        description: '',
        quantity: 1,
        unit: 'Stück',
        unit_price: 0,
        amount: 0,
    });
}

function removeRow(index: number) {
    if (form.line_items.length <= 1) return;
    form.line_items.splice(index, 1);
    form.line_items.forEach((item, i) => {
        item.position = i + 1;
    });
}

function updateLineAmount(index: number) {
    const item = form.line_items[index];
    item.amount = Math.round(item.quantity * item.unit_price * 100) / 100;
}

const totalAmount = computed(() => {
    return form.line_items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toFixed(2);
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Rechnungen', href: invoicesIndex().url },
    { title: 'Neue Rechnung', href: '#' },
];

function submit() {
    form.post(store.url());
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Rechnung erstellen" />

        <div class="space-y-6">
            <Heading level="h1">Rechnung erstellen</Heading>
            <Text class="mt-2" muted>
                Manuelle Rechnung mit mehreren Positionen anlegen
            </Text>

            <form @submit.prevent="submit" class="space-y-6">
                <Card class="max-w-4xl">
                    <CardHeader>
                        <CardTitle>Kunde & Datum</CardTitle>
                        <CardDescription>Rechnungsempfänger und Fälligkeit</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <Label for="user_id">Kunde</Label>
                                <Select
                                    id="user_id"
                                    v-model="form.user_id"
                                    required
                                    :aria-invalid="!!form.errors.user_id"
                                >
                                    <option value="">Bitte wählen</option>
                                    <option
                                        v-for="c in customers"
                                        :key="c.id"
                                        :value="c.id"
                                    >
                                        {{ c.name }} ({{ c.email }})
                                    </option>
                                </Select>
                                <InputError :message="form.errors.user_id" />
                            </div>
                            <div class="space-y-2">
                                <Label for="invoice_date">Rechnungsdatum</Label>
                                <Input
                                    id="invoice_date"
                                    v-model="form.invoice_date"
                                    type="date"
                                    required
                                    :aria-invalid="!!form.errors.invoice_date"
                                />
                                <InputError :message="form.errors.invoice_date" />
                            </div>
                            <div class="space-y-2">
                                <Label for="due_date">Zahlbar bis (optional)</Label>
                                <Input
                                    id="due_date"
                                    v-model="form.due_date"
                                    type="date"
                                    :aria-invalid="!!form.errors.due_date"
                                />
                                <InputError :message="form.errors.due_date" />
                            </div>
                            <div class="space-y-2">
                                <Label for="status">Status</Label>
                                <Select id="status" v-model="form.status">
                                    <option value="draft">Entwurf</option>
                                    <option value="sent">Versendet</option>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card class="max-w-4xl">
                    <CardHeader class="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Positionen</CardTitle>
                            <CardDescription>Beschreibung, Menge, Einzelpreis – Betrag wird berechnet</CardDescription>
                        </div>
                        <Button type="button" variant="outline" size="sm" @click="addRow">
                            <Plus class="size-4 mr-1" />
                            Zeile
                        </Button>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div
                            v-for="(item, index) in form.line_items"
                            :key="index"
                            class="grid grid-cols-12 gap-2 items-end"
                        >
                            <div class="col-span-1">
                                <Label :for="`pos-${index}`">Pos.</Label>
                                <Input
                                    :id="`pos-${index}`"
                                    v-model.number="item.position"
                                    type="number"
                                    min="1"
                                    class="w-14"
                                />
                            </div>
                            <div class="col-span-4">
                                <Label :for="`desc-${index}`">Beschreibung</Label>
                                <Input
                                    :id="`desc-${index}`"
                                    v-model="item.description"
                                    :aria-invalid="!!form.errors[`line_items.${index}.description`]"
                                />
                                <InputError :message="form.errors[`line_items.${index}.description`]" />
                            </div>
                            <div class="col-span-1">
                                <Label :for="`qty-${index}`">Menge</Label>
                                <Input
                                    :id="`qty-${index}`"
                                    v-model.number="item.quantity"
                                    type="number"
                                    min="0.001"
                                    step="0.001"
                                    @blur="updateLineAmount(index)"
                                />
                            </div>
                            <div class="col-span-1">
                                <Label :for="`unit-${index}`">Einheit</Label>
                                <Input
                                    :id="`unit-${index}`"
                                    v-model="item.unit"
                                    placeholder="Stück"
                                />
                            </div>
                            <div class="col-span-2">
                                <Label :for="`price-${index}`">Einzelpreis (€)</Label>
                                <Input
                                    :id="`price-${index}`"
                                    v-model.number="item.unit_price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    @blur="updateLineAmount(index)"
                                />
                            </div>
                            <div class="col-span-2">
                                <Label :for="`amount-${index}`">Betrag (€)</Label>
                                <Input
                                    :id="`amount-${index}`"
                                    v-model.number="item.amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    readonly
                                    class="bg-muted"
                                />
                            </div>
                            <div class="col-span-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    :disabled="form.line_items.length <= 1"
                                    @click="removeRow(index)"
                                >
                                    <Trash2 class="size-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                        <div class="flex justify-end border-t pt-4">
                            <Text class="font-semibold">Gesamtbetrag: {{ totalAmount }} €</Text>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="form.processing">Rechnung anlegen</Button>
                        <Link :href="invoicesIndex().url">
                            <Button type="button" variant="outline">Abbrechen</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </form>
        </div>
    </AppLayout>
</template>
