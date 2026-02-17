<script setup lang="ts">
import { Head, router, useForm, usePage } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Heading, Text } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import InputError from '@/components/InputError.vue';
import { dashboard } from '@/routes';
import domains from '@/routes/domains/index';
import { notify } from '@/composables/useNotify';
import type { BreadcrumbItem } from '@/types';
import {
    Server,
    Globe,
    ShieldCheck,
    ShieldX,
    Pencil,
    Earth,
    User,
    Info,
    Loader2,
    Wand2,
    Plus,
    Trash2,
} from 'lucide-vue-next';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { countriesSortedByName } from '@/lib/countries';

type Domain = {
    id: number;
    domain: string;
    status: string;
    expires_at: string | null;
    auto_renew: boolean;
    nameservers: string[];
    renew_price: number | null;
};

type EasyDnsField = { key: string; label: string; type: string; placeholder?: string; default?: number };
type EasyDnsRecord = {
    name?: string;
    name_key?: string;
    name_template?: string;
    type: string;
    data_key?: string;
    data_template?: string;
};
type EasyDnsPreset = {
    id: string;
    label: string;
    button_label?: string | null;
    fields: EasyDnsField[];
    records: EasyDnsRecord[];
};

type Props = {
    domain: Domain;
    easy_dns_presets?: EasyDnsPreset[];
};

const props = withDefaults(defineProps<Props>(), {
    easy_dns_presets: () => [],
});

const baseUrl = () => `/domains/${props.domain.id}`;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Meine Domains', href: domains.index.url() },
    { title: props.domain.domain, href: '#' },
];

const nameserverDialogOpen = ref(false);
const nameserverForm = useForm({
    nameservers: props.domain.nameservers?.length
        ? [...props.domain.nameservers]
        : ['', ''],
});

const authcodeDialogOpen = ref(false);
const authcodeValue = ref('');
const authcodeLoading = ref(false);
const authcodeError = ref('');

const dnssecDialogOpen = ref(false);
const dnssecLoading = ref(false);
const dnssecError = ref('');
const dnssecData = ref<{ dnssec?: { flags: number; algorithm: number; publicKey: string } } | null>(null);
const dnssecForm = useForm({
    flags: '',
    algorithm: '',
    publicKey: '',
});

const renewDialogOpen = ref(false);

const dnsRecords = ref<{ name: string; type: string; data: string }[]>([]);
const dnsLoading = ref(false);
const dnsError = ref('');
const dnsLoadedOnce = ref(false);
const dnsExpertMode = ref(false);
const dnsSelectedIndices = ref<Set<number>>(new Set());
const dnsSaving = ref(false);
const dnsEditOpen = ref(false);
const dnsForm = useForm({
    records: [] as { name: string; type: string; data: string }[],
});
const easyDnsOpen = ref(false);
const easyDnsPresetValues = ref<Record<string, Record<string, string | number>>>({});

function initEasyDnsPresetValues() {
    const presets = props.easy_dns_presets ?? [];
    for (const p of presets) {
        if (!easyDnsPresetValues.value[p.id]) {
            easyDnsPresetValues.value[p.id] = {};
            for (const f of p.fields) {
                easyDnsPresetValues.value[p.id][f.key] =
                    f.default !== undefined ? f.default : (f.type === 'number' ? 0 : '');
            }
        }
    }
}

function buildRecordsFromPreset(
    preset: EasyDnsPreset,
    values: Record<string, string | number>,
): { name: string; type: string; data: string }[] {
    const out: { name: string; type: string; data: string }[] = [];
    const domainName = props.domain.domain;
    for (const r of preset.records) {
        let name: string;
        if (r.name) {
            name = r.name;
        } else if (r.name_template) {
            name = r.name_template
                .replace(/\{\{subdomain\}\}/g, String(values['subdomain'] ?? ''))
                .replace(/\{\{domain\}\}/g, domainName);
        } else if (r.name_key) {
            name = String(values[r.name_key] ?? '');
        } else {
            name = '@';
        }
        let data = '';
        if (r.data_key) {
            data = String(values[r.data_key] ?? '');
        } else if (r.data_template) {
            data = r.data_template;
            for (const [k, v] of Object.entries(values)) {
                data = data.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
            }
        }
        out.push({ name: name.trim() || '@', type: r.type, data: data.trim() });
    }
    return out;
}

function addEasyDnsFromPreset(presetId: string) {
    const preset = (props.easy_dns_presets ?? []).find((p) => p.id === presetId);
    if (!preset) return;
    const values = easyDnsPresetValues.value[presetId] ?? {};
    const records = buildRecordsFromPreset(preset, values);
    const invalid = records.some((r) => !r.data.trim() || !r.name.trim());
    if (invalid) {
        notify.error('Bitte alle Felder ausfüllen.');
        return;
    }
    const next = [...dnsRecords.value, ...records];
    saveDnsRecords(next);
    easyDnsOpen.value = false;
}

const addRecordOpen = ref(false);
const addRecordType = ref('');
const addRecordName = ref('');
const addRecordData = ref('');
const addRecordMxPriority = ref(10);
const addRecordSrvService = ref('');
const addRecordSrvPriority = ref(0);
const addRecordSrvWeight = ref(0);
const addRecordSrvPort = ref(0);
const addRecordSrvTarget = ref('');
const addRecordCaaFlags = ref('0');
const addRecordCaaTag = ref('issue');
const addRecordCaaValue = ref('');
const addRecordTlsaUsage = ref('0');
const addRecordTlsaSelector = ref('0');
const addRecordTlsaMatching = ref('0');
const addRecordTlsaData = ref('');

const contactLoading = ref(false);
const contactError = ref('');
const contactForm = useForm({
    company: '',
    firstname: '',
    lastname: '',
    street: '',
    number: '',
    postcode: '',
    city: '',
    state: '',
    country: 'DE',
    email: '',
    phone: '',
});
const contactLoadedOnce = ref(false);

const whoisPrivacy = ref({
    organization: false,
    name: false,
    email: false,
    voice: false,
    addressLine: false,
    city: false,
    postalCode: false,
});
const whoisResult = ref('');
const whoisLoading = ref(false);
const whoisNotAvailable = ref(false);
const whoisSaving = ref(false);
const whoisError = ref('');
const contactTabRef = ref<HTMLElement | null>(null);
const activeTab = ref('overview');

const DEFAULT_NAMESERVERS = [
    'nameserver01.eu',
    'nameserver02.eu',
    'nameserver03.eu',
    'nameserver04.eu',
    'nameserver05.eu',
    'nameserver06.eu',
];

watch(
    () => (usePage().props.flash as { error?: string; success?: string })?.error,
    (message) => {
        if (message) notify.error(message);
    },
    { immediate: true },
);
watch(
    () => (usePage().props.flash as { error?: string; success?: string })?.success,
    (message) => {
        if (message) notify.success(message);
    },
    { immediate: true },
);
watch(dnsExpertMode, (isExpert) => {
    if (isExpert) {
        dnsForm.records = dnsRecords.value.map((r) => ({ ...r }));
    }
});
watch(contactTabRef, (el) => {
    if (el && !contactLoadedOnce.value) loadContact();
}, { flush: 'post' });
watch(activeTab, (tab) => {
    if (tab === 'whois') {
        if (!contactLoadedOnce.value) loadContact();
        loadWhoisLookup();
    }
});
watch(
    () => props.easy_dns_presets,
    () => initEasyDnsPresetValues(),
    { immediate: true },
);
watch(easyDnsOpen, (open) => {
    if (open) initEasyDnsPresetValues();
});

function fetchAuthcode() {
    authcodeLoading.value = true;
    authcodeError.value = '';
    authcodeValue.value = '';
    authcodeDialogOpen.value = true;
    fetch(`${baseUrl()}/authcode`)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                authcodeError.value = data.error;
            } else {
                authcodeValue.value = data.authcode ?? '';
            }
        })
        .catch(() => {
            authcodeError.value = 'Fehler beim Laden';
        })
        .finally(() => {
            authcodeLoading.value = false;
        });
}

function renew() {
    renewDialogOpen.value = false;
    router.post(`${baseUrl()}/renew`);
}

function setAutoRenew(enabled: boolean) {
    router.post(`${baseUrl()}/autorenew`, { auto_renew: enabled });
}

function openNameserverDialog() {
    nameserverForm.nameservers =
        props.domain.nameservers?.length ? [...props.domain.nameservers] : ['', ''];
    if (nameserverForm.nameservers.length < 2) {
        while (nameserverForm.nameservers.length < 2) nameserverForm.nameservers.push('');
    }
    nameserverDialogOpen.value = true;
}

function submitNameserver() {
    const ns = nameserverForm.nameservers.filter(Boolean);
    if (ns.length < 2 || ns.length > 6) {
        nameserverForm.setError('nameservers', 'Es sind 2 bis 6 Nameserver erforderlich.');
        return;
    }
    nameserverForm.nameservers = ns;
    nameserverForm.put(`${baseUrl()}/nameserver`, {
        preserveScroll: true,
        onSuccess: () => {
            nameserverDialogOpen.value = false;
        },
    });
}

function resetNameserver() {
    nameserverForm.nameservers = [...DEFAULT_NAMESERVERS];
    nameserverForm.put(`${baseUrl()}/nameserver`, {
        preserveScroll: true,
        onSuccess: () => {
            nameserverDialogOpen.value = false;
        },
    });
}

function addNameserverSlot() {
    if (nameserverForm.nameservers.length < 6) {
        nameserverForm.nameservers.push('');
    }
}

function removeNameserverSlot(index: number) {
    if (nameserverForm.nameservers.length > 2) {
        nameserverForm.nameservers.splice(index, 1);
    }
}

function openDnssecDialog() {
    dnssecDialogOpen.value = true;
    dnssecLoading.value = true;
    dnssecError.value = '';
    dnssecData.value = null;
    dnssecForm.reset();
    fetch(`${baseUrl()}/dnssec`)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                dnssecError.value = data.error;
            } else {
                dnssecData.value = data;
                if (data.dnssec) {
                    dnssecForm.flags = String(data.dnssec.flags);
                    dnssecForm.algorithm = String(data.dnssec.algorithm);
                    dnssecForm.publicKey = data.dnssec.publicKey;
                }
            }
        })
        .catch(() => {
            dnssecError.value = 'Fehler beim Laden';
        })
        .finally(() => {
            dnssecLoading.value = false;
        });
}

function submitDnssec() {
    if (!dnssecForm.flags || !dnssecForm.algorithm || !dnssecForm.publicKey?.trim()) {
        if (!dnssecForm.flags) dnssecForm.setError('flags', 'Bitte Flags wählen.');
        if (!dnssecForm.algorithm) dnssecForm.setError('algorithm', 'Bitte Algorithmus wählen.');
        if (!dnssecForm.publicKey?.trim()) dnssecForm.setError('publicKey', 'Bitte Public Key eingeben.');
        return;
    }
    dnssecForm.post(`${baseUrl()}/dnssec`, {
        preserveScroll: true,
        onSuccess: () => {
            dnssecDialogOpen.value = false;
        },
    });
}

function deleteDnssec() {
    if (!confirm('DNSSEC wirklich deaktivieren?')) return;
    router.delete(`${baseUrl()}/dnssec`, {
        preserveScroll: true,
        onSuccess: () => {
            dnssecDialogOpen.value = false;
        },
    });
}

function loadDnsRecords() {
    dnsLoading.value = true;
    dnsError.value = '';
    fetch(`${baseUrl()}/dns`)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                dnsError.value = data.error;
            } else {
                const records = data.records ?? [];
                dnsRecords.value = records.map(
                    (r: { name: string; type: string; data: string }) => ({
                        name: r.name,
                        type: r.type,
                        data: r.data,
                    }),
                );
                dnsForm.records = dnsRecords.value.map((r) => ({ ...r }));
                dnsLoadedOnce.value = true;
            }
        })
        .catch(() => {
            dnsError.value = 'Fehler beim Laden der DNS-Einträge';
        })
        .finally(() => {
            dnsLoading.value = false;
        });
}

function saveDnsRecords(records: { name: string; type: string; data: string }[]) {
    dnsSaving.value = true;
    router.put(`${baseUrl()}/dns`, { records }, {
        preserveScroll: true,
        onSuccess: () => {
            dnsRecords.value = records.map((r) => ({ ...r }));
            dnsForm.records = dnsRecords.value.map((r) => ({ ...r }));
            notify.success('DNS-Zone gespeichert.');
        },
        onError: () => {
            notify.error('DNS-Zone konnte nicht gespeichert werden.');
        },
        onFinish: () => {
            dnsSaving.value = false;
        },
    });
}

function toggleDnsSelectAll(checked: boolean) {
    if (checked) {
        dnsSelectedIndices.value = new Set(dnsRecords.value.map((_, i) => i));
    } else {
        dnsSelectedIndices.value = new Set();
    }
}

function toggleDnsSelectIndex(index: number, checked: boolean) {
    const next = new Set(dnsSelectedIndices.value);
    if (checked) next.add(index);
    else next.delete(index);
    dnsSelectedIndices.value = next;
}

function deleteSelectedDns() {
    const indices = Array.from(dnsSelectedIndices.value).sort((a, b) => b - a);
    const next = dnsRecords.value.filter((_, i) => !dnsSelectedIndices.value.has(i));
    dnsSelectedIndices.value = new Set();
    saveDnsRecords(next);
}

function deleteSingleDns(index: number) {
    const next = dnsRecords.value.filter((_, i) => i !== index);
    saveDnsRecords(next);
}

function addExpertRow() {
    dnsForm.records.push({ name: '', type: '', data: '' });
}

function saveExpertDns() {
    const records = dnsForm.records
        .map((r) => ({ name: r.name.trim(), type: r.type.trim(), data: r.data.trim() }))
        .filter((r) => r.type !== '' && (r.name !== '' || r.data !== ''));
    saveDnsRecords(records);
    dnsForm.records = records.length ? records.map((r) => ({ ...r })) : [];
}

function openAddRecordModal() {
    addRecordType.value = 'A';
    addRecordName.value = '';
    addRecordData.value = '';
    addRecordMxPriority.value = 10;
    addRecordSrvService.value = '';
    addRecordSrvPriority.value = 0;
    addRecordSrvWeight.value = 0;
    addRecordSrvPort.value = 0;
    addRecordSrvTarget.value = '';
    addRecordCaaFlags.value = '0';
    addRecordCaaTag.value = 'issue';
    addRecordCaaValue.value = '';
    addRecordTlsaUsage.value = '0';
    addRecordTlsaSelector.value = '0';
    addRecordTlsaMatching.value = '0';
    addRecordTlsaData.value = '';
    addRecordOpen.value = true;
}

function buildAddRecordData(): string {
    const type = addRecordType.value;
    if (type === 'A') return addRecordData.value.trim();
    if (type === 'AAAA') return addRecordData.value.trim();
    if (type === 'CNAME' || type === 'ALIAS') return addRecordData.value.trim();
    if (type === 'MX') return `${addRecordMxPriority.value} ${addRecordData.value.trim()}`;
    if (type === 'SRV') {
        const service = addRecordSrvService.value || `_service${addRecordSrvPort.value}._tcp`;
        return `${addRecordSrvPriority.value} ${addRecordSrvWeight.value} ${addRecordSrvPort.value} ${addRecordSrvTarget.value.trim()}`;
    }
    if (type === 'TXT') return addRecordData.value.trim();
    if (type === 'CAA') return `${addRecordCaaFlags.value} ${addRecordCaaTag.value} "${addRecordCaaValue.value.trim()}"`;
    if (type === 'PTR') return addRecordData.value.trim();
    if (type === 'TLSA') return `${addRecordTlsaUsage.value} ${addRecordTlsaSelector.value} ${addRecordTlsaMatching.value} ${addRecordTlsaData.value.trim()}`;
    return addRecordData.value.trim();
}

function submitAddRecord() {
    const type = addRecordType.value;
    const name =
        type === 'SRV' && addRecordSrvService.value
            ? addRecordSrvService.value
            : addRecordName.value.trim() || '@';
    const data = buildAddRecordData();
    if (!data) {
        notify.error('Bitte Inhalt angeben.');
        return;
    }
    const next = [...dnsRecords.value, { name, type, data }];
    saveDnsRecords(next);
    addRecordOpen.value = false;
}

function loadContact() {
    if (contactLoadedOnce.value) return;
    contactLoading.value = true;
    contactError.value = '';
    fetch(`${baseUrl()}/contact`)
        .then((res) => res.json())
            .then((data) => {
            if (data.error) {
                contactError.value = data.error;
            } else {
                const c = data.contact ?? {};
                contactForm.company = c.company ?? '';
                contactForm.firstname = c.firstname ?? '';
                contactForm.lastname = c.lastname ?? '';
                contactForm.street = c.street ?? '';
                contactForm.number = c.number ?? '';
                contactForm.postcode = c.postcode ?? '';
                contactForm.city = c.city ?? '';
                contactForm.state = c.state ?? '';
                contactForm.country = c.country ?? 'DE';
                contactForm.email = c.email ?? '';
                contactForm.phone = c.phone ?? '';
                const pr = data.privacy ?? {};
                whoisPrivacy.value = {
                    organization: !!pr.organization,
                    name: !!pr.name,
                    email: !!pr.email,
                    voice: !!pr.voice,
                    addressLine: !!pr.addressLine,
                    city: !!pr.city,
                    postalCode: !!pr.postalCode,
                };
                contactLoadedOnce.value = true;
            }
        })
        .catch(() => {
            contactError.value = 'Fehler beim Laden';
        })
        .finally(() => {
            contactLoading.value = false;
        });
}

function submitContact() {
    router.put(`${baseUrl()}/contact`, {
        contact: {
            company: contactForm.company,
            firstname: contactForm.firstname,
            lastname: contactForm.lastname,
            street: contactForm.street,
            number: contactForm.number,
            postcode: contactForm.postcode,
            city: contactForm.city,
            state: contactForm.state,
            country: contactForm.country,
            email: contactForm.email,
            phone: contactForm.phone,
        },
    }, { preserveScroll: true });
}

function setWhoisPrivacy(key: keyof typeof whoisPrivacy.value, value: boolean) {
    whoisPrivacy.value[key] = value;
}

function loadWhoisLookup() {
    whoisLoading.value = true;
    whoisResult.value = '';
    whoisNotAvailable.value = false;
    fetch(`${baseUrl()}/whois`, { method: 'GET', headers: { Accept: 'application/json' }, credentials: 'same-origin' })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                whoisResult.value = data.error;
                whoisNotAvailable.value = !data.whois;
            } else {
                whoisResult.value = data.whois ?? '';
            }
        })
        .catch(() => {
            whoisResult.value = 'Whois-Abfrage fehlgeschlagen.';
            whoisNotAvailable.value = true;
        })
        .finally(() => {
            whoisLoading.value = false;
        });
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function submitWhois() {
    whoisSaving.value = true;
    whoisError.value = '';
    fetch(`${baseUrl()}/whois`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({ privacy: whoisPrivacy.value }),
        credentials: 'same-origin',
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                whoisError.value = data.error;
                notify.error(data.error);
            } else {
                notify.success('Whois-Privacy-Einstellungen gespeichert.');
            }
        })
        .catch(() => {
            whoisError.value = 'Fehler beim Speichern';
            notify.error('Fehler beim Speichern');
        })
        .finally(() => {
            whoisSaving.value = false;
        });
}

function submitDns() {
    const records = dnsForm.records
        .map((r) => ({ name: r.name.trim(), type: r.type, data: r.data.trim() }))
        .filter((r) => r.name !== '' || r.data !== '');
    saveDnsRecords(records);
    dnsEditOpen.value = false;
}

const ALGORITHM_OPTIONS = [
    { value: '3', label: '3 - DSA' },
    { value: '5', label: '5 - RSA/SHA-1' },
    { value: '6', label: '6 - DSA-NSEC3-SHA1' },
    { value: '7', label: '7 - RSASHA1-NSEC3-SHA1' },
    { value: '8', label: '8 - RSA/SHA-256' },
    { value: '10', label: '10 - RSA/SHA-512' },
    { value: '12', label: '12 - GOST R 34.10-2001' },
    { value: '13', label: '13 - ECDSA P-256' },
    { value: '14', label: '14 - ECDSA P-384' },
    { value: '15', label: '15 - Ed25519' },
    { value: '16', label: '16 - Ed448' },
    { value: '17', label: '17 - SM2' },
    { value: '23', label: '23 - ECC-GOST' },
];

const zoneInfo = {
    refresh: 10800,
    retry: 3600,
    expire: 604800,
    ttl: 60,
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head :title="`Domain: ${domain.domain}`" />

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <!-- Sidebar -->
            <div class="lg:col-span-1">
                <Card class="rounded-lg p-4">
                    <div class="border-b pb-3 text-center">
                        <div class="mb-3 flex items-center justify-between">
                            <div class="text-left">
                                <Button
                                    v-if="domain.auto_renew"
                                    variant="secondary"
                                    size="sm"
                                    class="h-auto gap-1.5 px-2 py-1 text-xs font-normal"
                                    @click="setAutoRenew(false)"
                                >
                                    <ShieldCheck class="h-3.5 w-3.5" />
                                    Auto. Verlängerung
                                </Button>
                                <Button
                                    v-else
                                    variant="outline"
                                    size="sm"
                                    class="h-auto gap-1.5 border-amber-200 bg-amber-50 px-2 py-1 text-xs font-normal text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
                                    @click="setAutoRenew(true)"
                                >
                                    <ShieldX class="h-3.5 w-3.5" />
                                    Manuelle Verlängerung
                                </Button>
                            </div>
                            <Badge variant="success" class="gap-1">
                                <span class="relative flex h-1.5 w-1.5">
                                    <span
                                        class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75"
                                    />
                                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                                </span>
                                Aktiv
                            </Badge>
                        </div>
                        <div class="flex justify-center text-muted-foreground">
                            <Server class="h-12 w-12" />
                        </div>
                        <Heading level="h5" class="mt-2 flex items-center justify-center gap-1">
                            Domain
                            <Pencil class="h-3.5 w-3.5 text-muted-foreground" />
                        </Heading>
                        <Text class="mt-0.5 text-sm" muted>{{ domain.domain }}</Text>
                    </div>

                    <div class="mt-4 space-y-2">
                        <Button
                            variant="destructive"
                            class="w-full justify-start gap-2"
                            @click="openNameserverDialog"
                        >
                            <Pencil class="h-4 w-4" />
                            Nameserver ändern
                        </Button>
                        <Button
                            variant="default"
                            class="w-full justify-start gap-2"
                            @click="openDnssecDialog"
                        >
                            <ShieldCheck class="h-4 w-4" />
                            DNSSEC verwalten
                        </Button>
                        <Button
                            v-if="domain.renew_price != null"
                            variant="default"
                            class="w-full justify-start gap-2"
                            @click="renewDialogOpen = true"
                        >
                            <span>Verlängern</span>
                        </Button>
                    </div>
                </Card>
            </div>

            <!-- Main content: Tabs -->
            <div class="lg:col-span-3">
                <Tabs v-model="activeTab" default-tab="overview" class="w-full">
                    <TabsList
                        class="mb-4 flex h-auto flex-wrap justify-start gap-1 rounded-lg bg-white p-1"
                    >
                        <TabsTrigger value="overview" class="gap-2 px-3 py-2">
                            <Globe class="h-4 w-4" />
                            <span class="hidden sm:inline">Übersicht</span>
                        </TabsTrigger>
                        <TabsTrigger value="dns" class="gap-2 px-3 py-2">
                            <Earth class="h-4 w-4" />
                            <span class="hidden sm:inline">DNS Manager</span>
                        </TabsTrigger>
                        <TabsTrigger value="contact" class="gap-2 px-3 py-2">
                            <User class="h-4 w-4" />
                            <span class="hidden sm:inline">Kontakt</span>
                        </TabsTrigger>
                        <TabsTrigger value="whois" class="gap-2 px-3 py-2">
                            <Info class="h-4 w-4" />
                            <span class="hidden sm:inline">Whois Privacy</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" class="mt-0">
                        <div class="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informationen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableHead class="w-36 font-medium">Domain</TableHead>
                                                <TableCell>{{ domain.domain }}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">Authcode</TableHead>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        @click="fetchAuthcode"
                                                    >
                                                        Authcode anzeigen
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">Registry Status</TableHead>
                                                <TableCell>
                                                    <Badge variant="success" class="gap-1">
                                                        OK
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">DNS Status</TableHead>
                                                <TableCell>
                                                    <Badge variant="success" class="gap-1">
                                                        Aktiv
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Zonen Informationen</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableHead class="w-36 font-medium">Refresh</TableHead>
                                                <TableCell>{{ zoneInfo.refresh }}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">Retry</TableHead>
                                                <TableCell>{{ zoneInfo.retry }}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">Expire</TableHead>
                                                <TableCell>{{ zoneInfo.expire }}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead class="font-medium">TTL (Time to Live)</TableHead>
                                                <TableCell>{{ zoneInfo.ttl }}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="dns" class="mt-0">
                        <Card>
                            <CardContent class="pt-6">
                                <div class="flex flex-wrap items-center justify-between gap-4">
                                    <Heading level="h5">DNS Manager</Heading>
                                    <div class="flex flex-wrap items-center gap-3">
                                        <Button
                                            variant="default"
                                            size="sm"
                                            @click="easyDnsOpen = true"
                                        >
                                            <Wand2 class="mr-2 h-4 w-4" />
                                            Easy DNS
                                        </Button>
                                        <Button
                                            v-show="dnsSelectedIndices.size > 0"
                                            variant="destructive"
                                            size="sm"
                                            @click="deleteSelectedDns"
                                        >
                                            <Trash2 class="mr-2 h-4 w-4" />
                                            Auswahl löschen
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            @click="openAddRecordModal"
                                        >
                                            <Plus class="mr-2 h-4 w-4" />
                                            Eintrag hinzufügen
                                        </Button>
                                        <div class="flex items-center gap-2">
                                            <span class="text-sm">Easy Mode</span>
                                            <Switch v-model="dnsExpertMode" />
                                            <span class="text-sm">Expert Mode</span>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="!dnsExpertMode" class="mt-4">
                                    <div class="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead class="w-10">
                                                        <Checkbox
                                                            :checked="dnsRecords.length > 0 && dnsSelectedIndices.size === dnsRecords.length"
                                                            :indeterminate="dnsSelectedIndices.size > 0 && dnsSelectedIndices.size < dnsRecords.length"
                                                            @update:checked="toggleDnsSelectAll($event === true)"
                                                        />
                                                    </TableHead>
                                                    <TableHead class="w-16">Typ</TableHead>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Inhalt</TableHead>
                                                    <TableHead class="w-20 text-center">Aktionen</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow v-if="dnsRecords.length === 0 && !dnsLoading">
                                                    <TableCell colspan="5" class="text-center text-muted-foreground">
                                                        Keine DNS Einträge vorhanden
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow
                                                    v-for="(rec, idx) in dnsRecords"
                                                    v-else
                                                    :key="idx"
                                                >
                                                    <TableCell>
                                                        <Checkbox
                                                            :checked="dnsSelectedIndices.has(idx)"
                                                            @update:checked="toggleDnsSelectIndex(idx, $event === true)"
                                                        />
                                                    </TableCell>
                                                    <TableCell class="font-mono text-sm">{{ rec.type }}</TableCell>
                                                    <TableCell>{{ rec.name }}</TableCell>
                                                    <TableCell class="max-w-xs truncate font-mono text-sm">{{ rec.data }}</TableCell>
                                                    <TableCell class="text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            class="h-8 w-8"
                                                            @click="deleteSingleDns(idx)"
                                                        >
                                                            <Trash2 class="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div v-if="dnsLoading" class="flex justify-center py-8">
                                        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                    <div v-if="!dnsLoadedOnce && !dnsLoading" class="mt-4">
                                        <Button variant="outline" @click="loadDnsRecords">
                                            Einträge laden
                                        </Button>
                                    </div>
                                </div>

                                <div v-else class="mt-4">
                                    <div class="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead class="w-24">Typ</TableHead>
                                                    <TableHead>Inhalt</TableHead>
                                                    <TableHead class="w-20">Aktionen</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow
                                                    v-for="(rec, idx) in dnsForm.records"
                                                    :key="idx"
                                                >
                                                    <TableCell>
                                                        <Input
                                                            v-model="dnsForm.records[idx].name"
                                                            class="h-8 text-sm"
                                                            placeholder="Subdomain"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            v-model="dnsForm.records[idx].type"
                                                            class="h-8 text-sm"
                                                        >
                                                            <option value="" disabled>Auswählen...</option>
                                                            <option value="A">A</option>
                                                            <option value="AAAA">AAAA</option>
                                                            <option value="CNAME">CNAME</option>
                                                            <option value="ALIAS">ALIAS</option>
                                                            <option value="MX">MX</option>
                                                            <option value="SRV">SRV</option>
                                                            <option value="TXT">TXT</option>
                                                            <option value="CAA">CAA</option>
                                                            <option value="PTR">PTR</option>
                                                            <option value="TLSA">TLSA</option>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            v-model="dnsForm.records[idx].data"
                                                            class="h-8 text-sm"
                                                            placeholder="Ziel"
                                                        />
                                                    </TableCell>
                                                    <TableCell class="text-center">
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            class="h-8 w-8 p-0"
                                                            @click="dnsForm.records.splice(idx, 1)"
                                                        >
                                                            <Trash2 class="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div class="mt-4 flex gap-2">
                                        <Button
                                            :disabled="dnsSaving"
                                            @click="saveExpertDns"
                                        >
                                            <Loader2 v-if="dnsSaving" class="mr-2 h-4 w-4 animate-spin" />
                                            DNS Zone speichern
                                        </Button>
                                        <Button variant="outline" @click="addExpertRow">
                                            Zeile hinzufügen
                                        </Button>
                                    </div>
                                </div>
                                <Text v-if="dnsError" class="mt-2 text-sm text-destructive">{{ dnsError }}</Text>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" class="mt-0">
                        <div ref="contactTabRef" class="hidden" />
                        <Card>
                            <CardContent class="pt-6">
                                <div class="relative">
                                    <div
                                        v-if="contactLoading"
                                        class="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/80"
                                    >
                                        <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                    <div class="flex justify-between items-center mb-4">
                                        <Heading level="h5">Kontaktdaten</Heading>
                                    </div>
                                    <form class="grid gap-4 md:grid-cols-2" @submit.prevent="submitContact">
                                        <div class="space-y-3">
                                            <Label>Firmenname</Label>
                                            <Input v-model="contactForm.company" placeholder="Muster GmbH" />
                                            <div class="grid grid-cols-3 gap-2">
                                                <div class="col-span-2">
                                                    <Label>Straße <span class="text-destructive">*</span></Label>
                                                    <Input v-model="contactForm.street" placeholder="Musterstraße" required />
                                                </div>
                                                <div>
                                                    <Label>Hausnr. <span class="text-destructive">*</span></Label>
                                                    <Input v-model="contactForm.number" placeholder="1a" required />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Bundesland / Kanton <span class="text-destructive">*</span></Label>
                                                <Input v-model="contactForm.state" placeholder="Musterstaat" required />
                                            </div>
                                            <div>
                                                <Label>E-Mail <span class="text-destructive">*</span></Label>
                                                <Input v-model="contactForm.email" type="email" placeholder="max@mustermann.de" required />
                                            </div>
                                        </div>
                                        <div class="space-y-3">
                                            <div class="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label>Vorname <span class="text-destructive">*</span></Label>
                                                    <Input v-model="contactForm.firstname" placeholder="Vorname" required />
                                                </div>
                                                <div>
                                                    <Label>Nachname <span class="text-destructive">*</span></Label>
                                                    <Input v-model="contactForm.lastname" placeholder="Nachname" required />
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-3 gap-2">
                                                <div>
                                                    <Label>PLZ <span class="text-destructive">*</span></Label>
                                                    <Input v-model="contactForm.postcode" placeholder="12345" required />
                                                </div>
                                                <div class="col-span-2">
                                                    <Label>Ort <span class="text-destructive">*</span></Label>
                                                    <Input v-model="contactForm.city" placeholder="Musterort" required />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Land <span class="text-destructive">*</span></Label>
                                                <Select v-model="contactForm.country" required>
                                                    <option value="" disabled>Land wählen</option>
                                                    <option
                                                        v-for="c in countriesSortedByName"
                                                        :key="c.code"
                                                        :value="c.code"
                                                    >
                                                        {{ c.name }}
                                                    </option>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Telefon <span class="text-destructive">*</span></Label>
                                                <Input v-model="contactForm.phone" placeholder="+49.12345678910" required />
                                            </div>
                                        </div>
                                        <div class="md:col-span-2 flex justify-end">
                                            <Button type="submit">Kontakt ändern</Button>
                                        </div>
                                    </form>
                                    <Text v-if="contactError" class="mt-2 text-sm text-destructive">{{ contactError }}</Text>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="whois" class="mt-0">
                        <div class="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardContent class="pt-6">
                                    <div class="flex justify-between items-center mb-2">
                                        <Heading level="h5">Privacy Einstellungen</Heading>
                                    </div>
                                    <div v-if="whoisError" class="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive mb-3">
                                        {{ whoisError }}
                                    </div>
                                    <div v-if="whoisNotAvailable" class="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                                        Whois Privacy Einstellungen sind für diese Domain nicht verfügbar
                                    </div>
                                    <div v-else class="space-y-3">
                                        <div class="flex items-center justify-between">
                                            <Label class="font-normal">Organisation</Label>
                                            <Switch :checked="whoisPrivacy.organization" @update:checked="setWhoisPrivacy('organization', $event)" />
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <Label class="font-normal">Name</Label>
                                            <Switch :checked="whoisPrivacy.name" @update:checked="setWhoisPrivacy('name', $event)" />
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <Label class="font-normal">E-Mail Adresse</Label>
                                            <Switch :checked="whoisPrivacy.email" @update:checked="setWhoisPrivacy('email', $event)" />
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <Label class="font-normal">Telefonnummer</Label>
                                            <Switch :checked="whoisPrivacy.voice" @update:checked="setWhoisPrivacy('voice', $event)" />
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <Label class="font-normal">Adresse</Label>
                                            <Switch :checked="whoisPrivacy.addressLine" @update:checked="setWhoisPrivacy('addressLine', $event)" />
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <Label class="font-normal">Stadt</Label>
                                            <Switch :checked="whoisPrivacy.city" @update:checked="setWhoisPrivacy('city', $event)" />
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <Label class="font-normal">Postleitzahl</Label>
                                            <Switch :checked="whoisPrivacy.postalCode" @update:checked="setWhoisPrivacy('postalCode', $event)" />
                                        </div>
                                        <div class="flex justify-end pt-4">
                                            <Button :disabled="whoisSaving" @click="submitWhois">
                                                {{ whoisSaving ? 'Speichern…' : 'Einstellungen speichern' }}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent class="pt-6">
                                    <div class="rounded-md bg-muted p-4">
                                        <div v-if="whoisLoading" class="flex justify-center py-8">
                                            <Loader2 class="h-8 w-8 animate-spin" />
                                        </div>
                                        <pre
                                            v-else
                                            class="whitespace-pre-wrap break-words font-mono text-xs max-h-[400px] overflow-y-auto min-h-[200px]"
                                        >{{ whoisResult || 'Whois-Daten werden geladen…' }}</pre>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        <!-- Authcode Modal -->
        <Dialog v-model:open="authcodeDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Authcode abfragen</DialogTitle>
                    <DialogDescription>
                        Der Authcode für die Domain <strong>{{ domain.domain }}</strong> wird beim
                        Transfer beim neuen Anbieter benötigt.
                    </DialogDescription>
                </DialogHeader>
                <div
                    v-if="authcodeLoading"
                    class="flex justify-center py-6 text-muted-foreground"
                >
                    <Loader2 class="h-8 w-8 animate-spin" />
                </div>
                <div v-else-if="authcodeError" class="py-4 text-destructive">
                    {{ authcodeError }}
                </div>
                <div v-else class="rounded-md bg-muted p-3 font-mono text-sm break-all">
                    {{ authcodeValue || '–' }}
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="authcodeDialogOpen = false">
                        Schließen
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Nameserver Modal -->
        <Dialog v-model:open="nameserverDialogOpen">
            <DialogContent class="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Nameserver ändern</DialogTitle>
                    <DialogDescription>
                        Zwischen 2 und 6 Nameserver eintragen.
                    </DialogDescription>
                </DialogHeader>
                <form @submit.prevent="submitNameserver" class="space-y-4 py-4">
                    <div
                        v-for="(ns, idx) in nameserverForm.nameservers"
                        :key="idx"
                        class="flex gap-2 items-center"
                    >
                        <Input
                            v-model="nameserverForm.nameservers[idx]"
                            :placeholder="`Nameserver ${idx + 1}`"
                            class="flex-1"
                        />
                        <Button
                            v-if="nameserverForm.nameservers.length > 2"
                            type="button"
                            variant="ghost"
                            size="icon"
                            @click="removeNameserverSlot(idx)"
                        >
                            ×
                        </Button>
                    </div>
                    <Button
                        v-if="nameserverForm.nameservers.length < 6"
                        type="button"
                        variant="outline"
                        size="sm"
                        @click="addNameserverSlot"
                    >
                        + Nameserver
                    </Button>
                    <InputError :message="nameserverForm.errors.nameservers" />
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            :disabled="nameserverForm.processing"
                            @click="resetNameserver"
                        >
                            Nameserver zurücksetzen
                        </Button>
                        <Button
                            type="submit"
                            :disabled="nameserverForm.processing"
                        >
                            Änderungen übernehmen
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <!-- DNSSEC Modal -->
        <Dialog v-model:open="dnssecDialogOpen">
            <DialogContent class="max-w-lg">
                <DialogHeader>
                    <DialogTitle>DNSSEC verwalten</DialogTitle>
                    <DialogDescription>
                        DNSSEC-Daten anzeigen oder neue Schlüssel hinzufügen.
                    </DialogDescription>
                </DialogHeader>
                <div
                    v-if="dnssecLoading"
                    class="flex justify-center py-8 text-muted-foreground"
                >
                    <Loader2 class="h-8 w-8 animate-spin" />
                </div>
                <div v-else-if="dnssecError" class="py-4 text-destructive">
                    {{ dnssecError }}
                </div>
                <div v-else-if="dnssecData?.dnssec" class="space-y-4 py-4">
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div class="space-y-2">
                            <Label>Flags</Label>
                            <Input :model-value="String(dnssecData.dnssec.flags)" disabled />
                        </div>
                        <div class="space-y-2">
                            <Label>Algorithmus</Label>
                            <Input :model-value="String(dnssecData.dnssec.algorithm)" disabled />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label>Public Key</Label>
                        <textarea
                            :value="dnssecData.dnssec.publicKey"
                            class="flex min-h-[80px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
                            rows="3"
                            readonly
                        />
                    </div>
                    <Button variant="destructive" @click="deleteDnssec">
                        DNSSEC deaktivieren
                    </Button>
                </div>
                <div v-else class="space-y-4 py-4">
                    <form @submit.prevent="submitDnssec" class="space-y-4">
                        <div class="space-y-2">
                            <Label>Flags</Label>
                            <select
                                v-model="dnssecForm.flags"
                                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            >
                                <option value="">Bitte wählen …</option>
                                <option value="256">256 (ZSK)</option>
                                <option value="257">257 (KSK)</option>
                            </select>
                            <InputError :message="dnssecForm.errors.flags" />
                        </div>
                        <div class="space-y-2">
                            <Label>Algorithmus</Label>
                            <select
                                v-model="dnssecForm.algorithm"
                                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                            >
                                <option value="">Bitte wählen …</option>
                                <option
                                    v-for="opt in ALGORITHM_OPTIONS"
                                    :key="opt.value"
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </select>
                            <InputError :message="dnssecForm.errors.algorithm" />
                        </div>
                        <div class="space-y-2">
                            <Label>Public Key</Label>
                            <textarea
                                v-model="dnssecForm.publicKey"
                                class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                                placeholder="Public Key eingeben …"
                                rows="3"
                            />
                            <InputError :message="dnssecForm.errors.publicKey" />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                @click="dnssecDialogOpen = false"
                            >
                                Abbrechen
                            </Button>
                            <Button type="submit" :disabled="dnssecForm.processing">
                                DNSSEC aktivieren
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>

        <!-- Renew Modal -->
        <Dialog v-model:open="renewDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Produkt Verlängerung</DialogTitle>
                    <DialogDescription>
                        Verlängere dein Produkt für
                        <strong>{{ domain.renew_price }} €</strong> pro Jahr.
                    </DialogDescription>
                </DialogHeader>
                <div class="flex flex-col items-center gap-4 py-4">
                    <div
                        class="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
                    >
                        <Globe class="h-10 w-10 text-primary" />
                    </div>
                    <Button class="w-full" @click="renew">
                        Kostenpflichtig verlängern
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <!-- Easy DNS Modal -->
        <Dialog v-model:open="easyDnsOpen">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Easy DNS</DialogTitle>
                </DialogHeader>
                <div class="space-y-3">
                    <Card
                        v-for="preset in (easy_dns_presets ?? [])"
                        :key="preset.id"
                        class="bg-muted/50"
                    >
                        <CardContent class="pt-4">
                            <Heading level="h6" class="mb-2">{{ preset.label }}</Heading>
                            <div class="mb-2 space-y-2">
                                <template v-for="field in preset.fields" :key="field.key">
                                    <div v-if="field.type === 'number'" class="flex gap-2">
                                        <Label class="sr-only">{{ field.label }}</Label>
                                        <Input
                                            v-model.number="easyDnsPresetValues[preset.id][field.key]"
                                            type="number"
                                            :placeholder="field.placeholder"
                                            class="w-24"
                                        />
                                    </div>
                                    <div v-else>
                                        <Label class="sr-only">{{ field.label }}</Label>
                                        <Input
                                            v-model="easyDnsPresetValues[preset.id][field.key]"
                                            :placeholder="field.placeholder"
                                            class="w-full"
                                        />
                                    </div>
                                </template>
                            </div>
                            <Button
                                size="sm"
                                class="w-full"
                                @click="addEasyDnsFromPreset(preset.id)"
                            >
                                {{ preset.button_label || `${domain.domain} – Eintrag erstellen` }}
                            </Button>
                        </CardContent>
                    </Card>
                    <p v-if="!(easy_dns_presets ?? []).length" class="text-sm text-muted-foreground">
                        Keine Easy-DNS-Vorlagen konfiguriert. Presets in
                        <code class="rounded bg-muted px-1">config/domain-easy-dns.php</code> anlegen.
                    </p>
                </div>
            </DialogContent>
        </Dialog>

        <!-- Add Record Modal -->
        <Dialog v-model:open="addRecordOpen">
            <DialogContent class="max-w-lg">
                <DialogHeader>
                    <DialogTitle>DNS Eintrag hinzufügen</DialogTitle>
                </DialogHeader>
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Typ</Label>
                            <Select v-model="addRecordType">
                                <option value="" disabled>Typ wählen</option>
                                <option value="A">A - IPv4</option>
                                <option value="AAAA">AAAA - IPv6</option>
                                <option value="CNAME">CNAME - Weiterleitung</option>
                                <option value="ALIAS">ALIAS</option>
                                <option value="MX">MX - E-Mail</option>
                                <option value="SRV">SRV</option>
                                <option value="TXT">TXT</option>
                                <option value="CAA">CAA</option>
                                <option value="PTR">PTR</option>
                                <option value="TLSA">TLSA</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Name</Label>
                            <Input v-model="addRecordName" placeholder="@ oder www" />
                        </div>
                    </div>
                    <div v-if="['A','AAAA','CNAME','ALIAS','PTR'].includes(addRecordType)">
                        <Label>Inhalt</Label>
                        <Input v-model="addRecordData" :placeholder="addRecordType === 'A' ? 'z.B. 127.0.0.1' : addRecordType === 'AAAA' ? 'z.B. ::1' : 'Ziel'" />
                    </div>
                    <div v-if="addRecordType === 'MX'" class="space-y-2">
                        <Label>Mail Server</Label>
                        <div class="flex gap-2">
                            <Input v-model="addRecordData" placeholder="mail.example.com" class="flex-1" />
                            <Input v-model.number="addRecordMxPriority" type="number" min="0" max="65535" class="w-24" />
                        </div>
                    </div>
                    <div v-if="addRecordType === 'SRV'" class="space-y-2">
                        <Label>Service</Label>
                        <Select v-model="addRecordSrvService">
                            <option value="">Service (manuell)</option>
                        </Select>
                        <div class="grid grid-cols-3 gap-2">
                            <Input v-model.number="addRecordSrvPriority" type="number" placeholder="Priorität" />
                            <Input v-model.number="addRecordSrvWeight" type="number" placeholder="Gewicht" />
                            <Input v-model.number="addRecordSrvPort" type="number" placeholder="Port" />
                        </div>
                        <Input v-model="addRecordSrvTarget" placeholder="Ziel (server.example.com)" />
                    </div>
                    <div v-if="addRecordType === 'TXT'">
                        <Label>Inhalt</Label>
                        <Textarea v-model="addRecordData" rows="3" placeholder="v=spf1 ..." />
                    </div>
                    <div v-if="addRecordType === 'CAA'" class="grid grid-cols-3 gap-2">
                        <div>
                            <Label>Flags</Label>
                            <Select v-model="addRecordCaaFlags">
                                <option value="0">0 - Nicht kritisch</option>
                                <option value="128">128 - Kritisch</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Tag</Label>
                            <Select v-model="addRecordCaaTag">
                                <option value="issue">issue</option>
                                <option value="issuewild">issuewild</option>
                                <option value="iodef">iodef</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Wert</Label>
                            <Input v-model="addRecordCaaValue" placeholder="letsencrypt.org" />
                        </div>
                    </div>
                    <div v-if="addRecordType === 'TLSA'" class="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Usage</Label>
                            <Select v-model="addRecordTlsaUsage">
                                <option value="0">0 - PKIX-TA</option>
                                <option value="1">1 - PKIX-EE</option>
                                <option value="2">2 - DANE-TA</option>
                                <option value="3">3 - DANE-EE</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Selector</Label>
                            <Select v-model="addRecordTlsaSelector">
                                <option value="0">0 - Cert</option>
                                <option value="1">1 - SPKI</option>
                            </Select>
                        </div>
                        <div>
                            <Label>Matching</Label>
                            <Select v-model="addRecordTlsaMatching">
                                <option value="0">0 - Full</option>
                                <option value="1">1 - SHA-256</option>
                                <option value="2">2 - SHA-512</option>
                            </Select>
                        </div>
                        <div class="col-span-2">
                            <Label>Daten</Label>
                            <Input v-model="addRecordTlsaData" placeholder="Hex String" />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button @click="submitAddRecord">DNS Eintrag hinzufügen</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- DNS Edit Modal (Expert full edit) -->
        <Dialog v-model:open="dnsEditOpen">
            <DialogContent class="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle>DNS-Zone bearbeiten</DialogTitle>
                    <DialogDescription>
                        Einträge anpassen und speichern. Alle Records werden ersetzt.
                    </DialogDescription>
                </DialogHeader>
                <form
                    @submit.prevent="submitDns"
                    class="flex min-h-0 flex-1 flex-col space-y-4 overflow-auto py-4"
                >
                    <div
                        v-for="(rec, idx) in dnsForm.records"
                        :key="idx"
                        class="grid grid-cols-12 items-center gap-2"
                    >
                        <Input
                            v-model="dnsForm.records[idx].name"
                            placeholder="Name"
                            class="col-span-4"
                        />
                        <Input
                            v-model="dnsForm.records[idx].type"
                            placeholder="Typ (A, AAAA, MX, …)"
                            class="col-span-2"
                        />
                        <Input
                            v-model="dnsForm.records[idx].data"
                            placeholder="Daten"
                            class="col-span-5"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            class="col-span-1"
                            @click="dnsForm.records.splice(idx, 1)"
                        >
                            ×
                        </Button>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        @click="dnsForm.records.push({ name: '', type: 'A', data: '' })"
                    >
                        + Eintrag
                    </Button>
                    <DialogFooter>
                        <Button type="button" variant="outline" @click="dnsEditOpen = false">
                            Abbrechen
                        </Button>
                        <Button type="submit" :disabled="dnsForm.processing">
                            Speichern
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
