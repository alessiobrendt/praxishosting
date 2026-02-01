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
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Option = { id: number; label: string };

type Props = {
    typeLabels: Record<string, string>;
    invoices: Option[];
    sites: Option[];
    users: Option[];
};

const props = defineProps<Props>();

const form = useForm({
    type: 'payment_reminder',
    subject_type: 'Invoice' as 'Invoice' | 'Site' | 'User',
    subject_id: '' as string | number,
    sent_at: new Date().toISOString().slice(0, 16),
    note: '',
});

const subjectOptions = computed(() => {
    if (form.subject_type === 'Invoice') return props.invoices;
    if (form.subject_type === 'Site') return props.sites;
    return props.users;
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'Kommunikation & Erinnerungen', href: '/admin/communications' },
    { title: 'Erinnerung erfassen', href: '#' },
];

function submit() {
    form.post('/admin/communications');
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Erinnerung erfassen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Erinnerung erfassen</Heading>
                <Text class="mt-2" muted>
                    Manuelle Erinnerung oder Kommunikation zu Rechnung, Site oder Kunde erfassen
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Erinnerung</CardTitle>
                    <CardDescription>Art, Bezug, Datum, Notiz</CardDescription>
                </CardHeader>
                <CardContent>
                    <form class="space-y-4" @submit.prevent="submit">
                        <div class="space-y-2">
                            <Label for="type">Art</Label>
                            <Select
                                id="type"
                                v-model="form.type"
                                name="type"
                                required
                                :aria-invalid="!!form.errors.type"
                            >
                                <option
                                    v-for="(label, value) in typeLabels"
                                    :key="value"
                                    :value="value"
                                >
                                    {{ label }}
                                </option>
                            </Select>
                            <InputError :message="form.errors.type" />
                        </div>
                        <div class="space-y-2">
                            <Label for="subject_type">Bezug</Label>
                            <Select
                                id="subject_type"
                                v-model="form.subject_type"
                                name="subject_type"
                                required
                                :aria-invalid="!!form.errors.subject_type"
                                @update:model-value="form.subject_id = ''"
                            >
                                <option value="Invoice">Rechnung</option>
                                <option value="Site">Site</option>
                                <option value="User">Kunde</option>
                            </Select>
                            <InputError :message="form.errors.subject_type" />
                        </div>
                        <div class="space-y-2">
                            <Label for="subject_id">{{ form.subject_type === 'Invoice' ? 'Rechnung' : form.subject_type === 'Site' ? 'Site' : 'Kunde' }}</Label>
                            <Select
                                id="subject_id"
                                v-model="form.subject_id"
                                name="subject_id"
                                required
                                :aria-invalid="!!form.errors.subject_id"
                            >
                                <option value="">Bitte wählen …</option>
                                <option
                                    v-for="opt in subjectOptions"
                                    :key="opt.id"
                                    :value="opt.id"
                                >
                                    {{ opt.label }}
                                </option>
                            </Select>
                            <InputError :message="form.errors.subject_id" />
                        </div>
                        <div class="space-y-2">
                            <Label for="sent_at">Datum / Zeit der Kommunikation</Label>
                            <Input
                                id="sent_at"
                                v-model="form.sent_at"
                                type="datetime-local"
                                name="sent_at"
                                required
                                :aria-invalid="!!form.errors.sent_at"
                            />
                            <InputError :message="form.errors.sent_at" />
                        </div>
                        <div class="space-y-2">
                            <Label for="note">Notiz (optional)</Label>
                            <Textarea
                                id="note"
                                v-model="form.note"
                                name="note"
                                rows="3"
                                :aria-invalid="!!form.errors.note"
                            />
                            <InputError :message="form.errors.note" />
                        </div>
                        <CardFooter class="flex gap-2 px-0 pb-0 pt-4">
                            <Button type="submit" :disabled="form.processing">
                                Speichern
                            </Button>
                            <Link href="/admin/communications">
                                <Button type="button" variant="outline">Abbrechen</Button>
                            </Link>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
