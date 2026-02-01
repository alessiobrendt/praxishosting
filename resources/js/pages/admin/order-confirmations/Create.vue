<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed, onMounted } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
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

type FromQuote = {
    id: number;
    number: string;
    user_id: number;
    user?: { id: number; name: string; email: string };
    invoice_date?: string;
    line_items: LineItem[];
};

type Props = {
    customers: Customer[];
    fromQuote: FromQuote | null;
};

const props = defineProps<Props>();

const form = useForm({
    user_id: (props.fromQuote?.user_id ?? '') as string | number,
    quote_id: (props.fromQuote?.id ?? '') as string | number,
    order_date: new Date().toISOString().slice(0, 10),
    line_items: (props.fromQuote?.line_items?.length
        ? props.fromQuote.line_items.map((item, i) => ({
              position: i + 1,
              description: item.description,
              quantity: item.quantity,
              unit: item.unit ?? 'Stück',
              unit_price: item.unit_price,
              amount: item.amount,
          }))
        : [{ position: 1, description: '', quantity: 1, unit: 'Stück', unit_price: 0, amount: 0 }]) as LineItem[],
});

onMounted(() => {
    if (props.fromQuote?.user_id && !form.user_id) {
        form.user_id = props.fromQuote.user_id;
    }
    if (props.fromQuote?.line_items?.length && form.line_items.length === 1 && !form.line_items[0].description) {
        form.line_items = props.fromQuote.line_items.map((item, i) => ({
            position: i + 1,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit ?? 'Stück',
            unit_price: item.unit_price,
            amount: item.amount,
        }));
    }
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
    { title: 'Auftragsbestätigungen', href: '/admin/order-confirmations' },
    { title: 'Neue Auftragsbestätigung', href: '#' },
];

function submit() {
    form.post('/admin/order-confirmations');
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Auftragsbestätigung erstellen" />

        <div class="space-y-6">
            <Heading level="h1">Auftragsbestätigung erstellen</Heading>
            <Text class="mt-2" muted>
                <template v-if="fromQuote">
                    Vorausgefüllt aus Angebot {{ fromQuote.number }}
                </template>
                <template v-else>
                    Auftragsbestätigung mit mehreren Positionen anlegen
                </template>
            </Text>

            <form @submit.prevent="submit" class="space-y-6">
                <Card class="max-w-4xl">
                    <CardHeader>
                        <CardTitle>Kunde & Auftragsdatum</CardTitle>
                        <CardDescription>Auftraggeber und Datum der Bestätigung</CardDescription>
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
                                <Label for="order_date">Auftragsdatum</Label>
                                <Input
                                    id="order_date"
                                    v-model="form.order_date"
                                    type="date"
                                    required
                                    :aria-invalid="!!form.errors.order_date"
                                />
                                <InputError :message="form.errors.order_date" />
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
                        <Button type="submit" :disabled="form.processing">Auftragsbestätigung anlegen</Button>
                        <Link href="/admin/order-confirmations">
                            <Button type="button" variant="outline">Abbrechen</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </form>
        </div>
    </AppLayout>
</template>
