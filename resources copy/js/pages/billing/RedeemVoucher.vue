<script setup lang="ts">
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { Gift } from 'lucide-vue-next';
import { watch } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heading, Text } from '@/components/ui/typography';
import { notify } from '@/composables/useNotify';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import { index as billingIndex } from '@/routes/billing';
import type { BreadcrumbItem } from '@/types';

const page = usePage();
watch(
    () => (page.props.flash as { error?: string })?.error,
    (message) => {
        if (message) notify.error(message);
    },
    { immediate: true },
);
watch(
    () => (page.props.flash as { success?: string })?.success,
    (message) => {
        if (message) notify.success(message);
    },
    { immediate: true },
);

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Guthaben & Rechnungen', href: billingIndex().url },
    { title: 'Gutscheincode einlösen', href: '#' },
];

const form = useForm({
    code: '',
});

function submit() {
    form.post('/billing/redeem-voucher', {
        preserveScroll: true,
        onSuccess: () => form.reset('code'),
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Gutscheincode einlösen" />

        <div class="mx-auto max-w-xl space-y-6">
            <div>
                <Heading level="h1">Gutscheincode einlösen</Heading>
                <Text class="mt-2" muted>
                    Gib deinen Gutscheincode ein, um den Betrag deinem Guthaben gutschreiben zu lassen.
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Gift class="h-5 w-5" />
                        Gutschein einlösen
                    </CardTitle>
                    <CardDescription>
                        Code von deinem Gutschein eingeben und auf „Einlösen“ klicken.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        class="space-y-4"
                        @submit.prevent="submit"
                    >
                        <div class="space-y-2">
                            <Label for="code">Gutscheincode</Label>
                            <Input
                                id="code"
                                v-model="form.code"
                                type="text"
                                name="code"
                                placeholder="z. B. ABCD1234EFGH"
                                autocomplete="off"
                                class="font-mono uppercase"
                                :aria-invalid="!!form.errors.code"
                                :disabled="form.processing"
                            />
                            <InputError :message="form.errors.code" />
                        </div>
                        <Button
                            type="submit"
                            :disabled="form.processing || !form.code.trim()"
                        >
                            {{ form.processing ? 'Wird eingelöst…' : 'Einlösen' }}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
