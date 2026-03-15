<!-- Admin: API-Dokumentation -->
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BButton,
    BBadge,
} from 'bootstrap-vue-next';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Icon from '@/components/wrappers/Icon.vue';
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
    {
        method: 'GET',
        path: '/partners',
        summary: 'Partner auflisten',
        description: 'Alle aktiven Partner der Brand (Name, Beschreibung, Bild-URL). Nur aktive Partner mit Ablaufdatum in der Zukunft oder ohne Ablaufdatum.',
        parameters: [
            {
                name: 'brand_id',
                in: 'query',
                type: 'integer',
                required: false,
                description: 'Brand-ID (optional, sonst aus X-Brand-Id oder Default-Brand)',
            },
        ],
        responseExample: `{
  "data": [
    {
      "name": "Partner A",
      "description": "Beschreibung des Partners.",
      "image_url": "https://example.com/storage/partners/abc123.jpg"
    },
    {
      "name": "Partner B",
      "description": null,
      "image_url": null
    }
  ]
}`,
    },
];

function methodVariant(method: string): 'success' | 'primary' | 'warning' | 'danger' | 'secondary' {
    switch (method) {
        case 'GET': return 'success';
        case 'POST': return 'primary';
        case 'PUT':
        case 'PATCH': return 'warning';
        case 'DELETE': return 'danger';
        default: return 'secondary';
    }
}
</script>

<template>
    <AdminLayout :breadcrumbs="breadcrumbs">
        <Head title="API-Dokumentation" />

        <BRow>
            <BCol>
                <div class="mb-3 d-flex flex-column flex-sm-row flex-sm-wrap align-items-start align-sm-center justify-content-between gap-2">
                    <div>
                        <h4 class="mb-1">API v1 – Dokumentation</h4>
                        <p class="text-muted small mb-0">
                            Basis-URL: <code class="rounded bg-light px-1 py-0 font-monospace">{{ apiBaseUrl }}</code>
                        </p>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        <BButton variant="outline-secondary" size="sm" @click="downloadMarkdown">
                            <Icon icon="download" class="me-2" />Als Markdown
                        </BButton>
                        <Link href="/admin/api">
                            <BButton variant="outline-secondary" size="sm">
                                <Icon icon="arrow-left" class="me-2" />Zurück zur API-Übersicht
                            </BButton>
                        </Link>
                    </div>
                </div>

                <BCard no-body class="mb-4">
                    <BCardHeader>
                        <BCardTitle class="mb-0">Authentifizierung</BCardTitle>
                        <p class="text-muted small mb-0 mt-1">
                            Jede Anfrage muss den Authorization-Header mit einem gültigen Bearer-Token senden.
                            Optional: <code class="rounded bg-light px-1 py-0">X-Brand-Id: &lt;id&gt;</code> oder
                            Query <code class="rounded bg-light px-1 py-0">brand_id=&lt;id&gt;</code> für Multi-Brand.
                        </p>
                    </BCardHeader>
                    <BCardBody>
                        <pre class="overflow-x-auto rounded border bg-light p-3 font-monospace small mb-0"><code>Authorization: Bearer &lt;Ihr-API-Token&gt;</code></pre>
                    </BCardBody>
                </BCard>

                <h5 class="mb-2">Endpoints</h5>
                <p class="text-muted small mb-3">
                    Klicken Sie auf einen Endpoint, um Parameter, Request-Body und Response-Beispiele zu sehen.
                </p>

                <div class="d-flex flex-column gap-2">
                    <Collapsible
                        v-for="ep in endpoints"
                        :key="ep.path"
                        class="border rounded group"
                    >
                        <CollapsibleTrigger
                            as-child
                            class="d-block w-100 text-start rounded hover-bg-light focus-outline-none"
                        >
                            <div class="d-flex align-items-center gap-3 px-3 py-3 cursor-pointer">
                                <div class="d-flex min-w-0 flex-grow-1 flex-wrap align-items-center gap-2">
                                    <BBadge :variant="methodVariant(ep.method)" class="font-monospace">{{ ep.method }}</BBadge>
                                    <code class="min-w-0 text-truncate rounded bg-light px-2 py-0 small">{{ apiBaseUrl }}{{ ep.path }}</code>
                                    <span class="small fw-medium">{{ ep.summary }}</span>
                                </div>
                                <Icon icon="chevron-down" class="flex-shrink-0 text-muted small" />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div class="border-top px-3 pb-3 pt-3">
                                <p class="small text-muted mb-3">{{ ep.description }}</p>

                                <template v-if="ep.parameters && ep.parameters.length > 0">
                                    <h6 class="small fw-semibold mb-2">Parameter</h6>
                                    <div class="table-responsive mb-3">
                                        <table class="table table-sm table-bordered small">
                                            <thead class="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>In</th>
                                                    <th>Typ</th>
                                                    <th>Pflicht</th>
                                                    <th>Beschreibung</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="p in ep.parameters" :key="p.name">
                                                    <td class="font-monospace">{{ p.name }}</td>
                                                    <td class="text-muted">{{ p.in }}</td>
                                                    <td class="font-monospace">{{ p.type }}</td>
                                                    <td>{{ p.required ? 'Ja' : 'Nein' }}</td>
                                                    <td class="text-muted">{{ p.description }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </template>

                                <template v-if="ep.requestBody">
                                    <h6 class="small fw-semibold mb-2">Request Body</h6>
                                    <p class="small text-muted mb-1">Schema (JSON)</p>
                                    <pre class="overflow-x-auto rounded border bg-light p-3 font-monospace small mb-3"><code>{{ ep.requestBody.schema }}</code></pre>
                                    <p class="small text-muted mb-1">Beispiel</p>
                                    <pre class="overflow-x-auto rounded border bg-light p-3 font-monospace small mb-3 text-break whitespace-pre-wrap"><code>{{ ep.requestBody.example }}</code></pre>
                                </template>

                                <h6 class="small fw-semibold mb-2">Response (200 OK)</h6>
                                <p class="small text-muted mb-1">Beispiel (JSON)</p>
                                <pre class="overflow-x-auto rounded border bg-light p-3 font-monospace small mb-0 text-break whitespace-pre-wrap"><code>{{ ep.responseExample }}</code></pre>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </BCol>
        </BRow>
    </AdminLayout>
</template>
