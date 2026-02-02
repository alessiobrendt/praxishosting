<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import InputError from '@/components/InputError.vue';
import {
    index as sitesIndex,
    edit as sitesEdit,
    design as sitesDesign,
} from '@/routes/sites';
import { getTemplateEntry } from '@/templates/template-registry';
import { store as storeCollaborator, destroy as destroyCollaborator } from '@/routes/sites/collaborators';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Edit, ExternalLink, UserPlus, X, Mail, Shield, Globe, Plus, RefreshCw, Star, Trash2, Layout } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import DomainConnectionGuide from '@/components/DomainConnectionGuide.vue';
import SiteVersionTimeline from '@/components/SiteVersionTimeline.vue';
import { store as storeDomain, verify as verifyDomain, setPrimary as setPrimaryDomain, destroy as destroyDomain } from '@/actions/App/Http/Controllers/SiteDomainController';

type User = {
    id: number;
    name: string;
    email: string;
};

type SiteInvitation = {
    id: number;
    email: string;
    role: string;
    expires_at: string;
};

type Domain = {
    id: number;
    domain: string;
    type: string;
    is_primary: boolean;
    is_verified: boolean;
    ssl_status: string | null;
    ssl_expires_at: string | null;
    ssl_checked_at: string | null;
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

type SiteSubscription = {
    id: number;
    stripe_status: string;
    current_period_ends_at: string | null;
    cancel_at_period_end: boolean;
};

type Site = {
    uuid: string;
    name: string;
    slug: string;
    has_page_designer?: boolean;
    is_legacy?: boolean;
    template: { name: string; slug: string };
    site_subscription?: SiteSubscription | null;
    collaborators: User[];
    invitations: SiteInvitation[];
    domains: Domain[];
    versions: SiteVersion[];
    published_version_id: number | null;
    draft_version_id: number | null;
    user: User;
};

type PaymentMethodSummary = {
    brand: string;
    last4: string;
};

type Props = {
    site: Site;
    baseDomain: string;
    billingPortalUrl: string;
    paymentMethodSummary: PaymentMethodSummary | null;
};

const props = defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Sites', href: sitesIndex().url },
    { title: props.site.name, href: '#' },
];

const inviteDialogOpen = ref(false);
const addDomainDialogOpen = ref(false);
const cancelSubscriptionDialogOpen = ref(false);
const cancelSubscriptionProcessing = ref(false);

const inviteForm = useForm({
    email: '',
    role: 'editor',
});

const domainForm = useForm({
    domain: '',
});

const inviteCollaborator = () => {
    inviteForm.post(storeCollaborator({ site: props.site.uuid }).url, {
        preserveScroll: true,
        onSuccess: () => {
            inviteForm.reset();
            inviteDialogOpen.value = false;
        },
    });
};

function confirmCancelSubscription() {
    cancelSubscriptionProcessing.value = true;
    router.post(`/sites/${props.site.uuid}/subscription/cancel`, {}, {
        preserveScroll: true,
        onSuccess: () => {
            cancelSubscriptionDialogOpen.value = false;
            cancelSubscriptionProcessing.value = false;
        },
        onError: () => {
            cancelSubscriptionProcessing.value = false;
        },
        onFinish: () => {
            cancelSubscriptionProcessing.value = false;
        },
    });
}

const removeCollaborator = (user: User) => {
    if (confirm(`Möchten Sie ${user.name} wirklich als Mitbearbeiter entfernen?`)) {
        router.delete(destroyCollaborator({ site: props.site.uuid, user: user.id }).url, {
            preserveScroll: true,
        });
    }
};

const removeInvitation = (invitation: SiteInvitation) => {
    if (confirm(`Möchten Sie die Einladung für ${invitation.email} wirklich löschen?`)) {
        router.delete(`/sites/${props.site.uuid}/invitations/${invitation.id}`, {
            preserveScroll: true,
        });
    }
};

const getSslStatusBadge = (status: string | null) => {
    switch (status) {
        case 'valid':
            return { label: 'Gültig', variant: 'success' as const };
        case 'expiring_soon':
            return { label: 'Läuft bald ab', variant: 'warning' as const };
        case 'invalid':
            return { label: 'Ungültig', variant: 'error' as const };
        case 'not_configured':
            return { label: 'Nicht konfiguriert', variant: 'default' as const };
        default:
            return { label: 'Unbekannt', variant: 'default' as const };
    }
};

const primaryDomain = computed(() => {
    return props.site.domains?.find(d => d.is_primary) || props.site.domains?.[0];
});

function domainToPublicUrl(domain: string): string {
    if (typeof window === 'undefined') return '#';
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const base = `${protocol}//${domain}/`;
    if (hostname.endsWith('.test') && !domain.endsWith('.test')) {
        return `${protocol}//${domain}.test/`;
    }
    return base;
}

const sitePublicUrl = computed(() => {
    if (typeof window === 'undefined') return null;
    const primary = primaryDomain.value;
    if (primary?.domain) {
        return domainToPublicUrl(primary.domain);
    }
    return `${window.location.origin}/site/${props.site.slug}`;
});

const addDomain = () => {
    domainForm.post(storeDomain({ site: props.site.uuid }).url, {
        preserveScroll: true,
        onSuccess: () => {
            domainForm.reset();
            addDomainDialogOpen.value = false;
        },
    });
};

const verifyDomainAction = (domain: Domain) => {
    router.post(verifyDomain({ site: props.site.uuid, domain: domain.id }).url, {}, {
        preserveScroll: true,
    });
};

const setPrimaryDomainAction = (domain: Domain) => {
    router.post(setPrimaryDomain({ site: props.site.uuid, domain: domain.id }).url, {}, {
        preserveScroll: true,
    });
};

const removeDomain = (domain: Domain) => {
    if (confirm(`Möchten Sie die Domain ${domain.domain} wirklich entfernen?`)) {
        router.delete(destroyDomain({ site: props.site.uuid, domain: domain.id }).url, {
            preserveScroll: true,
        });
    }
};

const canShowPageDesigner = computed(() => {
    return props.site.has_page_designer && getTemplateEntry(props.site.template?.slug)?.getComponentRegistry != null;
});
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="site.name" />

        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <Heading level="h1">{{ site.name }}</Heading>
                    <Text class="mt-2" muted>
                        Template: {{ site.template?.name ?? '-' }}
                    </Text>
                </div>
                <div class="flex flex-wrap gap-2">
                    <Link :href="sitesEdit({ site: site.uuid }).url">
                        <Button variant="outline">
                            <Edit class="mr-2 h-4 w-4" />
                            Inhalt bearbeiten
                        </Button>
                    </Link>
                    <Link
                        v-if="canShowPageDesigner"
                        :href="sitesDesign({ site: site.uuid }).url"
                    >
                        <Button variant="outline">
                            <Layout class="mr-2 h-4 w-4" />
                            Page Designer
                        </Button>
                    </Link>
                </div>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Site-Informationen</CardTitle>
                        <CardDescription>Slug, Besitzer, Domain</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div>
                            <Text variant="small" muted>Slug</Text>
                            <code class="ml-2 block rounded bg-muted px-2 py-1 text-sm">{{ site.slug }}</code>
                        </div>
                        <div>
                            <Text variant="small" muted>Besitzer</Text>
                            <div class="mt-1 flex items-center gap-2">
                                <Avatar :name="site.user?.name" size="sm" />
                                <Text>{{ site.user?.name }}</Text>
                            </div>
                        </div>
                        <div v-if="primaryDomain">
                            <Text variant="small" muted>Domain</Text>
                            <div class="mt-1 flex flex-wrap items-center gap-2">
                                <Globe class="h-4 w-4 shrink-0 text-muted-foreground" />
                                <a
                                    v-if="sitePublicUrl"
                                    :href="sitePublicUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="font-medium text-primary hover:underline"
                                >
                                    {{ primaryDomain.domain }}
                                </a>
                                <Text v-else>{{ primaryDomain.domain }}</Text>
                                <Badge :variant="primaryDomain.is_verified ? 'success' : 'default'">
                                    {{ primaryDomain.is_verified ? 'Verifiziert' : 'Nicht verifiziert' }}
                                </Badge>
                            </div>
                        </div>
                        <div v-if="primaryDomain?.ssl_status">
                            <Text variant="small" muted>SSL</Text>
                            <div class="mt-1 flex items-center gap-2">
                                <Shield class="h-4 w-4 shrink-0 text-muted-foreground" />
                                <Badge :variant="getSslStatusBadge(primaryDomain.ssl_status).variant">
                                    {{ getSslStatusBadge(primaryDomain.ssl_status).label }}
                                </Badge>
                                <Text v-if="primaryDomain.ssl_expires_at" variant="small" muted>
                                    bis {{ new Date(primaryDomain.ssl_expires_at).toLocaleDateString('de-DE') }}
                                </Text>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Abo & Zahlungsart</CardTitle>
                        <CardDescription>Status und Zahlungsmethode; Rechnungen unter Abrechnung</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div v-if="site.site_subscription">
                            <Text variant="small" muted>Abo-Status</Text>
                            <div class="mt-1 flex flex-wrap items-center gap-2">
                                <Badge
                                    v-if="site.site_subscription.stripe_status === 'active' && !site.site_subscription.cancel_at_period_end"
                                    variant="success"
                                >
                                    Aktiv
                                </Badge>
                                <Badge
                                    v-else-if="site.site_subscription.cancel_at_period_end"
                                    variant="warning"
                                >
                                    Läuft aus
                                </Badge>
                                <Badge v-else variant="secondary">
                                    {{ site.site_subscription.stripe_status }}
                                </Badge>
                                <Text v-if="site.site_subscription.current_period_ends_at" class="text-sm text-muted-foreground">
                                    bis {{ site.site_subscription.current_period_ends_at }}
                                </Text>
                            </div>
                            <div
                                v-if="
                                    site.site_subscription.stripe_status === 'active' &&
                                    !site.site_subscription.cancel_at_period_end
                                "
                                class="mt-2"
                            >
                                <Dialog v-model:open="cancelSubscriptionDialogOpen">
                                    <DialogTrigger as-child>
                                        <Button variant="outline" size="sm" class="text-amber-600 hover:text-amber-700">
                                            Abo kündigen
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Abo kündigen</DialogTitle>
                                            <DialogDescription>
                                                Möchten Sie das Abo für diese Site wirklich zum Periodenende kündigen?
                                                Die Site bleibt bis zum Ende der aktuellen Laufzeit nutzbar.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                :disabled="cancelSubscriptionProcessing"
                                                @click="cancelSubscriptionDialogOpen = false"
                                            >
                                                Abbrechen
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                :disabled="cancelSubscriptionProcessing"
                                                @click="confirmCancelSubscription"
                                            >
                                                {{ cancelSubscriptionProcessing ? 'Wird gekündigt…' : 'Abo kündigen' }}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div v-else>
                            <Text class="text-sm text-muted-foreground">
                                Kein Abo verknüpft{{ site.is_legacy ? ' (Legacy-Site).' : '.' }}
                            </Text>
                        </div>
                        <div>
                            <Text variant="small" muted>Zahlungsart</Text>
                            <p v-if="paymentMethodSummary" class="mt-1 text-sm">{{ paymentMethodSummary.brand }} ****{{ paymentMethodSummary.last4 }}</p>
                            <p v-else class="mt-1 text-sm text-muted-foreground">Keine Zahlungsmethode hinterlegt.</p>
                            <Link :href="billingPortalUrl" class="mt-2 inline-block">
                                <Button variant="outline" size="sm">Zahlungsart & Rechnungen <ExternalLink class="ml-1 h-3 w-3" /></Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Mitbearbeiter</CardTitle>
                    <CardDescription>Nutzer, die diese Site bearbeiten dürfen</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                    <div v-if="!site.collaborators?.length && !site.invitations?.length" class="py-6 text-center">
                        <Text variant="small" muted>Noch keine Mitbearbeiter eingeladen.</Text>
                    </div>
                    <div v-else class="space-y-2">
                        <div
                            v-for="collab in site.collaborators"
                            :key="collab.id"
                            class="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50"
                        >
                            <div class="flex items-center gap-2">
                                <Avatar :name="collab.name" size="sm" />
                                <div>
                                    <Text class="font-medium">{{ collab.name }}</Text>
                                    <Text variant="small" muted>{{ collab.email }}</Text>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                @click="removeCollaborator(collab)"
                            >
                                <X class="h-4 w-4" />
                            </Button>
                        </div>
                        <div
                            v-for="invitation in site.invitations"
                            :key="invitation.id"
                            class="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 p-2 dark:border-amber-800 dark:bg-amber-900/10"
                        >
                            <div class="flex items-center gap-2">
                                <Mail class="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <div>
                                    <Text class="font-medium">{{ invitation.email }}</Text>
                                    <Text variant="small" muted>Einladung ausstehend</Text>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                @click="removeInvitation(invitation)"
                            >
                                <X class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <Dialog v-model:open="inviteDialogOpen">
                        <DialogTrigger as-child>
                            <Button class="mt-4 w-full" variant="outline" size="sm">
                                <UserPlus class="mr-2 h-4 w-4" />
                                Mitbearbeiter einladen
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Mitbearbeiter einladen</DialogTitle>
                                <DialogDescription>
                                    Laden Sie einen Nutzer per E-Mail-Adresse ein, an dieser Site mitzuarbeiten.
                                </DialogDescription>
                            </DialogHeader>
                            <form @submit.prevent="inviteCollaborator" class="space-y-4">
                                <div class="space-y-2">
                                    <Label for="email">E-Mail-Adresse</Label>
                                    <Input
                                        id="email"
                                        v-model="inviteForm.email"
                                        type="email"
                                        placeholder="nutzer@example.com"
                                        required
                                        :aria-invalid="!!inviteForm.errors.email"
                                    />
                                    <InputError :message="inviteForm.errors.email" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="role">Rolle</Label>
                                    <Select id="role" v-model="inviteForm.role" name="role">
                                        <option value="viewer">Viewer (nur ansehen)</option>
                                        <option value="editor">Editor (bearbeiten)</option>
                                        <option value="admin">Admin (vollständiger Zugriff)</option>
                                    </Select>
                                    <InputError :message="inviteForm.errors.role" />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        @click="inviteDialogOpen = false"
                                    >
                                        Abbrechen
                                    </Button>
                                    <Button type="submit" :disabled="inviteForm.processing">
                                        Einladung senden
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div class="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <CardTitle>Domains</CardTitle>
                            <CardDescription>Eigene Domains für diese Site</CardDescription>
                        </div>
                        <Dialog v-model:open="addDomainDialogOpen">
                            <DialogTrigger as-child>
                                <Button size="sm">
                                    <Plus class="mr-2 h-4 w-4" />
                                    Domain hinzufügen
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Domain hinzufügen</DialogTitle>
                                    <DialogDescription>
                                        Fügen Sie eine eigene Domain hinzu, die auf diese Site zeigen soll.
                                    </DialogDescription>
                                </DialogHeader>
                                <form @submit.prevent="addDomain" class="space-y-4">
                                    <div class="space-y-2">
                                        <Label for="domain">Domain</Label>
                                        <Input
                                            id="domain"
                                            v-model="domainForm.domain"
                                            type="text"
                                            placeholder="beispiel.de"
                                            required
                                            :aria-invalid="!!domainForm.errors.domain"
                                        />
                                        <InputError :message="domainForm.errors.domain" />
                                        <Text variant="small" muted>
                                            Geben Sie die Domain ohne http:// oder https:// ein (z.B. beispiel.de)
                                        </Text>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            @click="addDomainDialogOpen = false"
                                        >
                                            Abbrechen
                                        </Button>
                                        <Button type="submit" :disabled="domainForm.processing">
                                            Domain hinzufügen
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div v-if="!site.domains?.length" class="py-8 text-center">
                        <Globe class="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <Text variant="small" muted>Noch keine Domain hinzugefügt.</Text>
                        <Text variant="small" muted class="mt-2 block">Domain hinzufügen, um Ihre eigene Domain mit dieser Site zu verbinden.</Text>
                    </div>
                    <div v-else class="space-y-3">
                        <div
                            v-for="domain in site.domains"
                            :key="domain.id"
                            class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
                        >
                            <div class="flex-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <Globe class="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <a
                                        :href="domainToPublicUrl(domain.domain)"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="font-medium text-primary hover:underline"
                                    >
                                        {{ domain.domain }}
                                    </a>
                                    <Badge v-if="domain.type === 'subdomain'" variant="info">
                                        Subdomain
                                    </Badge>
                                    <Badge v-if="domain.is_primary" variant="success">
                                        Primär
                                    </Badge>
                                    <Badge :variant="domain.is_verified ? 'success' : 'default'">
                                        {{ domain.is_verified ? 'Verifiziert' : 'Nicht verifiziert' }}
                                    </Badge>
                                    <Badge v-if="domain.ssl_status" :variant="getSslStatusBadge(domain.ssl_status).variant">
                                        SSL: {{ getSslStatusBadge(domain.ssl_status).label }}
                                    </Badge>
                                </div>
                                <Text v-if="domain.ssl_expires_at" variant="small" muted class="mt-1 block">
                                    SSL bis {{ new Date(domain.ssl_expires_at).toLocaleDateString('de-DE') }}
                                </Text>
                            </div>
                            <div class="flex gap-2">
                                <Button
                                    v-if="!domain.is_primary"
                                    variant="ghost"
                                    size="sm"
                                    @click="setPrimaryDomainAction(domain)"
                                    title="Als primär setzen"
                                >
                                    <Star class="h-4 w-4" />
                                </Button>
                                <Button
                                    v-if="domain.type !== 'subdomain'"
                                    variant="ghost"
                                    size="sm"
                                    @click="verifyDomainAction(domain)"
                                    title="Verifizieren"
                                >
                                    <RefreshCw class="h-4 w-4" />
                                </Button>
                                <Button
                                    v-if="domain.type !== 'subdomain'"
                                    variant="ghost"
                                    size="sm"
                                    @click="removeDomain(domain)"
                                    title="Entfernen"
                                >
                                    <Trash2 class="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DomainConnectionGuide
                v-if="primaryDomain"
                :domain="primaryDomain.domain"
                :base-domain="baseDomain"
                :is-verified="primaryDomain.is_verified"
            />

            <SiteVersionTimeline
                v-if="site.versions?.length"
                :versions="site.versions"
                :site-uuid="site.uuid"
                :published-version-id="site.published_version_id"
            />
        </div>
    </AppLayout>
</template>
