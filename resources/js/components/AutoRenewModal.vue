<script setup lang="ts">
import { router } from '@inertiajs/vue3';
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
    autoRenewWithBalance: boolean;
    hasMollieSubscription: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void;
}>();

const submitting = ref<'balance' | 'mollie' | null>(null);

function close(): void {
    emit('update:open', false);
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
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
                    </p>
                    <div v-if="hasMollieSubscription" class="text-sm text-green-600 dark:text-green-400">
                        Mollie-Abo ist aktiv.
                    </div>
                    <form
                        v-else
                        :action="mollieUrl"
                        method="post"
                        class="w-full"
                        @submit="submitting = 'mollie'"
                    >
                        <input type="hidden" name="_token" :value="getCsrfToken()" />
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
