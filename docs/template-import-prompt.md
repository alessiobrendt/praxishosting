# Prompt: Template importieren / konvertieren (Praxishosting)

Nutze diesen Prompt, um ein bestehendes Template (z. B. aus einem anderen Vue-/Nuxt-Projekt oder HTML) in das Praxishosting-Template-System zu überführen. Du kannst ihn an ein AI-Tool (z. B. Cursor) übergeben und die Platzhalter ersetzen.

---

## Kontext

Praxishosting rendert Sites über eine **Template-Registry** ([resources/js/templates/template-registry.ts](resources/js/templates/template-registry.ts)). Jedes Template wird per **Slug** registriert und liefert:

- **Layout:** Vue-Komponente mit Props `pageData`, `colors`, `generalInformation`, `site` und einem default `<slot />` für den Hauptinhalt.
- **PageComponent:** Die Startseiten-Komponente (z. B. `pages/Index.vue`), die als Slot-Inhalt gerendert wird.
- Optional: **getDefaultPageData()** – Fallback-JSON, wenn das Template in der DB noch kein `page_data` hat.
- Optional: **getComponentRegistry()** und **SiteEditor** – nur nötig, wenn du Layout-Komponenten (Header, Footer, Hero …) konfigurierbar oder eine eigene Edit-UI willst.

Die Seite [resources/js/pages/site-render/Home.vue](resources/js/pages/site-render/Home.vue) lädt das Template dynamisch über `getTemplateEntry(templateSlug)` und rendert Layout + Page.

**Referenz-Template:** [resources/js/templates/praxisemerald/](resources/js/templates/praxisemerald/)  
– [PraxisemeraldLayout.vue](resources/js/templates/praxisemerald/PraxisemeraldLayout.vue), [pages/Index.vue](resources/js/templates/praxisemerald/pages/Index.vue), [component-registry.ts](resources/js/templates/praxisemerald/component-registry.ts), [template-registry.ts](resources/js/templates/template-registry.ts).

---

## Deine Eingabe (bitte ausfüllen)

- **Quell-Template:** [z. B. Pfad zum Ordner, Framework (Nuxt/Vue/HTML), oder Beschreibung der Sektionen]
- **Gewünschter Slug:** [z. B. `handwerk`, `restaurant` – muss in Registry und DB identisch sein]
- **Gewünschte Sektionen / page_data:** [z. B. hero, services, about, contact – oder „wie Referenz praxisemerald“]

---

## Schritte für die Konvertierung

1. **Ordner anlegen**  
   `resources/js/templates/<slug>/` (z. B. `handwerk/`).

2. **Layout-Komponente**  
   Eine Vue-Komponente (z. B. `XyzLayout.vue`), die folgende Props erhält:
   - `pageData: Record<string, unknown>`
   - `colors: Record<string, string>`
   - `generalInformation?: Record<string, unknown>`
   - `site: { id: number; name: string; slug: string }`  
   Sie rendert oben/unten optional Header/Footer und in der Mitte **genau einen** `<slot />` für den Hauptinhalt. Wenn das Quell-Template feste Header/Footer hat, diese hier einbauen; wenn sie aus Daten kommen sollen, entweder aus `pageData` lesen oder (wie bei Praxis Emerald) über `layout_components` und eine component-registry lösen.

3. **Page-Komponente**  
   `pages/Index.vue`: Inhalt der Startseite. Props mindestens `pageData` (und ggf. `colors`). Alle sichtbaren Texte und Bilder aus `pageData` beziehen, keine festen Platzhalter im Template.  
   - Nuxt-spezifische Imports/APIs entfernen (`useRouter`, `useRuntimeConfig`, `definePageMeta` etc.).  
   - Stattdessen normale Vue-Imports und ggf. `@/`-Aliase (Vite/Laravel).

4. **page_data-Struktur**  
   Ein klares Objekt für `getDefaultPageData()` definieren (z. B. `colors`, `hero`, `services`, `about`, `contact`). Typ entweder `Record<string, unknown>` oder ein eigenes TypeScript-Interface im Template-Ordner. Dieses Objekt wird in der Template-Registry als Fallback zurückgegeben und in der Site-Bearbeitung (oder im generischen JSON-Editor) genutzt.

5. **Registrierung**  
   In [template-registry.ts](resources/js/templates/template-registry.ts):
   - Neue Funktion `registerXyz()` (Name zum Slug passend).
   - Darin `register({ slug, Layout, PageComponent, getDefaultPageData })` aufrufen.  
   - Optional: `getComponentRegistry` und `SiteEditor` nur hinzufügen, wenn Layout-Komponenten-UI oder ein spezifischer Editor gewünscht ist.
   - Am Ende der Datei `registerXyz();` aufrufen.

6. **Datenbank**  
   Einen Template-Datensatz mit dem **gleichen** `slug` anlegen (Admin oder Seeder). Optional `page_data` (JSON) vorbelegen, sonst wird der Fallback aus `getDefaultPageData()` verwendet.

---

## Checkliste nach der Konvertierung

- [ ] Kein Nuxt-/SSR-spezifischer Code mehr (kein `useRouter`, `useRuntimeConfig`, `definePageMeta` etc.).
- [ ] Alle sichtbaren Inhalte kommen aus `pageData` oder den übergebenen Props (keine festen Texte im Markup).
- [ ] Slug in Registry und DB identisch.
- [ ] `npm run build` läuft ohne Fehler durch.
- [ ] Optional: Template in der App auswählbar und Site mit diesem Template rendert korrekt (Layout + Page).

---

## Beispiel-Aufruf (für AI)

„Bitte konvertiere mein Template nach dem Praxishosting-System. Nutze dazu die Anleitung in docs/template-import-prompt.md.  
Quell-Template: [Pfad oder Beschreibung].  
Gewünschter Slug: handwerk.  
Gewünschte Sektionen: hero, services, about, contact.“
