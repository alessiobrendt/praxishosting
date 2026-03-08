<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, ChevronDown, Download } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Heading, Text } from '@/components/ui/typography';
import AdminLayout from '@/layouts/AdminLayout.vue';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Props = {
    apiBaseUrl: string;
};

const props = defineProps<Props>();

function buildMarkdownDocumentation(apiBaseUrl: string): string {
    const lines: string[] = [
        '# API v1 – Dokumentation',
        '',
        `**Basis-URL:** \`${apiBaseUrl}\``,
        '',
        '---',
        '',
        '## Authentifizierung',
        '',
        'Jede Anfrage muss den Header senden:',
        '',
        '```',
        'Authorization: Bearer <Ihr-API-Token>',
        '```',
        '',
        'Optional für Multi-Brand: Header `X-Brand-Id: <id>` oder Query-Parameter `brand_id=<id>`.',
        '',
        '---',
        '',
        '## Endpoints',
        '',
    ];

    for (const ep of endpoints) {
        lines.push(`### ${ep.method} ${ep.path}`);
        lines.push('');
        lines.push(`**${ep.summary}**`);
        lines.push('');
        lines.push(ep.description);
        lines.push('');

        if (ep.parameters && ep.parameters.length > 0) {
            lines.push('| Name | In | Typ | Pflicht | Beschreibung |');
            lines.push('|------|-----|-----|---------|--------------|');
            for (const p of ep.parameters) {
                lines.push(`| \`${p.name}\` | ${p.in} | ${p.type} | ${p.required ? 'Ja' : 'Nein'} | ${p.description} |`);
            }
            lines.push('');
        }

        if (ep.requestBody) {
            lines.push('**Request Body (Schema):**');
            lines.push('');
            lines.push('```json');
            lines.push(ep.requestBody.schema);
            lines.push('```');
            lines.push('');
            lines.push('**Beispiel:**');
            lines.push('');
            lines.push('```json');
            lines.push(ep.requestBody.example);
            lines.push('```');
            lines.push('');
        }

        lines.push('**Response (200 OK):**');
        lines.push('');
        lines.push('```json');
        lines.push(ep.responseExample);
        lines.push('```');
        lines.push('');
        lines.push('---');
        lines.push('');
    }

    return lines.join('\n');
}

function downloadMarkdown(): void {
    const md = buildMarkdownDocumentation(props.apiBaseUrl);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-dokumentation-v1.md';
    a.click();
    URL.revokeObjectURL(url);
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Admin', href: '/admin' },
    { title: 'API', href: '/admin/api' },
    { title: 'Dokumentation', href: '#' },
];

type Param = {
    name: string;
    in: 'query' | 'body';
    type: string;
    required: boolean;
    description: string;
};

type EndpointSpec = {
    method: string;
    path: string;
    summary: string;
    description: string;
    parameters?: Param[];
    requestBody?: { schema: string; example: string };
    responseExample: string;
};

const endpoints: EndpointSpec[] = [
    {
        method: 'GET',
        path: '/stats',
        summary: 'Unternehmens-Statistiken',
        description:
            'Aggregierte Kennzahlen für die Landing-Page (Kunden, Webspace-, Game-Server-, Domains-Anzahl). Keine sensiblen Finanzdaten.',
        parameters: [
            {
                name: 'brand_id',
                in: 'query',
                type: 'integer',
                required: false,
                description: 'Brand-ID (optional, sonst aus Host/Header)',
            },
        ],
        responseExample: `{
  "data": {
    "customers_count": 1250,
    "webspace_accounts_count": 890,
    "game_server_accounts_count": 320,
    "domains_count": 2100
  }
}`,
    },
    {
        method: 'GET',
        path: '/domains/tlds',
        summary: 'TLDs mit Preisen',
        description:
            'Angebotene TLDs mit Create-, Renew-, Transfer-, Restore- und Verkaufspreisen. Paginiert (15 pro Seite). Zuerst werden .de, .net, .com, .eu, .at, .ch angezeigt, danach alle weiteren alphabetisch.',
        parameters: [
            {
                name: 'page',
                in: 'query',
                type: 'integer',
                required: false,
                description: 'Seitennummer (Standard: 1)',
            },
        ],
        responseExample: `{
  "data": [
    {
      "tld": "de",
      "create_price": 5.00,
      "renew_price": 5.00,
      "transfer_price": 5.00,
      "restore_price": 10.00,
      "sale_price": 6.00
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 15,
    "total": 42,
    "from": 1,
    "to": 15
  },
  "links": {
    "first": "https://.../api/v1/domains/tlds?page=1",
    "last": "https://.../api/v1/domains/tlds?page=3",
    "prev": null,
    "next": "https://.../api/v1/domains/tlds?page=2"
  }
}`,
    },
    {
        method: 'POST',
        path: '/domains/check-availability',
        summary: 'Domain-Verfügbarkeit prüfen',
        description:
            'Prüft die Verfügbarkeit einer Domain. Eingabe: nur Name (z. B. "beispiel") oder Name mit Endung (z. B. "beispiel.de"). Bei Angabe mit Endung wird diese Domain zuerst ausgegeben (searched_domain), danach die Prioritäts-TLDs .de, .net, .com, .eu, .at, .ch, dann weitere Endungen paginiert (5 pro Seite, Parameter page).',
        parameters: [
            {
                name: 'domain',
                in: 'body',
                type: 'string',
                required: true,
                description: 'Domain-Name mit oder ohne TLD (z. B. "beispiel" oder "beispiel.de")',
            },
            {
                name: 'page',
                in: 'body',
                type: 'integer',
                required: false,
                description: 'Seite für weitere TLDs (Standard: 1, 5 pro Seite)',
            },
        ],
        requestBody: {
            schema: '{ "domain": "string", "page": 1 }',
            example: `{
  "domain": "beispiel.de"
}`,
        },
        responseExample: `{
  "data": {
    "searched_domain": {
      "domain": "beispiel.de",
      "available": true,
      "premium": false,
      "sale_price": 6.00,
      "purchase_price": 5.00
    },
    "priority": [
      { "domain": "beispiel.de", "available": true, "premium": false, "sale_price": 6.00, "purchase_price": 5.00 },
      { "domain": "beispiel.net", "available": false, "premium": false, "sale_price": 8.00, "purchase_price": 7.00 }
    ],
    "other": {
      "data": [
        { "domain": "beispiel.io", "available": true, "premium": false, "sale_price": 35.00, "purchase_price": 30.00 }
      ],
      "meta": { "current_page": 1, "last_page": 3, "per_page": 5, "total": 12, "from": 1, "to": 5 },
      "links": { "first": "...", "last": "...", "prev": null, "next": "..." }
    }
  }
}`,
    },
    {
        method: 'GET',
        path: '/hosting-plans',
        summary: 'Hosting-Pläne (Konfigurator)',
        description:
            'Alle aktiven Hosting-Pläne inkl. Konfiguration für Webspace (Plesk), Gaming (Pterodactyl) und TeamSpeak-Server. Bei type=webspace/gaming/teamspeak werden nur Pläne des jeweiligen panel_type zurückgegeben.',
        parameters: [
            {
                name: 'type',
                in: 'query',
                type: 'string',
                required: false,
                description: 'Filter: "webspace" | "gaming" | "teamspeak" | "all" (Standard: "all")',
            },
            {
                name: 'brand_id',
                in: 'query',
                type: 'integer',
                required: false,
                description: 'Brand-ID (optional)',
            },
        ],
        responseExample: `{
  "data": [
    {
      "id": 1,
      "name": "Webspace Start",
      "price": "4.99",
      "panel_type": "plesk",
      "disk_gb": 10,
      "traffic_gb": 100,
      "domains": 1,
      "subdomains": 5,
      "mailboxes": 1,
      "databases": 1,
      "config": { "plan_options": [] }
    },
    {
      "id": 2,
      "name": "TeamSpeak Small",
      "price": "9.99",
      "panel_type": "teamspeak",
      "config": { "plan_options": [] }
    }
  ]
}`,
    },
    {
        method: 'GET',
        path: '/gameserver-cloud-plans',
        summary: 'Gameserver-Cloud-Pläne',
        description:
            'Alle aktiven Gameserver-Cloud-Pläne für die Landing-Page bzw. den Konfigurator. Enthält id, name, price und config (inkl. plan_options).',
        parameters: [
            {
                name: 'brand_id',
                in: 'query',
                type: 'integer',
                required: false,
                description: 'Brand-ID (optional, sonst X-Brand-Id oder Default-Brand)',
            },
        ],
        responseExample: `{
  "data": [
    {
      "id": 1,
      "name": "Cloud Gaming S",
      "price": "14.99",
      "config": { "plan_options": [] }
    }
  ]
}`,
    },
    {
        method: 'GET',
        path: '/hosting-servers',
        summary: 'Hosting-Server (Liste)',
        description:
            'Liste aller Hosting-Server mit Details und API-Status. Keine sensiblen Daten (kein API-Token, keine IP, kein Config).',
        parameters: [
            {
                name: 'brand_id',
                in: 'query',
                type: 'integer',
                required: false,
                description: 'Brand-ID (optional)',
            },
        ],
        responseExample: `{
  "data": [
    {
      "id": 1,
      "name": "Plesk Server 1",
      "hostname": "plesk.example.com",
      "panel_type": "plesk",
      "port": 8443,
      "use_ssl": true,
      "is_active": true,
      "api_status": {
        "checked_at": "2025-03-05T12:00:00.000000Z",
        "status": "ok",
        "message": "Verbindung erfolgreich"
      },
      "webspace_accounts_count": 42,
      "game_server_accounts_count": 0
    }
  ]
}`,
    },
    {
        method: 'GET',
        path: '/hosting-servers/{id}',
        summary: 'Hosting-Server (Details)',
        description:
            'Einzelner Hosting-Server inkl. API-Status. Bei Pterodactyl zusätzlich Nodes-Übersicht (Speicher/Disk). Keine sensiblen Daten.',
        parameters: [
            {
                name: 'id',
                in: 'path',
                type: 'integer',
                required: true,
                description: 'ID des Hosting-Servers',
            },
        ],
        responseExample: `{
  "data": {
    "id": 2,
    "name": "Pterodactyl Panel",
    "hostname": "panel.example.com",
    "panel_type": "pterodactyl",
    "port": 443,
    "use_ssl": true,
    "is_active": true,
    "api_status": {
      "checked_at": "2025-03-05T12:00:00.000000Z",
      "status": "ok",
      "message": "Verbindung erfolgreich"
    },
    "webspace_accounts_count": 0,
    "game_server_accounts_count": 15,
    "nodes": [
      {
        "id": 1,
        "name": "Node 1",
        "fqdn": "node1.example.com",
        "memory_total_mb": 16384,
        "disk_total_mb": 512000,
        "memory_allocated_mb": 8192,
        "disk_allocated_mb": 256000,
        "maintenance_mode": false
      }
    ]
  }
}`,
    },
    {
        method: 'GET',
        path: '/pterodactyl/nests',
        summary: 'Pterodactyl Nests',
        description: 'Nests für einen Pterodactyl-Hosting-Plan (z. B. für Konfigurator-Dropdown).',
        parameters: [
            {
                name: 'hosting_plan_id',
                in: 'query',
                type: 'integer',
                required: true,
                description: 'ID des Pterodactyl-Hosting-Plans',
            },
        ],
        responseExample: `{
  "data": {
    "nests": [
      { "id": 1, "name": "Minecraft" },
      { "id": 2, "name": "Source Engine" }
    ]
  }
}`,
    },
    {
        method: 'GET',
        path: '/pterodactyl/eggs',
        summary: 'Pterodactyl Eggs',
        description: 'Eggs zu einem Nest (z. B. für Konfigurator-Dropdown).',
        parameters: [
            {
                name: 'hosting_plan_id',
                in: 'query',
                type: 'integer',
                required: true,
                description: 'ID des Hosting-Plans',
            },
            {
                name: 'nest_id',
                in: 'query',
                type: 'integer',
                required: true,
                description: 'ID des Nests',
            },
        ],
        responseExample: `{
  "data": {
    "eggs": [
      { "id": 1, "name": "Paper" },
      { "id": 2, "name": "Vanilla" }
    ]
  }
}`,
    },
    {
        method: 'GET',
        path: '/brand',
        summary: 'Brand / Unternehmen',
        description: 'Öffentliche Brand-Infos (Name, Logo, Features, SEO) für die Landing-Page.',
        parameters: [
            {
                name: 'brand_id',
                in: 'query',
                type: 'integer',
                required: false,
                description: 'Brand-ID (optional)',
            },
        ],
        responseExample: `{
  "data": {
    "id": 1,
    "name": "PraxisHosting",
    "key": "default",
    "logo_url": "https://...",
    "logo_collapsed_url": null,
    "features": { "webspace": true, "gaming": true, "domains_shop": true },
    "seo": { "meta_description": "...", "og_title": "...", "og_image": null }
  }
}`,
    },
    {
        method: 'GET',
        path: '/brand/features',
        summary: 'Feature-Flags',
        description: 'Feature-Flags der Brand (welche Produktbereiche sichtbar sind).',
        parameters: [],
        responseExample: `{
  "data": {
    "sites_editor": true,
    "webspace": true,
    "domains_shop": true,
    "gaming": true,
    "prepaid_balance": false
  }
}`,
    },
    {
        method: 'GET',
        path: '/brand/contact',
        summary: 'Kontaktdaten',
        description: 'Support-URL und E-Mail für die Kontakt-Sektion.',
        parameters: [],
        responseExample: `{
  "data": {
    "support_url": "https://...",
    "support_email": "support@example.com"
  }
}`,
    },
];

function methodClass(method: string): string {
    switch (method) {
        case 'GET':
            return 'bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
        case 'POST':
            return 'bg-blue-600/20 text-blue-700 dark:text-blue-400 border-blue-500/30';
        case 'PUT':
        case 'PATCH':
            return 'bg-amber-600/20 text-amber-700 dark:text-amber-400 border-amber-500/30';
        case 'DELETE':
            return 'bg-red-600/20 text-red-700 dark:text-red-400 border-red-500/30';
        default:
            return 'bg-muted text-muted-foreground';
    }
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="API-Dokumentation" />

        <div class="space-y-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Heading level="h1">API v1 – Dokumentation</Heading>
                    <Text class="mt-2" muted>
                        Basis-URL:
                        <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{{
                            apiBaseUrl
                        }}</code>
                    </Text>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        @click="downloadMarkdown"
                    >
                        <Download class="mr-2 h-4 w-4" aria-hidden="true" />
                        Als Markdown
                    </Button>
                    <Link href="/admin/api">
                        <Button variant="outline" size="sm">
                            <ArrowLeft class="mr-2 h-4 w-4" aria-hidden="true" />
                            Zurück zur API-Übersicht
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Authentifizierung</CardTitle>
                    <CardDescription>
                        Jede Anfrage muss den Authorization-Header mit einem gültigen Bearer-Token senden.
                        Optional: <code class="rounded bg-muted px-1 py-0.5">X-Brand-Id: &lt;id&gt;</code> oder
                        Query <code class="rounded bg-muted px-1 py-0.5">brand_id=&lt;id&gt;</code> für Multi-Brand.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <pre
                        class="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm"
                    ><code>Authorization: Bearer &lt;Ihr-API-Token&gt;</code></pre>
                </CardContent>
            </Card>

            <div class="space-y-2">
                <Heading level="h2">Endpoints</Heading>
                <Text class="text-muted-foreground">
                    Klicken Sie auf einen Endpoint, um Parameter, Request-Body und Response-Beispiele zu sehen.
                </Text>
            </div>

            <div class="space-y-2">
                <Collapsible
                    v-for="ep in endpoints"
                    :key="ep.path"
                    class="group rounded-lg border border-border bg-card"
                >
                    <CollapsibleTrigger
                        as-child
                        class="block w-full rounded-lg text-left transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <div
                            class="flex w-full cursor-pointer items-center gap-3 px-4 py-3"
                        >
                            <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                                <span
                                    :class="[
                                        'inline-flex shrink-0 items-center rounded border px-2 py-0.5 font-mono text-xs font-semibold',
                                        methodClass(ep.method),
                                    ]"
                                >
                                    {{ ep.method }}
                                </span>
                                <code
                                    class="min-w-0 truncate rounded bg-muted px-2 py-0.5 font-mono text-sm"
                                >{{ apiBaseUrl }}{{ ep.path }}</code>
                                <span class="text-sm font-medium text-foreground">{{ ep.summary }}</span>
                            </div>
                            <span
                                class="ml-auto flex shrink-0 items-center pr-2"
                            >
                                <ChevronDown
                                    class="h-5 w-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                                    aria-hidden="true"
                                />
                            </span>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div class="border-t border-border px-4 pb-4 pt-3">
                            <p class="mb-4 text-sm text-muted-foreground">{{ ep.description }}</p>

                            <!-- Parameters -->
                            <template v-if="ep.parameters && ep.parameters.length > 0">
                                <h4 class="mb-2 text-sm font-semibold text-foreground">Parameter</h4>
                                <div class="mb-4 overflow-x-auto rounded-md border border-border">
                                    <table class="w-full min-w-[400px] text-sm">
                                        <thead>
                                            <tr class="border-b border-border bg-muted/50">
                                                <th class="px-3 py-2 text-left font-medium">Name</th>
                                                <th class="px-3 py-2 text-left font-medium">In</th>
                                                <th class="px-3 py-2 text-left font-medium">Typ</th>
                                                <th class="px-3 py-2 text-left font-medium">Pflicht</th>
                                                <th class="px-3 py-2 text-left font-medium">Beschreibung</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="p in ep.parameters"
                                                :key="p.name"
                                                class="border-b border-border last:border-0"
                                            >
                                                <td class="px-3 py-2 font-mono text-xs">{{ p.name }}</td>
                                                <td class="px-3 py-2 text-muted-foreground">{{ p.in }}</td>
                                                <td class="px-3 py-2 font-mono text-xs">{{ p.type }}</td>
                                                <td class="px-3 py-2">{{ p.required ? 'Ja' : 'Nein' }}</td>
                                                <td class="px-3 py-2 text-muted-foreground">{{ p.description }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </template>

                            <!-- Request Body (POST etc.) -->
                            <template v-if="ep.requestBody">
                                <h4 class="mb-2 text-sm font-semibold text-foreground">Request Body</h4>
                                <p class="mb-1 text-xs text-muted-foreground">Schema (JSON)</p>
                                <pre
                                    class="mb-3 overflow-x-auto rounded-md border border-border bg-muted/50 p-3 font-mono text-xs"
                                ><code>{{ ep.requestBody.schema }}</code></pre>
                                <p class="mb-1 text-xs text-muted-foreground">Beispiel</p>
                                <pre
                                    class="mb-4 overflow-x-auto rounded-md border border-border bg-muted/50 p-3 font-mono text-xs whitespace-pre-wrap break-words"
                                ><code>{{ ep.requestBody.example }}</code></pre>
                            </template>

                            <!-- Response -->
                            <h4 class="mb-2 text-sm font-semibold text-foreground">Response (200 OK)</h4>
                            <p class="mb-1 text-xs text-muted-foreground">Beispiel (JSON)</p>
                            <pre
                                class="overflow-x-auto rounded-md border border-border bg-muted/50 p-3 font-mono text-xs whitespace-pre-wrap break-words"
                            ><code>{{ ep.responseExample }}</code></pre>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    </AdminLayout>
</template>
