<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { Wallet, RefreshCcw } from 'lucide-vue-next';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Props {
    open: boolean;
    balanceUrl: string;
    mollieUrl: string;
    mollieCancelUrl?: string;
    autoRenewWithBalance: boolean;
    hasMollieSubscription: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
}>();

const submitting = ref<'balance' | 'mollie' | 'mollie-cancel' | null>(null);

const page = usePage();
const csrfToken = () => (page.props.csrfToken as string) ?? '';

function close(): void {
    emit('update:open', false);
}

function submitBalance(enabled: boolean): void {
    if (submitting.value) return;
    submitting.value = 'balance';
    router.post(props.balanceUrl, { enabled: enabled ? '1' : '0' }, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => {
            submitting.value = null;
        },
        onSuccess: () => {
            close();
        },
    });
}

function cancelMollieSubscription(): void {
    if (submitting.value || !props.mollieCancelUrl) return;
    submitting.value = 'mollie-cancel';
    router.post(props.mollieCancelUrl, {}, {
        preserveScroll: true,
        onFinish: () => {
            submitting.value = null;
        },
        onSuccess: () => {
            close();
        },
    });
}
</script>

<template>
    <Dialog :open="open" @update:open="(v) => emit('update:open', v)">
        <DialogContent class="sm:max-w-md" :show-close-button="true">
            <DialogHeader>
                <DialogTitle>Auto Renew</DialogTitle>
                <DialogDescription>
                    Wählen Sie, wie Ihr Produkt automatisch verlängert werden soll.
                </DialogDescription>
            </DialogHeader>

            <div class="space-y-4 py-2">
                <div class="rounded-lg border p-4 space-y-2">
                    <div class="flex items-center gap-2">
                        <Wallet class="h-5 w-5 text-muted-foreground shrink-0" />
                        <span class="font-medium">Mit Guthaben</span>
                    </div>
                    <p class="text-sm text-muted-foreground">
                        Bevor das Produkt ausläuft wird es am letzten Tag automatisch verlängert, wenn genug Guthaben vorhanden ist.
                    </p>
                    <div v-if="autoRenewWithBalance" class="text-sm text-green-600 dark:text-green-400">
                        Auto Renew mit Guthaben ist aktiv.
                    </div>
                    <Button
                        v-if="!autoRenewWithBalance"
                        variant="outline"
                        class="w-full"
                        :disabled="submitting !== null"
                        @click="submitBalance(true)"
                    >
                        <RefreshCcw v-if="submitting === 'balance'" class="mr-2 h-4 w-4 animate-spin" />
                        {{ submitting === 'balance' ? 'Wird aktiviert…' : 'Mit Guthaben aktivieren' }}
                    </Button>
                    <Button
                        v-else
                        variant="ghost"
                        size="sm"
                        :disabled="submitting !== null"
                        @click="submitBalance(false)"
                    >
                        {{ submitting === 'balance' ? '…' : 'Deaktivieren' }}
                    </Button>
                </div>

                <div class="rounded-lg border p-4 space-y-2">
                    <div class="flex items-center gap-2">
                        <RefreshCcw class="h-5 w-5 text-muted-foreground shrink-0" />
                        <span class="font-medium">Mollie Subscription</span>
                    </div>
                    <p class="text-sm text-muted-foreground">
                        Es wird eine Subscription mit Mollie erstellt; das Geld wird monatlich automatisch abgebucht.
                        Die erste Zahlung verlängert die Laufzeit um 1 Monat, danach erfolgt die Abbuchung automatisch.
                    </p>
                    <div v-if="hasMollieSubscription" class="flex flex-col gap-3">
                        <span class="text-sm text-green-600 dark:text-green-400">Mollie-Abo ist aktiv.</span>
                        <Button
                            v-if="mollieCancelUrl"
                            variant="outline"
                            class="w-full border-dashed border-amber-500/50 text-amber-700 hover:bg-amber-50 hover:border-amber-500/70 dark:text-amber-400 dark:hover:bg-amber-950/30 dark:border-amber-500/40"
                            :disabled="submitting !== null"
                            @click="cancelMollieSubscription"
                        >
                            <RefreshCcw v-if="submitting === 'mollie-cancel'" class="mr-2 h-4 w-4 animate-spin" />
                            {{ submitting === 'mollie-cancel' ? 'Wird gekündigt…' : 'Mollie-Abo kündigen' }}
                        </Button>
                    </div>
                    <form
                        v-else
                        :action="mollieUrl"
                        method="post"
                        class="w-full"
                        @submit="submitting = 'mollie'"
                    >
                        <input type="hidden" name="_token" :value="csrfToken()" />
                        <Button
                            type="submit"
                            variant="outline"
                            class="w-full"
                            :disabled="submitting !== null"
                        >
                            <RefreshCcw v-if="submitting === 'mollie'" class="mr-2 h-4 w-4 animate-spin" />
                            {{ submitting === 'mollie' ? 'Weiterleitung…' : 'Mollie-Abo einrichten' }}
                        </Button>
                    </form>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" @click="close">
                    Schließen
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
