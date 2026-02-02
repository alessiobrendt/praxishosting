<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { dashboard } from '@/routes';
import modules from '@/routes/modules';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft, Save, Send } from 'lucide-vue-next';
import { ref } from 'vue';
import InputError from '@/components/InputError.vue';

type Post = {
    id: number;
    subject: string;
    status: string;
    sent_at: string | null;
    created_at: string;
};

type Site = {
    uuid: string;
    name: string;
    slug: string;
};

type Props = {
    site: Site;
    subscribers_count: number;
    posts: Post[];
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Module', href: '#' },
    { title: 'Newsletter', href: modules.newsletter.index.url() },
];

const form = useForm({
    subject: '',
    body: '',
    action: 'save_draft' as 'save_draft' | 'send',
});

const sendConfirmOpen = ref(false);

function saveDraft() {
    form.action = 'save_draft';
    form.post(modules.newsletter.posts.store.url({ site: props.site.uuid }));
}

function openSendConfirm() {
    form.action = 'send';
    form.clearErrors();
    sendConfirmOpen.value = true;
}

function confirmSend() {
    form.action = 'send';
    form.post(modules.newsletter.posts.store.url({ site: props.site.uuid }), {
        onSuccess: () => {
            sendConfirmOpen.value = false;
            form.reset();
        },
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Newsletter – ${site.name}`" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Link
                        :href="modules.newsletter.index.url()"
                        class="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft class="h-4 w-4" /> Zurück zur Übersicht
                    </Link>
                    <Heading level="h1">Newsletter – {{ site.name }}</Heading>
                    <Text class="mt-2" muted>
                        {{ subscribers_count }} Abonnenten · News verfassen und versenden
                    </Text>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>News verfassen</CardTitle>
                    <CardDescription>Betreff und Nachricht eingeben. Als Entwurf speichern oder an Abonnenten senden.</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div class="space-y-2">
                        <Label for="subject">Betreff</Label>
                        <Input
                            id="subject"
                            v-model="form.subject"
                            type="text"
                            placeholder="Betreff der E-Mail"
                            class="w-full"
                            :aria-invalid="!!form.errors.subject"
                        />
                        <InputError :message="form.errors.subject" />
                    </div>
                    <div class="space-y-2">
                        <Label for="body">Nachricht</Label>
                        <textarea
                            id="body"
                            v-model="form.body"
                            rows="8"
                            placeholder="Inhalt der Newsletter-Nachricht (Markdown wird unterstützt)"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            :aria-invalid="!!form.errors.body"
                        />
                        <InputError :message="form.errors.body" />
                    </div>
                    <div class="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            :disabled="form.processing"
                            @click="saveDraft"
                        >
                            <Save class="mr-2 h-4 w-4" />
                            Entwurf speichern
                        </Button>
                        <Button
                            type="button"
                            :disabled="form.processing"
                            @click="openSendConfirm"
                        >
                            <Send class="mr-2 h-4 w-4" />
                            An Abonnenten senden
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>News & Entwürfe</CardTitle>
                    <CardDescription>Bereits verfasste und gesendete News</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table v-if="posts.length > 0">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Betreff</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Datum</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-for="post in posts" :key="post.id">
                                <TableCell class="font-medium">{{ post.subject }}</TableCell>
                                <TableCell>
                                    <span
                                        :class="[
                                            'rounded-full px-2 py-0.5 text-xs font-medium',
                                            post.status === 'sent'
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                                        ]"
                                    >
                                        {{ post.status === 'sent' ? 'Gesendet' : 'Entwurf' }}
                                    </span>
                                </TableCell>
                                <TableCell class="text-muted-foreground">
                                    {{ post.sent_at ? new Date(post.sent_at).toLocaleString('de-DE') : new Date(post.created_at).toLocaleString('de-DE') }}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p v-else class="py-8 text-center text-muted-foreground">
                        Noch keine News verfasst.
                    </p>
                </CardContent>
            </Card>
        </div>

        <Dialog :open="sendConfirmOpen" @update:open="sendConfirmOpen = $event">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Newsletter versenden?</DialogTitle>
                    <DialogDescription>
                        Die News werden an {{ subscribers_count }} Abonnenten gesendet. Dieser Vorgang kann nicht rückgängig gemacht werden.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" :disabled="form.processing" @click="sendConfirmOpen = false">
                        Abbrechen
                    </Button>
                    <Button :disabled="form.processing" @click="confirmSend">
                        Jetzt senden
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
