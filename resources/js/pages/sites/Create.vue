<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
import { store as sitesStore } from '@/routes/sites';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { index as sitesIndex } from '@/routes/sites';
import { dashboard } from '@/routes';
import { notify } from '@/composables/useNotify';
import type { BreadcrumbItem } from '@/types';

type Template = {
    id: number;
    name: string;
    slug: string;
    price: string;
};

type Props = {
    template: Template | null;
    templates: Template[];
};

const props = defineProps<Props>();

const page = usePage();
const form = useForm({
    template_id: (props.template?.id ?? '') as string | number,
    name: '',
});

watch(
    () => (page.props.flash as { error?: string })?.error,
    (message) => {
        if (message) {
            notify.error(message);
        }
    },
    { immediate: true },
);

function submit(): void {
    form.post(sitesStore.url());
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Sites', href: sitesIndex().url },
    { title: 'Neue Site', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Neue Site erstellen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Neue Site erstellen</Heading>
                <Text class="mt-2" muted>
                    Wählen Sie ein Template und geben Sie einen Namen ein
                </Text>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Site-Details</CardTitle>
                    <CardDescription>Geben Sie die Informationen für Ihre neue Site ein</CardDescription>
                </CardHeader>
                <CardContent>
                    <form class="space-y-6" @submit.prevent="submit">
                        <div class="space-y-2">
                            <Label for="template_id">Template</Label>
                            <Select
                                id="template_id"
                                v-model="form.template_id"
                                required
                                :aria-invalid="!!form.errors.template_id"
                            >
                                <option value="">Bitte wählen...</option>
                                <option
                                    v-for="t in templates"
                                    :key="t.id"
                                    :value="t.id"
                                >
                                    {{ t.name }} ({{ t.price }} €)
                                </option>
                            </Select>
                            <InputError :message="form.errors.template_id" />
                        </div>
                        <div class="space-y-2">
                            <Label for="name">Name der Site</Label>
                            <Input
                                id="name"
                                v-model="form.name"
                                required
                                placeholder="z. B. Praxis Mustermann"
                                :aria-invalid="!!form.errors.name"
                            />
                            <InputError :message="form.errors.name" />
                        </div>
                        <CardFooter class="px-0 pb-0">
                            <div class="flex gap-2">
                                <Button type="submit" :disabled="form.processing">Zur Kasse</Button>
                                <Link :href="sitesIndex().url">
                                    <Button type="button" variant="outline">Abbrechen</Button>
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
