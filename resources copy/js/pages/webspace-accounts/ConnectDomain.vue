<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { computed } from 'vue';
import { ArrowLeft, Copy, FileText, Server } from 'lucide-vue-next';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import { notify } from '@/composables/useNotify';
import type { BreadcrumbItem } from '@/types';

type WebspaceAccount = {
    uuid: string;
    name: string;
    domain: string;
};

type ResellerDomain = {
    uuid: string;
    domain: string;
};

type Props = {
    webspaceAccount: WebspaceAccount;
    bindZoneTemplate: string;
    resellerDomains: ResellerDomain[];
    connectDomainConfirmUrl: string;
    webspaceShowUrl: string;
};

const props = defineProps<Props>();

const form = useForm({
    reseller_domain_uuid: '' as string,
});

const selectedDomain = computed(() =>
    props.resellerDomains.find((d) => d.uuid === form.reseller_domain_uuid),
);

/** Template domain to replace (case-insensitive). */
const templateDomain = 'meinedomain.de';

/** Generated zone: template with meinedomain.de replaced by selected domain. */
const displayedZone = computed(() => {
    const domain = selectedDomain.value?.domain;
    if (!domain || !props.bindZoneTemplate) return '';
    const re = new RegExp(templateDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    return props.bindZoneTemplate.replace(re, domain);
});

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Webspace-Accounts', href: '/webspace-accounts' },
    { title: props.webspaceAccount.name || props.webspaceAccount.domain, href: props.webspaceShowUrl },
    { title: 'Domain verbinden', href: '#' },
];

function copyBindZone() {
    if (!displayedZone.value) return;
    navigator.clipboard.writeText(displayedZone.value).then(() => notify.success('Zone in Zwischenablage kopiert'));
}

function submitConfirm() {
    form.post(props.connectDomainConfirmUrl);
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Domain verbinden" />

        <div class="mx-auto max-w-3xl space-y-6">
            <div class="flex items-center gap-2">
                <Link :href="webspaceShowUrl">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft class="mr-1 h-4 w-4" />
                        Zurück
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent class="pt-6">
                    <div class="mb-4 flex items-center gap-2 text-muted-foreground">
                        <Server class="h-5 w-5" />
                        <span>{{ webspaceAccount.name || webspaceAccount.domain }}</span>
                    </div>

                    <p class="mb-4 text-sm text-muted-foreground">
                        Wählen Sie die Domain, die Sie mit diesem Webspace verbinden möchten. Die DNS-Einträge werden
                        automatisch aus der Server-Vorlage erzeugt (<code class="rounded bg-muted px-1 font-mono text-xs">meinedomain.de</code>
                        wird durch Ihre Domain ersetzt). Mit „DNS-Einträge erstellen“ werden die Einträge bei uns gesetzt.
                    </p>

                    <p class="mb-4 text-xs text-muted-foreground">
                        Die Nameserver der Domain müssen auf uns zeigen, damit die Einträge wirksam werden. Sie können
                        die Zone unten prüfen oder kopieren; zum Übernehmen klicken Sie auf „DNS-Einträge erstellen“.
                    </p>

                    <div class="mb-4 space-y-2">
                        <Label for="reseller_domain_uuid">Domain</Label>
                        <select
                            id="reseller_domain_uuid"
                            v-model="form.reseller_domain_uuid"
                            class="flex h-9 w-full max-w-md rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">Domain wählen…</option>
                            <option
                                v-for="d in resellerDomains"
                                :key="d.uuid"
                                :value="d.uuid"
                            >
                                {{ d.domain }}
                            </option>
                        </select>
                        <InputError :message="form.errors.reseller_domain_uuid" />
                    </div>

                    <template v-if="selectedDomain">
                        <div class="mb-4 flex items-center justify-between gap-2">
                            <span class="text-sm font-medium">Erzeugte Bind-Zone für {{ selectedDomain.domain }}</span>
                            <Button variant="outline" size="sm" @click="copyBindZone">
                                <Copy class="mr-1 h-4 w-4" />
                                Kopieren
                            </Button>
                        </div>
                        <pre
                            class="max-h-[400px] overflow-auto rounded-md border bg-muted/30 p-4 text-xs font-mono whitespace-pre-wrap break-all"
                        >{{ displayedZone }}</pre>
                    </template>
                    <div
                        v-else
                        class="rounded-md border border-dashed bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                        Bitte wählen Sie oben eine Domain, um die DNS-Zone zu erzeugen.
                    </div>

                    <div class="mt-6 flex flex-wrap items-center gap-2 border-t pt-6">
                        <form @submit.prevent="submitConfirm" class="inline">
                            <Button
                                type="submit"
                                :disabled="!selectedDomain || form.processing"
                            >
                            <FileText class="mr-1 h-4 w-4" />
                            {{ form.processing ? 'Wird erstellt…' : 'DNS-Einträge erstellen' }}
                            </Button>
                        </form>
                        <Link :href="webspaceShowUrl">
                            <Button type="button" variant="outline">
                                Abbrechen
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    </AppLayout>
</template>
