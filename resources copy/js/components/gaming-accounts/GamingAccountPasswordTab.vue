<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ExternalLink } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';

defineProps<{
    loginUrl: string | null;
    isSuspendedOrExpired: boolean;
}>();
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Passwort</CardTitle>
            <CardDescription>
                Ihr Panel-Passwort wurde bei der Einrichtung gesetzt. Sie können es im
                Pterodactyl-Panel unter „Zugangsdaten“ oder „Passwort“ anzeigen und ändern.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Link v-if="loginUrl && !isSuspendedOrExpired" :href="loginUrl" target="_blank" rel="noopener noreferrer">
                <Button>
                    <ExternalLink class="mr-2 h-4 w-4" />
                    Panel öffnen (Passwort verwalten)
                </Button>
            </Link>
            <Text v-else-if="isSuspendedOrExpired" class="text-muted-foreground">
                Server gesperrt. Bitte verlängern Sie, um das Panel zu nutzen.
            </Text>
            <Text v-else class="text-muted-foreground">
                Sobald der Server aktiv ist, können Sie sich im Panel anmelden und dort das
                Passwort verwalten.
            </Text>
        </CardContent>
    </Card>
</template>
