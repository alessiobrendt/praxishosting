<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { edit as emailsEdit, index as emailsIndex } from '@/routes/admin/emails';
import type { BreadcrumbItem } from '@/types';
import { Edit } from 'lucide-vue-next';

type EmailTemplate = {
    key: string;
    name: string;
    subject: string;
    greeting: string;
    body: string;
    action_text: string | null;
};

type Props = {
    templates: EmailTemplate[];
};

defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'E-Mails', href: emailsIndex().url },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="E-Mails" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">E-Mails</Heading>
                <Text class="mt-2" muted>
                    E-Mail-Vorlagen und Benachrichtigungen (Bestellung, Rechnung, Zahlung, Abo, Sperrung, Löschung)
                </Text>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vorlagen</CardTitle>
                    <CardDescription>
                        Diese E-Mails werden automatisch versendet. Vorschau und Test-Versand können später ergänzt werden.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul class="divide-y divide-border">
                        <li
                            v-for="template in templates"
                            :key="template.key"
                            class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                            <div>
                                <span class="font-medium">{{ template.name }}</span>
                                <span class="ml-2 text-muted-foreground text-sm">({{ template.key }})</span>
                            </div>
                            <Link :href="emailsEdit.url({ emailTemplate: template.key })">
                                <Button variant="ghost" size="sm">
                                    <Edit class="mr-2 h-4 w-4" />Bearbeiten
                                </Button>
                            </Link>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
