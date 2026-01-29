<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import TemplateController from '@/actions/App/Http/Controllers/Admin/TemplateController';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { index as templatesIndex } from '@/routes/admin/templates';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { ref } from 'vue';

const colors = ref({
    primary: '',
    primaryHover: '',
    primaryLight: '',
    primaryDark: '',
    secondary: '',
    tertiary: '',
    quaternary: '',
    quinary: '',
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Templates', href: templatesIndex().url },
    { title: 'Neues Template', href: '#' },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Template erstellen" />

        <div class="space-y-6">
            <div>
                <Heading level="h1">Neues Template</Heading>
                <Text class="mt-2" muted>
                    Template anlegen
                </Text>
            </div>

            <Card class="max-w-2xl">
                <CardHeader>
                    <CardTitle>Template-Details</CardTitle>
                    <CardDescription>Geben Sie die Informationen für das neue Template ein</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form
                        v-bind="TemplateController.store.form()"
                        class="space-y-6"
                        v-slot="{ errors }"
                    >
                        <div class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                placeholder="Name"
                                :aria-invalid="!!errors.name"
                            />
                            <InputError :message="errors.name" />
                        </div>
                        <div class="space-y-2">
                            <Label for="slug">Slug</Label>
                            <Input
                                id="slug"
                                name="slug"
                                required
                                placeholder="slug-url"
                                :aria-invalid="!!errors.slug"
                            />
                            <InputError :message="errors.slug" />
                        </div>
                        <div class="space-y-2">
                            <Label for="price">Preis</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                :default-value="0"
                                :aria-invalid="!!errors.price"
                            />
                            <InputError :message="errors.price" />
                        </div>
                        <div class="space-y-2">
                            <Label>Farben</Label>
                            <div class="grid grid-cols-2 gap-4 rounded-lg border border-input p-4">
                                <div class="grid gap-2">
                                    <Label for="color-primary" class="text-xs">Primary</Label>
                                    <div class="flex gap-2">
                                        <Input
                                            id="color-primary"
                                            name="colors[primary]"
                                            v-model="colors.primary"
                                            placeholder="#059669"
                                        />
                                        <div
                                            class="h-9 w-16 rounded-md border border-input"
                                            :style="{ backgroundColor: colors.primary || 'transparent' }"
                                        />
                                    </div>
                                </div>
                                <div class="grid gap-2">
                                    <Label for="color-primaryHover" class="text-xs">Primary Hover</Label>
                                    <div class="flex gap-2">
                                        <Input
                                            id="color-primaryHover"
                                            name="colors[primaryHover]"
                                            v-model="colors.primaryHover"
                                            placeholder="#047857"
                                        />
                                        <div
                                            class="h-9 w-16 rounded-md border border-input"
                                            :style="{ backgroundColor: colors.primaryHover || 'transparent' }"
                                        />
                                    </div>
                                </div>
                                <div class="grid gap-2">
                                    <Label for="color-primaryLight" class="text-xs">Primary Light</Label>
                                    <div class="flex gap-2">
                                        <Input
                                            id="color-primaryLight"
                                            name="colors[primaryLight]"
                                            v-model="colors.primaryLight"
                                            placeholder="#ecfdf5"
                                        />
                                        <div
                                            class="h-9 w-16 rounded-md border border-input"
                                            :style="{ backgroundColor: colors.primaryLight || 'transparent' }"
                                        />
                                    </div>
                                </div>
                                <div class="grid gap-2">
                                    <Label for="color-primaryDark" class="text-xs">Primary Dark</Label>
                                    <div class="flex gap-2">
                                        <Input
                                            id="color-primaryDark"
                                            name="colors[primaryDark]"
                                            v-model="colors.primaryDark"
                                            placeholder="#065f46"
                                        />
                                        <div
                                            class="h-9 w-16 rounded-md border border-input"
                                            :style="{ backgroundColor: colors.primaryDark || 'transparent' }"
                                        />
                                    </div>
                                </div>
                                <div class="grid gap-2">
                                    <Label for="color-secondary" class="text-xs">Secondary</Label>
                                    <div class="flex gap-2">
                                        <Input
                                            id="color-secondary"
                                            name="colors[secondary]"
                                            v-model="colors.secondary"
                                            placeholder="#0f172a"
                                        />
                                        <div
                                            class="h-9 w-16 rounded-md border border-input"
                                            :style="{ backgroundColor: colors.secondary || 'transparent' }"
                                        />
                                    </div>
                                </div>
                                <div class="grid gap-2">
                                    <Label for="color-tertiary" class="text-xs">Tertiary</Label>
                                    <div class="flex gap-2">
                                        <Input
                                            id="color-tertiary"
                                            name="colors[tertiary]"
                                            v-model="colors.tertiary"
                                            placeholder="#334155"
                                        />
                                        <div
                                            class="h-9 w-16 rounded-md border border-input"
                                            :style="{ backgroundColor: colors.tertiary || 'transparent' }"
                                        />
                                    </div>
                                </div>
                                <div class="grid gap-2">
                                    <Label for="color-quaternary" class="text-xs">Quaternary</Label>
                                    <div class="flex gap-2">
                                        <Input
                                            id="color-quaternary"
                                            name="colors[quaternary]"
                                            v-model="colors.quaternary"
                                            placeholder="#f8fafc"
                                        />
                                        <div
                                            class="h-9 w-16 rounded-md border border-input"
                                            :style="{ backgroundColor: colors.quaternary || 'transparent' }"
                                        />
                                    </div>
                                </div>
                                <div class="grid gap-2">
                                    <Label for="color-quinary" class="text-xs">Quinary</Label>
                                    <div class="flex gap-2">
                                        <Input
                                            id="color-quinary"
                                            name="colors[quinary]"
                                            v-model="colors.quinary"
                                            placeholder="#f1f5f9"
                                        />
                                        <div
                                            class="h-9 w-16 rounded-md border border-input"
                                            :style="{ backgroundColor: colors.quinary || 'transparent' }"
                                        />
                                    </div>
                                </div>
                            </div>
                            <InputError :message="errors.colors" />
                        </div>
                        <CardFooter class="px-0 pb-0">
                            <div class="flex gap-2">
                                <Button type="submit">Speichern</Button>
                                <Link :href="templatesIndex().url">
                                    <Button type="button" variant="outline">Abbrechen</Button>
                                </Link>
                            </div>
                        </CardFooter>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
