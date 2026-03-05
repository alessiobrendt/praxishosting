<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { edit } from '@/routes/profile';
import type { BreadcrumbItem } from '@/types';

type EmailTemplate = {
    key: string;
    name: string;
};

type Props = {
    templates: EmailTemplate[];
    preferences: Record<string, string>;
    discordAvailable: boolean;
};

const props = defineProps<Props>();

const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Einstellungen', href: edit().url },
    { title: 'Benachrichtigungen', href: '#' },
];

const initialPreferences: Record<string, string> = {};
for (const t of props.templates) {
    initialPreferences[t.key] = props.preferences[t.key] ?? 'email';
}

const form = useForm<{
    preferences: Record<string, string>;
}>({
    preferences: initialPreferences,
});

const channelOptions: { value: string; label: string; showWhenDiscord?: boolean }[] = [
    { value: 'none', label: 'Keine' },
    { value: 'discord', label: 'Discord', showWhenDiscord: true },
    { value: 'email', label: 'E-Mail' },
];

function getPreference(key: string): string {
    return form.preferences[key] ?? 'email';
}

function setPreference(key: string, value: string) {
    form.preferences = { ...form.preferences, [key]: value };
}

function submit() {
    form.patch('/settings/notifications');
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Benachrichtigungen" />

        <SettingsLayout>
            <div class="space-y-6">
                <div>
                    <Heading level="h1">Benachrichtigungen</Heading>
                    <Text class="mt-2" muted>
                        Wählen Sie für jede E-Mail-Vorlage, ob Sie keine, E-Mail oder Discord erhalten möchten.
                    </Text>
                </div>

                <form @submit.prevent="submit">
                    <Card>
                        <CardHeader>
                            <CardTitle>Benachrichtigungskanäle</CardTitle>
                            <CardDescription>
                                Diese E-Mails werden automatisch versendet. Sie können sie pro Typ ausschalten oder auf E-Mail bzw. Discord stellen.
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-6">
                            <div
                                v-for="template in templates"
                                :key="template.key"
                                class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <Label class="text-sm font-medium shrink-0 sm:w-48">
                                    {{ template.name }}
                                </Label>
                                <div
                                    class="flex rounded-lg border border-border overflow-hidden shrink-0"
                                    role="group"
                                    :aria-label="`Kanal für ${template.name}`"
                                >
                                    <button
                                        v-for="opt in channelOptions.filter((o) => o.showWhenDiscord !== true || discordAvailable)"
                                        :key="opt.value"
                                        type="button"
                                        :class="[
                                            'flex-1 py-2 px-3 w-24 text-sm font-medium transition-colors',
                                            getPreference(template.key) === opt.value
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted/50 text-muted-foreground hover:bg-muted',
                                        ]"
                                        @click="setPreference(template.key, opt.value)"
                                    >
                                        {{ opt.label }}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                :disabled="form.processing"
                            >
                                Speichern
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
