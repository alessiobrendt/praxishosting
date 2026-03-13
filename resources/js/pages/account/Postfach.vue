<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Inbox } from 'lucide-vue-next';
import { Card, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type EmailListItem = {
    uuid: string;
    subject: string;
    snippet: string | null;
    sent_at: string | null;
};

type SelectedEmail = {
    uuid: string;
    subject: string;
    body_html: string;
    sent_at: string | null;
} | null;

type Props = {
    emails: EmailListItem[];
    selectedEmail: SelectedEmail;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Postfach', href: '/account/postfach' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Postfach" />

        <div class="space-y-4">
            <div>
                <Heading level="h1">Postfach</Heading>
                <Text class="mt-2" muted>
                    Alle an dich gesendeten E-Mails findest du hier zur Nachverfolgung.
                </Text>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-12">
                <!-- Left: email list -->
                <div class="md:col-span-4">
                    <Card class="max-h-[85vh] overflow-hidden flex flex-col">
                        <div class="overflow-y-auto flex-1 p-2">
                            <Link
                                v-for="email in props.emails"
                                :key="email.uuid"
                                :href="`/account/postfach/${email.uuid}`"
                                class="block rounded-lg border border-transparent p-3 transition-modern hover:bg-gray-50 hover:border-gray-200 dark:hover:bg-gray-800/50 dark:hover:border-gray-700"
                                :class="[
                                    props.selectedEmail?.uuid === email.uuid
                                        ? 'bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30'
                                        : '',
                                ]"
                                :aria-current="props.selectedEmail?.uuid === email.uuid ? 'true' : undefined"
                            >
                                <div class="flex flex-wrap items-start justify-between gap-2">
                                    <div class="min-w-0 flex-1">
                                        <p class="mb-0.5 font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {{ email.subject }}
                                        </p>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {{ email.snippet || '…' }}
                                        </p>
                                    </div>
                                    <span
                                        class="shrink-0 rounded px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
                                    >
                                        {{ email.sent_at }}
                                    </span>
                                </div>
                            </Link>
                            <p
                                v-if="props.emails.length === 0"
                                class="p-4 text-center text-sm text-gray-500 dark:text-gray-400"
                            >
                                Noch keine E-Mails vorhanden.
                            </p>
                        </div>
                    </Card>
                </div>

                <!-- Right: detail or empty state -->
                <div class="md:col-span-8">
                    <Card v-if="!props.selectedEmail" class="flex flex-col">
                        <CardContent class="flex flex-1 flex-col items-center justify-center py-12 md:flex-row md:gap-6 md:py-16">
                            <div class="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <Inbox class="h-12 w-12 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div class="mt-4 text-center md:mt-0 md:text-left">
                                <Heading level="h2" class="text-xl">Keine E-Mail ausgewählt</Heading>
                                <Text class="mt-2" muted>
                                    Bitte wähle eine E-Mail aus der Liste auf der linken Seite aus, um den Inhalt hier
                                    anzuzeigen. Sobald du eine E-Mail ausgewählt hast, werden die Details und der
                                    Inhalt in diesem Bereich dargestellt.
                                </Text>
                            </div>
                        </CardContent>
                    </Card>

                    <Card v-else class="overflow-hidden">
                        <CardContent class="p-0">
                            <div class="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
                                <p class="font-semibold text-gray-900 dark:text-gray-100">
                                    {{ props.selectedEmail.subject }}
                                </p>
                                <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    {{ props.selectedEmail.sent_at }}
                                </p>
                            </div>
                            <div class="min-h-[75vh] bg-white dark:bg-gray-900">
                                <iframe
                                    v-if="props.selectedEmail.body_html"
                                    :srcdoc="props.selectedEmail.body_html"
                                    title="E-Mail-Inhalt"
                                    class="h-full min-h-[75vh] w-full border-0"
                                    sandbox="allow-same-origin"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
