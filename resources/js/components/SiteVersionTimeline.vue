<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heading, Text } from '@/components/ui/typography';
import { router } from '@inertiajs/vue3';
import { Clock, CheckCircle, FileText } from 'lucide-vue-next';

type User = {
    id: number;
    name: string;
};

type SiteVersion = {
    id: number;
    version_number: number;
    name: string;
    description: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    created_by: number;
    creator?: User;
};

interface Props {
    versions: SiteVersion[];
    siteUuid: string;
    publishedVersionId?: number | null;
}

const props = defineProps<Props>();

const publishVersion = (versionId: number) => {
    if (confirm('Möchten Sie diese Version wirklich veröffentlichen?')) {
        router.post(`/sites/${props.siteUuid}/versions/${versionId}/publish`, {}, {
            preserveScroll: true,
        });
    }
};

const rollbackVersion = (versionId: number) => {
    if (confirm('Möchten Sie wirklich zu dieser Version zurückkehren? Alle aktuellen Änderungen gehen verloren.')) {
        router.post(`/sites/${props.siteUuid}/versions/${versionId}/rollback`, {}, {
            preserveScroll: true,
        });
    }
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Versionsverlauf</CardTitle>
            <CardDescription>Verlauf aller Versionen dieser Site</CardDescription>
        </CardHeader>
        <CardContent>
            <div v-if="!versions?.length" class="text-center py-8">
                <Text variant="small" muted>
                    Noch keine Versionen vorhanden.
                </Text>
            </div>
            <div v-else class="space-y-4">
                <div
                    v-for="version in versions"
                    :key="version.id"
                    class="relative pl-8 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:border-l-0 last:pb-0"
                >
                    <div class="absolute -left-2 top-0">
                        <div
                            :class="[
                                'h-4 w-4 rounded-full border-2',
                                version.is_published || version.id === publishedVersionId
                                    ? 'bg-green-500 border-green-500'
                                    : 'bg-gray-300 border-gray-300 dark:bg-gray-600 dark:border-gray-600',
                            ]"
                        />
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <div>
                                <Text class="font-medium">{{ version.name }}</Text>
                                <Text variant="small" muted>
                                    {{ formatDate(version.created_at) }}
                                </Text>
                            </div>
                            <div class="flex items-center gap-2">
                                <Badge
                                    v-if="version.is_published || version.id === publishedVersionId"
                                    variant="success"
                                >
                                    Veröffentlicht
                                </Badge>
                                <Badge v-else variant="default">
                                    Entwurf
                                </Badge>
                            </div>
                        </div>
                        <Text v-if="version.description" variant="small" muted>
                            {{ version.description }}
                        </Text>
                        <Text v-if="version.creator" variant="small" muted>
                            Erstellt von: {{ version.creator.name }}
                        </Text>
                        <div class="flex gap-2 mt-2">
                            <Button
                                v-if="!version.is_published && version.id !== publishedVersionId"
                                variant="outline"
                                size="sm"
                                @click="publishVersion(version.id)"
                            >
                                <CheckCircle class="mr-2 h-4 w-4" />
                                Veröffentlichen
                            </Button>
                            <Button
                                v-if="version.id !== publishedVersionId"
                                variant="outline"
                                size="sm"
                                @click="rollbackVersion(version.id)"
                            >
                                <FileText class="mr-2 h-4 w-4" />
                                Wiederherstellen
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>
