<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import {
    index as emailsIndex,
    update as emailsUpdate,
    preview as emailsPreview,
    sendTest as emailsSendTest,
} from '@/routes/admin/emails';
import type { BreadcrumbItem } from '@/types';

type EmailTemplate = {
    key: string;
    name: string;
    subject: string;
    greeting: string;
    body: string;
    action_text: string | null;
};

type Props = {
    emailTemplate: EmailTemplate;
    placeholders: string[];
};

const props = defineProps<Props>();

const form = useForm({
    subject: props.emailTemplate.subject,
    greeting: props.emailTemplate.greeting,
    body: props.emailTemplate.body,
    action_text: props.emailTemplate.action_text ?? '',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'E-Mails', href: emailsIndex().url },
    { title: props.emailTemplate.name, href: '#' },
];

const submit = () => {
    form.put(emailsUpdate.url({ emailTemplate: props.emailTemplate.key }));
};

const previewLoading = ref(false);
const previewError = ref<string | null>(null);
const previewHtml = ref('');

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function fetchPreview() {
    previewError.value = null;
    previewLoading.value = true;
    try {
        const res = await fetch(emailsPreview.url({ emailTemplate: props.emailTemplate.key }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                subject: form.subject,
                greeting: form.greeting,
                body: form.body,
                action_text: form.action_text || null,
            }),
            credentials: 'same-origin',
        });
        const data = await res.json();
        if (!res.ok) {
            previewError.value = data.message ?? 'Vorschau konnte nicht geladen werden.';
            return;
        }
        previewHtml.value = data.html ?? '';
    } catch {
        previewError.value = 'Vorschau konnte nicht geladen werden.';
    } finally {
        previewLoading.value = false;
    }
}

const debouncedFetchPreview = useDebounceFn(fetchPreview, 400);

watch(
    () => [form.subject, form.greeting, form.body, form.action_text],
    () => debouncedFetchPreview(),
    { deep: true },
);

onMounted(() => {
    fetchPreview();
});

function sendTestEmail() {
    router.post(emailsSendTest.url({ emailTemplate: props.emailTemplate.key }), {}, {
        preserveScroll: true,
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`E-Mail-Vorlage: ${emailTemplate.name}`" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">{{ emailTemplate.name }}</Heading>
                <Text class="mt-2" muted>
                    Vorlage „{{ emailTemplate.key }}“. Platzhalter z. B. :user_name, :site_name werden beim Versand ersetzt.
                </Text>
            </div>

            <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <form class="space-y-6" @submit.prevent="submit">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inhalt</CardTitle>
                            <CardDescription v-if="placeholders.length">
                                Verfügbare Platzhalter: {{ placeholders.map((p) => `:${p}`).join(', ') }}
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="space-y-2">
                                <Label for="subject">Betreff</Label>
                                <Input id="subject" v-model="form.subject" required :aria-invalid="!!form.errors.subject" />
                                <InputError :message="form.errors.subject" />
                            </div>
                            <div class="space-y-2">
                                <Label for="greeting">Anrede</Label>
                                <Input id="greeting" v-model="form.greeting" required :aria-invalid="!!form.errors.greeting" />
                                <InputError :message="form.errors.greeting" />
                            </div>
                            <div class="space-y-2">
                                <Label for="body">Nachricht (Zeilenumbrüche bleiben erhalten, **fett** für Markdown)</Label>
                                <Textarea
                                    id="body"
                                    v-model="form.body"
                                    required
                                    :rows="12"
                                    class="font-mono text-sm"
                                    :aria-invalid="!!form.errors.body"
                                />
                                <InputError :message="form.errors.body" />
                            </div>
                            <div class="space-y-2">
                                <Label for="action_text">Button-Text (optional)</Label>
                                <Input id="action_text" v-model="form.action_text" :aria-invalid="!!form.errors.action_text" />
                                <InputError :message="form.errors.action_text" />
                            </div>
                        </CardContent>
                        <CardFooter class="flex flex-wrap gap-2">
                            <Button type="submit" :disabled="form.processing">Speichern</Button>
                            <Button type="button" variant="outline" @click="sendTestEmail">
                                Test senden
                            </Button>
                            <Link :href="emailsIndex().url">
                                <Button type="button" variant="outline">Abbrechen</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </form>

                <Card class="xl:sticky xl:top-6 xl:self-start">
                    <CardHeader>
                        <CardTitle>Live-Vorschau</CardTitle>
                        <CardDescription>Wie die E-Mail beim Versand aussieht (aktualisiert beim Tippen)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div v-if="previewError" class="rounded border border-border bg-muted/30 p-4 text-sm text-destructive">
                            {{ previewError }}
                        </div>
                        <div
                            v-else
                            class="min-h-[400px] overflow-hidden rounded border border-border bg-muted/30"
                        >
                            <div v-if="previewLoading && !previewHtml" class="flex h-64 items-center justify-center text-muted-foreground">
                                Lädt…
                            </div>
                            <iframe
                                v-else
                                :srcdoc="previewHtml"
                                title="E-Mail-Vorschau"
                                class="h-[70vh] min-h-[400px] w-full border-0"
                                sandbox="allow-same-origin"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
