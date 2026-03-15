<script setup lang="ts">
import { ref, computed } from 'vue';
import { router, useForm } from '@inertiajs/vue3';
import { UserPlus, Mail, X, Pencil } from 'lucide-vue-next';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/typography';
import InputError from '@/components/InputError.vue';

type ShareUser = { id: number; name: string; email: string } | null;

type ProductShareItem = {
    id: number;
    user: ShareUser;
    permissions: string[];
    update_url: string;
    destroy_url: string;
};

type ProductInvitationItem = {
    id: number;
    email: string;
    permissions: string[];
    expires_at: string | null;
    destroy_url: string;
};

const props = withDefaults(
    defineProps<{
        productShares: ProductShareItem[];
        productInvitations: ProductInvitationItem[];
        allowedSharePermissions: string[];
        storeInvitationUrl: string;
    }>(),
    {
        productShares: () => [],
        productInvitations: () => [],
        allowedSharePermissions: () => [],
        storeInvitationUrl: '',
    }
);

const inviteDialogOpen = ref(false);
const editingShare = ref<ProductShareItem | null>(null);

const inviteForm = useForm({
    email: '',
    permissions: [] as string[],
});

const editForm = useForm({
    permissions: [] as string[],
});

const isEditDialogOpen = computed({
    get: () => editingShare.value !== null,
    set: (open: boolean) => {
        if (!open) editingShare.value = null;
    },
});

function inviteSubmit() {
    if (!props.storeInvitationUrl) return;
    inviteForm.post(props.storeInvitationUrl, {
        preserveScroll: true,
        onSuccess: () => {
            inviteDialogOpen.value = false;
            inviteForm.reset('email', 'permissions');
        },
    });
}

function setPermissionChecked(perm: string, checked: boolean) {
    if (checked) {
        if (!inviteForm.permissions.includes(perm)) {
            inviteForm.permissions = [...inviteForm.permissions, perm];
        }
    } else {
        inviteForm.permissions = inviteForm.permissions.filter((p) => p !== perm);
    }
}

function openEditShare(share: ProductShareItem) {
    editingShare.value = share;
    editForm.permissions = [...(share.permissions ?? [])];
    editForm.clearErrors();
}

function submitEditShare() {
    const share = editingShare.value;
    if (!share || editForm.processing) return;
    editForm.permissions = editForm.permissions.filter((p) =>
        props.allowedSharePermissions.includes(p),
    );
    if (editForm.permissions.length === 0) return;
    editForm.patch(share.update_url, {
        preserveScroll: true,
        onSuccess: () => {
            editingShare.value = null;
        },
    });
}

function setEditPermissionChecked(perm: string, checked: boolean) {
    if (checked) {
        if (!editForm.permissions.includes(perm)) {
            editForm.permissions = [...editForm.permissions, perm];
        }
    } else {
        editForm.permissions = editForm.permissions.filter((p) => p !== perm);
    }
}

function removeShare(destroyUrl: string) {
    if (confirm('Zugriff für diese Person wirklich entfernen?')) {
        router.delete(destroyUrl, { preserveScroll: true });
    }
}

function removeInvitation(destroyUrl: string) {
    if (confirm('Einladung wirklich zurückziehen?')) {
        router.delete(destroyUrl, { preserveScroll: true });
    }
}

const permissionLabels: Record<string, string> = {
    view: 'Ansehen',
    renew: 'Verlängern',
    cancel_subscription: 'Abo kündigen',
    plesk_login: 'Plesk-Login',
    manage_auto_renew: 'Auto-Verlängerung',
    manage_tokens: 'Token verwalten',
    panel_login: 'Panel-Login',
    backups: 'Backups',
    schedules: 'Zeitpläne',
    databases: 'Datenbanken',
    create_server: 'Server anlegen',
    manage_servers: 'Server verwalten',
    authcode: 'Auth-Code',
    contact: 'Kontakt',
    whois: 'WHOIS',
    nameserver: 'Nameserver',
    dns: 'DNS',
    dnssec: 'DNSSEC',
    autorenew: 'Auto-Verlängerung',
};

function labelFor(perm: string): string {
    return permissionLabels[perm] ?? perm;
}
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Teilen</CardTitle>
            <CardDescription>Zugriff auf dieses Produkt an andere Nutzer vergeben</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <div v-if="!productShares?.length && !productInvitations?.length" class="py-6 text-center">
                <Text variant="small" muted>Noch niemandem Zugriff erteilt.</Text>
            </div>
            <div v-else class="space-y-2">
                <div
                    v-for="share in productShares"
                    :key="share.id"
                    class="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50"
                >
                    <div class="flex items-center gap-2">
                        <Avatar v-if="share.user" :name="share.user.name" size="sm" />
                        <div>
                            <Text class="font-medium">{{ share.user?.name ?? share.user?.email ?? '–' }}</Text>
                            <Text variant="small" muted>{{ share.user?.email }}</Text>
                            <div v-if="share.permissions?.length" class="mt-1 flex flex-wrap gap-1">
                                <span
                                    v-for="p in share.permissions"
                                    :key="p"
                                    class="rounded bg-muted px-1.5 py-0.5 text-xs"
                                >
                                    {{ labelFor(p) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <Button variant="ghost" size="sm" @click="openEditShare(share)" title="Berechtigungen anpassen">
                            <Pencil class="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" @click="removeShare(share.destroy_url)" title="Zugriff entfernen">
                            <X class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div
                    v-for="inv in productInvitations"
                    :key="inv.id"
                    class="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 p-2 dark:border-amber-800 dark:bg-amber-900/10"
                >
                    <div class="flex items-center gap-2">
                        <Mail class="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <div>
                            <Text class="font-medium">{{ inv.email }}</Text>
                            <Text variant="small" muted>Einladung ausstehend</Text>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" @click="removeInvitation(inv.destroy_url)">
                        <X class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Dialog v-model:open="inviteDialogOpen">
                <DialogTrigger as-child>
                    <Button class="mt-4 w-full" variant="outline" size="sm">
                        <UserPlus class="mr-2 h-4 w-4" />
                        Einladen
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Zugriff einladen</DialogTitle>
                        <DialogDescription>
                            E-Mail-Adresse und Berechtigungen festlegen. Der Eingeladene erhält eine E-Mail zur Annahme.
                        </DialogDescription>
                    </DialogHeader>
                    <form @submit.prevent="inviteSubmit" class="space-y-4">
                        <div class="space-y-2">
                            <Label for="share-email">E-Mail-Adresse</Label>
                            <Input
                                id="share-email"
                                v-model="inviteForm.email"
                                type="email"
                                placeholder="nutzer@example.com"
                                required
                                :aria-invalid="!!inviteForm.errors.email"
                            />
                            <InputError :message="inviteForm.errors.email" />
                        </div>
                        <div class="space-y-2">
                            <Label>Berechtigungen</Label>
                            <div class="flex flex-wrap gap-3">
                                <div
                                    v-for="perm in allowedSharePermissions"
                                    :key="perm"
                                    class="flex items-center gap-2"
                                >
                                    <Checkbox
                                        :model-value="inviteForm.permissions.includes(perm)"
                                        @update:model-value="(val: boolean) => setPermissionChecked(perm, val)"
                                    />
                                    <span class="text-sm cursor-pointer" @click="setPermissionChecked(perm, !inviteForm.permissions.includes(perm))">{{ labelFor(perm) }}</span>
                                </div>
                            </div>
                            <InputError :message="inviteForm.errors.permissions" />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" @click="inviteDialogOpen = false">
                                Abbrechen
                            </Button>
                            <Button type="submit" :disabled="inviteForm.processing || inviteForm.permissions.length === 0">
                                Einladung senden
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog v-model:open="isEditDialogOpen">
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Berechtigungen anpassen</DialogTitle>
                        <DialogDescription v-if="editingShare">
                            Berechtigungen für {{ editingShare.user?.name ?? editingShare.user?.email ?? '–' }} ändern.
                        </DialogDescription>
                    </DialogHeader>
                    <form v-if="editingShare" @submit.prevent="submitEditShare" class="space-y-4">
                        <div class="space-y-2">
                            <Label>Berechtigungen</Label>
                            <div class="flex flex-wrap gap-3">
                                <div
                                    v-for="perm in allowedSharePermissions"
                                    :key="perm"
                                    class="flex items-center gap-2"
                                >
                                    <Checkbox
                                        :model-value="editForm.permissions.includes(perm)"
                                        @update:model-value="(val: boolean) => setEditPermissionChecked(perm, val)"
                                    />
                                    <span class="text-sm cursor-pointer" @click="setEditPermissionChecked(perm, !editForm.permissions.includes(perm))">{{ labelFor(perm) }}</span>
                                </div>
                            </div>
                            <InputError :message="editForm.errors.permissions" />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" @click="editingShare = null">
                                Abbrechen
                            </Button>
                            <Button type="submit" :disabled="editForm.processing || editForm.permissions.length === 0">
                                Speichern
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </CardContent>
    </Card>
</template>
