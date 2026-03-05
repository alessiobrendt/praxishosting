<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Heading } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import monitoring from '@/routes/admin/monitoring/index';
import type { BreadcrumbItem } from '@/types';

type TypeOption = { value: string; label: string };

const props = defineProps<{
    types: TypeOption[];
}>();

const form = useForm({
    type: 'http_url' as string,
    name: '',
    config: {
        url: '',
        timeout: 10,
        expected_status: 200,
        host: '',
        port: '',
    } as Record<string, unknown>,
    is_enabled: true,
});

const isHttpUrl = computed(() => form.type === 'http_url');
const isTcpPort = computed(() => form.type === 'tcp_port');

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Monitoring', href: monitoring.index.url() },
    { title: 'Neues Ziel', href: '#' },
];
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="Monitor-Ziel anlegen" />

        <div class="space-y-6">
            <Heading level="h1">Monitor-Ziel anlegen</Heading>

            <Card class="max-w-xl">
                <form @submit.prevent="form.post(monitoring.store.url())">
                    <CardHeader>
                        <CardTitle>Ziel</CardTitle>
                        <CardDescription>URL (HTTP/HTTPS) oder TCP-Port zum Überwachen</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="space-y-2">
                            <Label for="type">Typ</Label>
                            <Select id="type" v-model="form.type" required :aria-invalid="!!form.errors.type">
                                <option v-for="t in props.types" :key="t.value" :value="t.value">{{ t.label }}</option>
                            </Select>
                            <InputError :message="form.errors.type" />
                        </div>
                        <div class="space-y-2">
                            <Label for="name">Name</Label>
                            <Input
                                id="name"
                                v-model="form.name"
                                placeholder="z. B. Hauptseite, SSH-Server"
                                required
                                :aria-invalid="!!form.errors.name"
                            />
                            <InputError :message="form.errors.name" />
                        </div>

                        <template v-if="isHttpUrl">
                            <div class="space-y-2">
                                <Label for="config.url">URL</Label>
                                <Input
                                    id="config.url"
                                    v-model="form.config.url"
                                    type="url"
                                    placeholder="https://example.com/health"
                                    required
                                    :aria-invalid="!!form.errors['config.url']"
                                />
                                <InputError :message="form.errors['config.url']" />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label for="config.timeout">Timeout (Sekunden)</Label>
                                    <Input
                                        id="config.timeout"
                                        v-model.number="form.config.timeout"
                                        type="number"
                                        min="1"
                                        max="60"
                                    />
                                    <InputError :message="form.errors['config.timeout']" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config.expected_status">Erwarteter HTTP-Status</Label>
                                    <Input
                                        id="config.expected_status"
                                        v-model.number="form.config.expected_status"
                                        type="number"
                                        min="100"
                                        max="599"
                                    />
                                    <InputError :message="form.errors['config.expected_status']" />
                                </div>
                            </div>
                        </template>

                        <template v-if="isTcpPort">
                            <div class="space-y-2">
                                <Label for="config.host">Host</Label>
                                <Input
                                    id="config.host"
                                    v-model="form.config.host"
                                    placeholder="example.com oder 192.168.1.1"
                                    required
                                    :aria-invalid="!!form.errors['config.host']"
                                />
                                <InputError :message="form.errors['config.host']" />
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <Label for="config.port">Port</Label>
                                    <Input
                                        id="config.port"
                                        v-model.number="form.config.port"
                                        type="number"
                                        min="1"
                                        max="65535"
                                        required
                                        :aria-invalid="!!form.errors['config.port']"
                                    />
                                    <InputError :message="form.errors['config.port']" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="config.timeout_tcp">Timeout (Sekunden)</Label>
                                    <Input
                                        id="config.timeout_tcp"
                                        v-model.number="form.config.timeout"
                                        type="number"
                                        min="1"
                                        max="30"
                                    />
                                    <InputError :message="form.errors['config.timeout']" />
                                </div>
                            </div>
                        </template>

                        <div class="flex items-center gap-2">
                            <Switch id="is_enabled" v-model="form.is_enabled" />
                            <Label for="is_enabled">Aktiv</Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" :disabled="form.processing">Anlegen</Button>
                        <Link :href="monitoring.index.url()"><Button type="button" variant="outline">Abbrechen</Button></Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    </AdminLayout>
</template>
