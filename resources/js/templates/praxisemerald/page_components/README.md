# Page Components (eine Datei pro Komponente)

Neue Layout-Komponenten für den Page Designer fügst du hinzu, indem du **eine neue `.vue`-Datei** in diesem Ordner anlegst. Es ist keine Anpassung in Registry, Map oder Kontext-Panel nötig.

## Format einer Komponenten-Datei

Jede Datei ist ein Vue SFC mit:

1. **Named Export `meta`** (Objekt) – in einem **eigenen `<script lang="ts">`-Block ohne `setup`**, da `<script setup>` keine ES-Modul-Exports erlauben darf:
   - `type: string` – eindeutiger Typ (z. B. `'text'`, `'heading'`)
   - `label: string` – Anzeigename in Galerie und Struktur
   - `defaultData: Record<string, unknown>` – Startdaten für neue Blöcke
   - `placement?: 'above_main' | 'below_main'` (optional, Standard: `'above_main'`)
   - `acceptsChildren?: boolean` (optional, nur für Container wie Section)
   - **Optional** `fields` – Liste von Feldern für das generische Kontext-Panel (siehe unten)

2. **Default Export** – die Vue-Komponente für den Block (Vorschau/Seite). Props: `data` (und optional `designMode`).

3. **Optional: Named Export `Editor`** – eigene Vue-Komponente für das Kontext-Panel. Erhält `entry` und `site` als Props. Wenn vorhanden, wird dieser Editor statt des generischen Formulars genutzt.

## Beispiel (nur Meta + Block, Kontext über `fields`)

```vue
<!-- page_components/TextBlock.vue -->
<script lang="ts">
export const meta = {
  type: 'text',
  label: 'Text',
  placement: 'above_main',
  defaultData: { content: '', align: 'left' },
  fields: [
    { key: 'content', label: 'Inhalt', type: 'textarea' },
    { key: 'align', label: 'Ausrichtung', type: 'select', options: ['left', 'center', 'right'] },
  ],
};
</script>

<script setup lang="ts">
const props = defineProps<{ data: Record<string, unknown> }>();
</script>

<template>
  <p :class="{ 'text-center': data.align === 'center', 'text-right': data.align === 'right' }">
    {{ data.content || 'Text hier eingeben…' }}
  </p>
</template>
```

Wenn `meta.fields` gesetzt ist, baut das Kontext-Panel automatisch ein Formular (Input, Textarea, Select, Bild/Media). Für komplexe UIs kannst du stattdessen eine eigene **Editor**-Komponente exportieren.

## Feldtypen in `meta.fields`

- `text` – einzeiliges Input
- `textarea` – mehrzeiliges Textfeld
- `number` – Zahlen-Input
- `select` – Dropdown, `options`: `string[]` oder `{ value: string; label: string }[]`
- `image` – URL-Input + optional Button „Aus Media Library“

Neue Komponente = eine neue `.vue`-Datei hier **und** einen Eintrag in `loader.ts` im Objekt `modules` (z. B. `'./NeueBlock.vue': NeueBlockMod as PageComponentModule`). Keine Änderung in `component-registry`, `component-map` oder `LayoutComponentContextPanel` nötig.

## Vorhandene Basis-Blöcke

Im Ordner liegen u. a. Überschrift, Text, Bild, Button, Trennlinie, Abstand, Zitat, Liste, Icon-Box, Statistik, Bild+Text, Link-Liste, Infobox, Zwei Spalten, Logo-Leiste, Prozess-Schritte, Zeitleiste, Social Links, Breadcrumb, HTML-Block, Sprungmarke, Eine Kennzahl und Button-Gruppe. Alle nutzen das generische Kontext-Panel über `meta.fields`.
