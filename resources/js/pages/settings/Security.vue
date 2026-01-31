<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { useForm } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { usePage } from '@inertiajs/vue3';
import { ShieldCheck, KeyRound } from 'lucide-vue-next';
import type { BreadcrumbItem } from '@/types';

const page = usePage();
const user = computed(
    () =>
        page.props.auth?.user as {
            has_pin?: boolean;
            inactivity_lock_minutes?: number;
        } | undefined,
);
const hasPin = computed(() => Boolean(user.value?.has_pin));
const inactivityLockMinutes = computed(
    () => Number(user.value?.inactivity_lock_minutes ?? 0),
);

const breadcrumbItems: BreadcrumbItem[] = [
    { title: 'Einstellungen', href: '/settings/security' },
];

const inactivityForm = useForm({
    inactivity_lock_minutes: inactivityLockMinutes.value,
});

const showEnablePinModal = ref(false);
const showChangePinModal = ref(false);
const showDisablePinModal = ref(false);

const enablePinForm = useForm({
    current_password: '',
    pin: '',
    pin_confirmation: '',
});

const changePinForm = useForm({
    current_password: '',
    pin: '',
    pin_confirmation: '',
});

const disablePinForm = useForm({
    current_password: '',
});

const inactivityOptions = [
    { value: 0, label: 'Aus' },
    { value: 5, label: '5 Minuten' },
    { value: 10, label: '10 Minuten' },
    { value: 15, label: '15 Minuten' },
    { value: 30, label: '30 Minuten' },
    { value: 60, label: '60 Minuten' },
];

function submitEnablePin(): void {
    enablePinForm.post('/settings/security/pin', {
        preserveScroll: true,
        onSuccess: () => {
            showEnablePinModal.value = false;
            enablePinForm.reset();
        },
    });
}

function submitChangePin(): void {
    changePinForm.put('/settings/security/pin', {
        preserveScroll: true,
        onSuccess: () => {
            showChangePinModal.value = false;
            changePinForm.reset();
        },
    });
}

function submitDisablePin(): void {
    disablePinForm.delete('/settings/security/pin', {
        preserveScroll: true,
        onSuccess: () => {
            showDisablePinModal.value = false;
            disablePinForm.reset();
        },
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Sicherheit" />

        <SettingsLayout>
            <div class="space-y-6">
                <div>
                    <Heading level="h1">Sicherheit</Heading>
                    <Text class="mt-2" muted>
                        Sperre nach Inaktivität, PIN-Schutz und Zwei-Faktor-Authentifizierung
                    </Text>
                </div>

                <!-- Inactivity lock -->
                <Card>
                    <CardHeader>
                        <CardTitle>Sperre nach Inaktivität</CardTitle>
                        <CardDescription>
                            Nach der gewählten Zeit ohne Maus- oder Tastaturaktivität wird die
                            Sitzung gesperrt und Sie müssen Ihre PIN eingeben.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <Label for="inactivity_lock_minutes">Nach Minuten sperren</Label>
                            <Select
                                id="inactivity_lock_minutes"
                                :model-value="inactivityForm.inactivity_lock_minutes"
                                name="inactivity_lock_minutes"
                                class="w-full max-w-xs"
                                @update:model-value="
                                    (v) => {
                                        inactivityForm.inactivity_lock_minutes = Number(v);
                                        inactivityForm.patch('/settings/security', {
                                            preserveScroll: true,
                                        });
                                    }
                                "
                            >
                                <option
                                    v-for="opt in inactivityOptions"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </Select>
                            <InputError :message="inactivityForm.errors.inactivity_lock_minutes" />
                        </div>
                    </CardContent>
                </Card>

                <!-- PIN -->
                <Card>
                    <CardHeader>
                        <CardTitle>PIN-Schutz</CardTitle>
                        <CardDescription>
                            1–8-stellige PIN zum schnellen Entsperren nach Inaktivität.
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div v-if="!hasPin">
                            <Button @click="showEnablePinModal = true">
                                <KeyRound class="mr-2 h-4 w-4" />
                                PIN aktivieren
                            </Button>
                        </div>
                        <div v-else class="space-y-2">
                            <Text muted>PIN ist aktiviert.</Text>
                            <div class="flex flex-wrap gap-2">
                                <Button
                                    variant="secondary"
                                    @click="showChangePinModal = true"
                                >
                                    PIN ändern
                                </Button>
                                <Button
                                    variant="destructive"
                                    @click="showDisablePinModal = true"
                                >
                                    PIN deaktivieren
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- 2FA link -->
                <Card>
                    <CardHeader>
                        <CardTitle>Zwei-Faktor-Authentifizierung</CardTitle>
                        <CardDescription>
                            Zusätzlicher Schutz bei der Anmeldung mit einer Authenticator-App.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/settings/two-factor">
                            <Button variant="secondary">
                                <ShieldCheck class="mr-2 h-4 w-4" />
                                2FA verwalten
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <!-- Enable PIN modal -->
            <Teleport to="body">
                <div
                    v-if="showEnablePinModal"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                >
                    <Card class="w-full max-w-md mx-4">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>PIN aktivieren</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                @click="showEnablePinModal = false"
                            >
                                Schließen
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form
                                class="space-y-4"
                                @submit.prevent="submitEnablePin"
                            >
                                <div class="space-y-2">
                                    <Label for="enable_current_password">Aktuelles Passwort</Label>
                                    <Input
                                        id="enable_current_password"
                                        v-model="enablePinForm.current_password"
                                        type="password"
                                        autocomplete="current-password"
                                        :aria-invalid="!!enablePinForm.errors.current_password"
                                    />
                                    <InputError :message="enablePinForm.errors.current_password" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="enable_pin">Neue PIN (1–8 Ziffern)</Label>
                                    <Input
                                        id="enable_pin"
                                        v-model="enablePinForm.pin"
                                        type="password"
                                        inputmode="numeric"
                                        maxlength="8"
                                        placeholder="••••"
                                        :aria-invalid="!!enablePinForm.errors.pin"
                                    />
                                    <InputError :message="enablePinForm.errors.pin" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="enable_pin_confirmation">PIN bestätigen</Label>
                                    <Input
                                        id="enable_pin_confirmation"
                                        v-model="enablePinForm.pin_confirmation"
                                        type="password"
                                        inputmode="numeric"
                                        maxlength="8"
                                        placeholder="••••"
                                        :aria-invalid="!!enablePinForm.errors.pin_confirmation"
                                    />
                                    <InputError :message="enablePinForm.errors.pin_confirmation" />
                                </div>
                                <Button
                                    type="submit"
                                    class="w-full"
                                    :disabled="enablePinForm.processing"
                                >
                                    PIN aktivieren
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </Teleport>

            <!-- Change PIN modal -->
            <Teleport to="body">
                <div
                    v-if="showChangePinModal"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                >
                    <Card class="w-full max-w-md mx-4">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>PIN ändern</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                @click="showChangePinModal = false"
                            >
                                Schließen
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form
                                class="space-y-4"
                                @submit.prevent="submitChangePin"
                            >
                                <div class="space-y-2">
                                    <Label for="change_current_password">Aktuelles Passwort</Label>
                                    <Input
                                        id="change_current_password"
                                        v-model="changePinForm.current_password"
                                        type="password"
                                        autocomplete="current-password"
                                        :aria-invalid="!!changePinForm.errors.current_password"
                                    />
                                    <InputError :message="changePinForm.errors.current_password" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="change_pin">Neue PIN (1–8 Ziffern)</Label>
                                    <Input
                                        id="change_pin"
                                        v-model="changePinForm.pin"
                                        type="password"
                                        inputmode="numeric"
                                        maxlength="8"
                                        placeholder="••••"
                                        :aria-invalid="!!changePinForm.errors.pin"
                                    />
                                    <InputError :message="changePinForm.errors.pin" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="change_pin_confirmation">PIN bestätigen</Label>
                                    <Input
                                        id="change_pin_confirmation"
                                        v-model="changePinForm.pin_confirmation"
                                        type="password"
                                        inputmode="numeric"
                                        maxlength="8"
                                        placeholder="••••"
                                        :aria-invalid="!!changePinForm.errors.pin_confirmation"
                                    />
                                    <InputError :message="changePinForm.errors.pin_confirmation" />
                                </div>
                                <Button
                                    type="submit"
                                    class="w-full"
                                    :disabled="changePinForm.processing"
                                >
                                    PIN ändern
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </Teleport>

            <!-- Disable PIN modal -->
            <Teleport to="body">
                <div
                    v-if="showDisablePinModal"
                    class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                >
                    <Card class="w-full max-w-md mx-4">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0">
                            <CardTitle>PIN deaktivieren</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                @click="showDisablePinModal = false"
                            >
                                Schließen
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form
                                class="space-y-4"
                                @submit.prevent="submitDisablePin"
                            >
                                <div class="space-y-2">
                                    <Label for="disable_current_password">Aktuelles Passwort</Label>
                                    <Input
                                        id="disable_current_password"
                                        v-model="disablePinForm.current_password"
                                        type="password"
                                        autocomplete="current-password"
                                        :aria-invalid="!!disablePinForm.errors.current_password"
                                    />
                                    <InputError :message="disablePinForm.errors.current_password" />
                                </div>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    class="w-full"
                                    :disabled="disablePinForm.processing"
                                >
                                    PIN deaktivieren
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </Teleport>
        </SettingsLayout>
    </AppLayout>
</template>
