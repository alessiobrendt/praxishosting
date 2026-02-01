<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
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

const previewOpen = ref(false);
const previewLoading = ref(false);
const previewError = ref<string | null>(null);
const previewData = ref<{
    subject: string;
    greeting: string;
    body: string;
    action_text: string | null;
} | null>(null);

const previewBodyLines = computed(() => {
    if (!previewData.value?.body) return [];
    return previewData.value.body.split('\n').filter((line) => line.trim() !== '');
});

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function openPreview() {
    previewError.value = null;
    previewLoading.value = true;
    previewOpen.value = true;
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
        previewData.value = data;
    } catch {
        previewError.value = 'Vorschau konnte nicht geladen werden.';
    } finally {
        previewLoading.value = false;
    }
}

function sendTestEmail() {
    router.post(emailsSendTest.url({ emailTemplate: props.emailTemplate.key }), {}, {
        preserveScroll: true,
    });
}

function closePreview() {
    previewOpen.value = false;
    previewData.value = null;
    previewError.value = null;
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

            <form class="max-w-2xl space-y-6" @submit.prevent="submit">
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
                                rows="12"
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
                        <Button
                            type="button"
                            variant="outline"
                            :disabled="previewLoading"
                            @click="openPreview"
                        >
                            {{ previewLoading ? 'Laden…' : 'Vorschau' }}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            @click="sendTestEmail"
                        >
                            Test senden
                        </Button>
                        <Link :href="emailsIndex().url">
                            <Button type="button" variant="outline">Abbrechen</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </form>

            <Dialog v-model:open="previewOpen" @update:open="(v: boolean) => !v && closePreview()">
                <DialogContent class="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Vorschau (Beispieldaten)</DialogTitle>
                    </DialogHeader>
                    <div v-if="previewError" class="text-destructive text-sm">{{ previewError }}</div>
                    <div v-else-if="previewData" class="space-y-3 text-sm">
                        <div>
                            <span class="font-medium text-muted-foreground">Betreff:</span>
                            <p class="mt-1">{{ previewData.subject }}</p>
                        </div>
                        <div>
                            <span class="font-medium text-muted-foreground">Anrede:</span>
                            <p class="mt-1">{{ previewData.greeting }}</p>
                        </div>
                        <div>
                            <span class="font-medium text-muted-foreground">Nachricht:</span>
                            <div class="mt-1 whitespace-pre-wrap rounded border border-border bg-muted/30 p-3">
                                <p v-for="(line, i) in previewBodyLines" :key="i" class="mb-1 last:mb-0">{{ line }}</p>
                            </div>
                        </div>
                        <div v-if="previewData.action_text">
                            <span class="font-medium text-muted-foreground">Button:</span>
                            <p class="mt-1">{{ previewData.action_text }}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose as-child>
                            <Button variant="outline">Schließen</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </AppLayout>
</template>
