# Modulsystem – Entwickler-Dokumentation

Das Modulsystem ermöglicht funktionale Module (Kontaktformular, Newsletter, etc.) als Blöcke im Page Designer. Alle Submission-Anfragen laufen über die zentrale Panel-API.

## Architektur

```
Frontend (Vue)                Backend (Laravel)
─────────────────            ─────────────────
ModuleBlock/ContactFormBlock  →  ModuleSubmissionController
  useModuleSubmit()                → ModuleRegistry::resolve()
  POST /api/sites/{id}/modules/submit  → ContactModuleHandler / NewsletterModuleHandler
```

## Neues Modul hinzufügen

### 1. Backend: Handler und Registry

**Handler erstellen** (`app/Modules/Handlers/MeinModulHandler.php`):

```php
<?php

namespace App\Modules\Handlers;

use App\Contracts\ModuleHandler;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeinModulHandler implements ModuleHandler
{
    public function getModuleType(): string
    {
        return 'mein_modul';
    }

    public function handle(Site $site, Request $request): JsonResponse
    {
        // Validierung, Persistenz, etc.
        return response()->json(['success' => true, 'message' => 'Erfolg']);
    }
}
```

**In Registry registrieren** (`app/Providers/AppServiceProvider.php`):

```php
ModuleRegistry::register('mein_modul', MeinModulHandler::class);
```

### 2. Frontend: Block-Komponente

**Modul-UI** (`resources/js/templates/praxisemerald/page_components/modules/MeinModulModule.vue`):

```vue
<script setup lang="ts">
import { ref, inject } from 'vue';
import { useModuleSubmit } from '@/composables/useModuleSubmit';

const site = inject('site');
const { pending, submit } = useModuleSubmit();

async function handleSubmit() {
  const result = await submit(
    { siteId: site.id, moduleType: 'mein_modul', moduleConfig: props.data },
    formData.value,
    honeypot.value
  );
  // ...
}
</script>
```

**Block** (`resources/js/templates/praxisemerald/page_components/MeinModulBlock.vue`):

- `meta` mit `type`, `label`, `defaultData`, ggf. `fields` oder `Editor`
- Rendert die Modul-UI-Komponente

**In Loader eintragen** (`page_components/loader.ts`):

```ts
import * as MeinModulBlockMod from './MeinModulBlock.vue';
// ...
'./MeinModulBlock.vue': MeinModulBlockMod as PageComponentModule,
```

### 3. Optional: Migration

Falls das Modul persistente Daten benötigt, Migration und Model anlegen.

## API-Contract

**POST** `/api/sites/{site}/modules/submit`

Request:
```json
{
  "module_type": "contact",
  "module_instance_id": "lc_xxx",
  "module_config": { ... },
  "data": { ... },
  "honeypot": ""
}
```

Response (Erfolg):
```json
{ "success": true, "message": "..." }
```

Response (Fehler):
```json
{ "success": false, "errors": { "field": ["Fehlermeldung"] } }
```

## Sicherheit

- **Rate Limiting:** 10 Requests/Minute pro IP (`throttle:module-submit`)
- **Honeypot:** Verstecktes Feld `honeypot` – wenn gefüllt, Validierung schlägt fehl
- **Erweiterbar:** Captcha/Token kann in `ModuleSubmissionRequest` oder Modul-Handler ergänzt werden

## Navbar-Integration

Module mit `showInNavbar` können in Header/MobileNav erscheinen. `active_modules` wird aus `layout_components` abgeleitet (SiteRenderService) und an die Layout-Komponenten über `generalInformation.active_modules` übergeben.
