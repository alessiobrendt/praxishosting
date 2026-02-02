<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heading, Text } from '@/components/ui/typography';
import { Copy, Check, AlertCircle } from 'lucide-vue-next';
import { ref } from 'vue';

interface Props {
    domain?: string;
    baseDomain: string;
    isVerified?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    domain: '',
    isVerified: false,
});

const copied = ref(false);

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};

const cnameValue = `${props.domain || 'ihre-domain.de'} → ${props.baseDomain}`;
</script>

<template>
    <Card v-if="!isVerified">
        <CardHeader>
            <CardTitle>Domain verbinden</CardTitle>
            <CardDescription>
                Verbinden Sie Ihre eigene Domain mit dieser Site
            </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
            <div v-if="isVerified" class="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                <div class="flex items-center gap-2">
                    <Check class="h-5 w-5 text-green-600 dark:text-green-400" />
                    <Text class="font-medium text-green-900 dark:text-green-100">
                        Domain erfolgreich verbunden
                    </Text>
                </div>
            </div>

            <div class="space-y-3">
                <div>
                    <Text class="font-medium mb-2">Schritt 1: DNS-Einstellungen öffnen</Text>
                    <Text variant="small" muted>
                        Öffnen Sie die DNS-Verwaltung Ihres Domain-Providers (z.B. bei Ihrem Hoster oder bei Cloudflare, Namecheap, etc.)
                    </Text>
                </div>

                <div>
                    <Text class="font-medium mb-2">Schritt 2: CNAME-Record hinzufügen</Text>
                    <Text variant="small" muted class="mb-2">
                        Erstellen Sie einen neuen CNAME-Record mit folgenden Werten:
                    </Text>
                    <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 space-y-2">
                        <div class="flex items-center justify-between">
                            <div>
                                <Text variant="small" class="font-medium">Typ:</Text>
                                <code class="ml-2 text-sm">CNAME</code>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <Text variant="small" class="font-medium">Name:</Text>
                                <code class="ml-2 text-sm">{{ domain || 'ihre-domain.de' }}</code>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <Text variant="small" class="font-medium">Wert:</Text>
                                <code class="ml-2 text-sm break-all">{{ baseDomain }}</code>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                @click="copyToClipboard(baseDomain)"
                            >
                                <Copy v-if="!copied" class="h-4 w-4" />
                                <Check v-else class="h-4 w-4 text-green-600" />
                            </Button>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <Text variant="small" class="font-medium">TTL:</Text>
                                <code class="ml-2 text-sm">3600</code>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Text class="font-medium mb-2">Schritt 3: Warten Sie auf DNS-Propagierung</Text>
                    <Text variant="small" muted>
                        Die DNS-Änderungen können bis zu 48 Stunden dauern, meist sind sie aber innerhalb weniger Stunden aktiv.
                    </Text>
                </div>

                <div class="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                    <div class="flex items-start gap-2">
                        <AlertCircle class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                            <Text variant="small" class="font-medium text-blue-900 dark:text-blue-100">
                                Wichtig:
                            </Text>
                            <Text variant="small" class="text-blue-800 dark:text-blue-200">
                                Stellen Sie sicher, dass der CNAME-Record genau auf <code class="bg-blue-100 dark:bg-blue-900 px-1 rounded">{{ baseDomain }}</code> zeigt.
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>
