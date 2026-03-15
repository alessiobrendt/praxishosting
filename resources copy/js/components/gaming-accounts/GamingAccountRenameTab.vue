<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Pencil } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/typography';

defineProps<{
    gameServerAccount: { name: string };
    loginUrl: string | null;
    isSuspendedOrExpired: boolean;
}>();
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Server umbenennen</CardTitle>
            <CardDescription>
                Den Anzeigenamen Ihres Servers können Sie im Pterodactyl-Panel unter Einstellungen
                ändern. Die Änderung gilt im Panel und hier in der Übersicht.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div class="mb-4 space-y-2">
                <label class="text-sm font-medium">Aktueller Name</label>
                <Input :model-value="gameServerAccount.name" readonly class="bg-muted" />
            </div>
            <Link v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                    <Pencil class="mr-2 h-4 w-4" />
                    Im Panel umbenennen
                </Button>
            </Link>
            <Text v-else-if="isSuspendedOrExpired" class="text-muted-foreground">
                Server gesperrt. Bitte verlängern Sie, um das Panel zu nutzen.
            </Text>
        </CardContent>
    </Card>
</template>
