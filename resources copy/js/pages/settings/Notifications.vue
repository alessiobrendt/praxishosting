<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    discordConnected: boolean;
    discordConsentGiven: boolean;
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
    discord_consent_accepted: boolean;
}>({
    preferences: initialPreferences,
    discord_consent_accepted: false,
});

const channelOptions: { value: string; label: string; showWhenDiscord?: boolean }[] = [
    { value: 'none', label: 'Keine' },
    { value: 'email', label: 'E-Mail' },
    { value: 'discord', label: 'Discord DM', showWhenDiscord: true },
    { value: 'email_discord', label: 'E-Mail & Discord-DM', showWhenDiscord: true },
];

const consentModalOpen = ref(false);
const pendingConsentPreference = ref<{ key: string; value: string } | null>(null);

function getPreference(key: string): string {
    return form.preferences[key] ?? 'email';
}

function setPreference(key: string, value: string) {
    const needsConsent =
        (value === 'discord' || value === 'email_discord') && !props.discordConsentGiven;
    if (needsConsent) {
        pendingConsentPreference.value = { key, value };
        consentModalOpen.value = true;
        return;
    }
    form.preferences = { ...form.preferences, [key]: value };
}

function acceptConsent() {
    if (pendingConsentPreference.value) {
        form.preferences = {
            ...form.preferences,
            [pendingConsentPreference.value.key]: pendingConsentPreference.value.value,
        };
        form.discord_consent_accepted = true;
        consentModalOpen.value = false;
        pendingConsentPreference.value = null;
        form.patch('/settings/notifications');
    }
}

function declineConsent() {
    consentModalOpen.value = false;
    pendingConsentPreference.value = null;
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
                        Wählen Sie für jede E-Mail-Vorlage, ob Sie keine, E-Mail, Discord-DM oder beides erhalten möchten.
                    </Text>
                    <div
                        v-if="!discordAvailable || !discordConnected"
                        class="mt-3 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
                    >
                        <template v-if="!discordAvailable">
                            Discord-Benachrichtigungen sind für Ihre Marke derzeit nicht aktiviert. Wenden Sie sich an den Administrator.
                        </template>
                        <template v-else-if="!discordConnected">
                            Um „Discord DM“ oder „E-Mail & Discord-DM“ zu nutzen, verbinden Sie zuerst Ihr Discord-Konto unter
                            <Link
                                href="/settings/integration"
                                class="font-medium text-primary underline underline-offset-4"
                            >
                                Einstellungen → Integration
                            </Link>.
                        </template>
                    </div>
                </div>

                <form @submit.prevent="submit">
                    <Card>
                        <CardHeader>
                            <CardTitle>Benachrichtigungskanäle</CardTitle>
                            <CardDescription>
                                Diese E-Mails werden automatisch versendet. Sie können sie pro Typ ausschalten oder auf E-Mail, Discord-DM oder beides stellen.
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
                                    class="inline-flex w-fit flex-nowrap rounded-lg border border-border overflow-hidden"
                                    role="group"
                                    :aria-label="`Kanal für ${template.name}`"
                                >
                                    <button
                                        v-for="opt in channelOptions.filter((o) => o.showWhenDiscord !== true || (discordAvailable && discordConnected))"
                                        :key="opt.value"
                                        type="button"
                                        :class="[
                                            'whitespace-nowrap py-2 px-3 text-sm font-medium transition-colors first:pl-3 last:pr-3',
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

                <Dialog v-model:open="consentModalOpen">
                    <DialogContent class="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Zustimmung zu Discord-Benachrichtigungen</DialogTitle>
                            <DialogDescription>
                                Discord ist ein externer Dienst. Die Nutzung von Discord erfolgt auf Ihre eigene Verantwortung. Wir übermitteln nur die für die Benachrichtigung nötigen Daten an Discord. Mit Ihrer Zustimmung bestätigen Sie, dass Sie diese Nutzung wünschen und die Verantwortung dafür tragen.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter class="gap-2 sm:gap-0">
                            <Button variant="outline" @click="declineConsent">
                                Ablehnen
                            </Button>
                            <Button @click="acceptConsent">
                                Zustimmen
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
