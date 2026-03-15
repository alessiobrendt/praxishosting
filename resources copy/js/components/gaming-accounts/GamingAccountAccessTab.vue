<script setup lang="ts">
import { Copy, ExternalLink } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

defineProps<{
    gameServerAccount: { name: string; identifier: string | null };
    userEmail: string;
    loginUrl: string | null;
    isSuspendedOrExpired: boolean;
}>();

defineEmits<{
    copyToClipboard: [text: string];
}>();
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Zugangsdaten</CardTitle>
            <CardDescription>
                Server-Name, Identifier und E-Mail für die Anmeldung im Pterodactyl-Panel.
            </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="space-y-2">
                    <label class="text-sm font-medium">Server-Name</label>
                    <div class="flex gap-2">
                        <Input
                            :model-value="gameServerAccount.name"
                            readonly
                            class="font-mono bg-muted"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Kopieren"
                            @click="$emit('copyToClipboard', gameServerAccount.name)"
                        >
                            <Copy class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Server-ID (Identifier)</label>
                    <div class="flex gap-2">
                        <Input
                            :model-value="gameServerAccount.identifier ?? '—'"
                            readonly
                            class="font-mono bg-muted"
                        />
                        <Button
                            v-if="gameServerAccount.identifier"
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Kopieren"
                            @click="$emit('copyToClipboard', gameServerAccount.identifier!)"
                        >
                            <Copy class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium">E-Mail-Adresse</label>
                <div class="flex gap-2">
                    <Input :model-value="userEmail" readonly class="font-mono bg-muted" />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="Kopieren"
                        @click="$emit('copyToClipboard', userEmail)"
                    >
                        <Copy class="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div class="pt-2">
                <a
                    v-if="loginUrl && !isSuspendedOrExpired"
                    :href="loginUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex w-full justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
                >
                    <ExternalLink class="mr-2 h-4 w-4" />
                    Im Panel anmelden
                </a>
                <p v-else-if="isSuspendedOrExpired" class="text-sm text-muted-foreground">
                    Server gesperrt. Bitte verlängern Sie, um das Panel zu nutzen.
                </p>
            </div>
        </CardContent>
    </Card>
</template>
