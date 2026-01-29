<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { ShieldBan, ShieldCheck } from 'lucide-vue-next';
import { onUnmounted, ref } from 'vue';
import TwoFactorRecoveryCodes from '@/components/TwoFactorRecoveryCodes.vue';
import TwoFactorSetupModal from '@/components/TwoFactorSetupModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { disable, enable, show } from '@/routes/two-factor';
import { type BreadcrumbItem } from '@/types';

type Props = {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

withDefaults(defineProps<Props>(), {
    requiresConfirmation: false,
    twoFactorEnabled: false,
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Einstellungen',
        href: show.url(),
    },
];

const { hasSetupData, clearTwoFactorAuthData } = useTwoFactorAuth();
const showSetupModal = ref<boolean>(false);

onUnmounted(() => {
    clearTwoFactorAuthData();
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Zwei-Faktor-Authentifizierung" />

        <SettingsLayout>
            <div class="space-y-6">
                <div>
                    <Heading level="h1">Zwei-Faktor-Authentifizierung</Heading>
                    <Text class="mt-2" muted>
                        Verwalten Sie Ihre Zwei-Faktor-Authentifizierungs-Einstellungen
                    </Text>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>2FA Status</CardTitle>
                        <CardDescription>Schutz für Ihr Konto</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-6">
                        <div
                            v-if="!twoFactorEnabled"
                            class="space-y-4"
                        >
                            <Badge variant="error">Deaktiviert</Badge>

                            <Text muted>
                                Wenn Sie die Zwei-Faktor-Authentifizierung aktivieren, werden Sie
                                während der Anmeldung nach einer sicheren PIN gefragt. Diese PIN kann
                                von einer TOTP-unterstützten Anwendung auf Ihrem Telefon abgerufen werden.
                            </Text>

                            <div>
                                <Button
                                    v-if="hasSetupData"
                                    @click="showSetupModal = true"
                                >
                                    <ShieldCheck class="mr-2 h-4 w-4" />
                                    Setup fortsetzen
                                </Button>
                                <Form
                                    v-else
                                    v-bind="enable.form()"
                                    @success="showSetupModal = true"
                                    #default="{ processing }"
                                >
                                    <Button type="submit" :disabled="processing">
                                        <ShieldCheck class="mr-2 h-4 w-4" />
                                        2FA aktivieren
                                    </Button>
                                </Form>
                            </div>
                        </div>

                        <div
                            v-else
                            class="space-y-4"
                        >
                            <Badge variant="success">Aktiviert</Badge>

                            <Text muted>
                                Mit aktivierter Zwei-Faktor-Authentifizierung werden Sie während der
                                Anmeldung nach einer sicheren, zufälligen PIN gefragt, die Sie von der
                                TOTP-unterstützten Anwendung auf Ihrem Telefon abrufen können.
                            </Text>

                            <TwoFactorRecoveryCodes />

                            <div>
                                <Form v-bind="disable.form()" #default="{ processing }">
                                    <Button
                                        variant="destructive"
                                        type="submit"
                                        :disabled="processing"
                                    >
                                        <ShieldBan class="mr-2 h-4 w-4" />
                                        2FA deaktivieren
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <TwoFactorSetupModal
                    v-model:isOpen="showSetupModal"
                    :requiresConfirmation="requiresConfirmation"
                    :twoFactorEnabled="twoFactorEnabled"
                />
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
