<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { dashboard, login, register } from '@/routes';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text, Link as TypographyLink } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Sparkles, Globe, Zap } from 'lucide-vue-next';

withDefaults(
    defineProps<{
        canRegister: boolean;
    }>(),
    {
        canRegister: true,
    },
);
</script>

<template>
    <Head title="Willkommen">
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    </Head>

    <div class="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
        <!-- Header -->
        <header class="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 shadow-modern">
            <div class="container mx-auto px-6 py-4 flex justify-between items-center">
                <div class="text-xl font-semibold gradient-primary bg-clip-text text-transparent">
                    PraxisHosting
                </div>
                <nav class="flex items-center gap-4">
                    <Link v-if="$page.props.auth.user" :href="dashboard.url()">
                        <Button variant="ghost" size="sm">Dashboard</Button>
                    </Link>
                    <template v-else>
                        <Link :href="login.url()">
                            <Button variant="ghost" size="sm">Anmelden</Button>
                        </Link>
                        <Link v-if="canRegister" :href="register.url()">
                            <Button size="sm">Registrieren</Button>
                        </Link>
                    </template>
                </nav>
            </div>
        </header>

        <!-- Hero Section -->
        <main class="flex-1 container mx-auto px-6 py-20">
            <div class="max-w-4xl mx-auto text-center space-y-8">
                <Badge variant="default" class="mb-4">
                    <Sparkles class="mr-2 h-3 w-3" />
                    Moderne Website-Lösungen
                </Badge>

                <Heading level="h1" class="text-5xl md:text-6xl font-bold">
                    Professionelle Websites
                    <span class="gradient-primary bg-clip-text text-transparent">
                        einfach erstellen
                    </span>
                </Heading>

                <Text class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Erstellen Sie Ihre perfekte Website mit unseren modernen Templates.
                    Schnell, einfach und professionell.
                </Text>

                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link v-if="canRegister" :href="register.url()">
                        <Button size="lg" class="w-full sm:w-auto">
                            Jetzt starten
                            <ArrowRight class="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link :href="login.url()">
                        <Button variant="outline" size="lg" class="w-full sm:w-auto">
                            Anmelden
                        </Button>
                    </Link>
                </div>
            </div>

            <!-- Features -->
            <div class="mt-20 grid gap-6 md:grid-cols-3">
                <Card hover>
                    <CardHeader>
                        <div class="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                            <Zap class="h-6 w-6 text-white" />
                        </div>
                        <CardTitle>Schnell</CardTitle>
                        <CardDescription>
                            Erstellen Sie Ihre Website in Minuten, nicht Stunden
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card hover>
                    <CardHeader>
                        <div class="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                            <Globe class="h-6 w-6 text-white" />
                        </div>
                        <CardTitle>Modern</CardTitle>
                        <CardDescription>
                            Professionelle Templates mit modernem Design
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card hover>
                    <CardHeader>
                        <div class="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                            <Sparkles class="h-6 w-6 text-white" />
                        </div>
                        <CardTitle>Einfach</CardTitle>
                        <CardDescription>
                            Intuitive Bedienung ohne technisches Know-how
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </main>

        <!-- Footer -->
        <footer class="border-t border-gray-200 dark:border-gray-800 py-8">
            <div class="container mx-auto px-6 text-center">
                <Text variant="small" muted>
                    © 2024 PraxisHosting. Alle Rechte vorbehalten.
                </Text>
            </div>
        </footer>
    </div>
</template>
