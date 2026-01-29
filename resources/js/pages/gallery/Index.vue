<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import gallery from '@/routes/gallery';
import { home } from '@/routes';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Image as ImageIcon } from 'lucide-vue-next';

type Template = {
    id: number;
    name: string;
    slug: string;
    preview_image: string | null;
    price: string;
};

type Props = {
    templates: Template[];
};

defineProps<Props>();
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <Head title="Template-Galerie" />

        <header class="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 shadow-modern">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link :href="home().url" class="text-xl font-semibold gradient-primary bg-clip-text text-transparent">
                    PraxisHosting
                </Link>
                <nav class="flex gap-4">
                    <Link :href="home().url">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft class="mr-2 h-4 w-4" />
                            Zurück
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>

        <main class="container mx-auto px-6 py-12">
            <div class="mb-8">
                <Heading level="h1">Website-Templates</Heading>
                <Text class="mt-2" muted>
                    Wählen Sie ein Template für Ihre Webseite
                </Text>
            </div>

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    v-for="template in templates"
                    :key="template.id"
                    :href="gallery.preview({ template: template.id }).url"
                >
                    <Card hover class="h-full transition-modern">
                        <div class="aspect-video rounded-t-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            <img
                                v-if="template.preview_image"
                                :src="template.preview_image"
                                :alt="template.name"
                                class="w-full h-full object-cover transition-modern-slow group-hover:scale-105"
                            />
                            <div v-else class="flex flex-col items-center gap-2 text-gray-400">
                                <ImageIcon class="h-12 w-12" />
                                <Text variant="small" muted>Kein Vorschaubild</Text>
                            </div>
                        </div>
                        <CardHeader>
                            <div class="flex items-start justify-between">
                                <CardTitle class="text-lg">{{ template.name }}</CardTitle>
                                <Badge variant="default">{{ template.price }} €</Badge>
                            </div>
                        </CardHeader>
                    </Card>
                </Link>
            </div>

            <div v-if="templates.length === 0" class="text-center py-12">
                <Text muted>Keine Templates verfügbar</Text>
            </div>
        </main>
    </div>
</template>
