# Maizzle E-Mails (Laravel Integration)

E-Mail-Templates mit Maizzle bauen: Outlook-kompatibel, Inline-CSS, Tabellen-Layout. Ein Repository – alles im Laravel-Projekt.

---

## 1. Projektstruktur

```
resources/
  emails/                    # Maizzle-Projekt
    config.js                # Basis-Config
    config.production.js     # Build-Output → Laravel views
    package.json             # Scripts: build, dev
    templates/
      transactional.html     # Layout mit Platzhaltern __GREETING__, __BODY__, __ACTION_BUTTON__, __FOOTER__
  views/
    emails/
      compiled/              # Hier landen die gebauten HTML-Dateien (nach npm run build)
        transactional.html
```

---

## 2. Installation

### Schritt 1: Maizzle-Abhängigkeiten installieren

```bash
cd resources/emails
npm install
```

### Schritt 2: E-Mails bauen (Produktion)

```bash
cd resources/emails
npm run build
```

Die gebaute Datei liegt danach unter `resources/views/emails/compiled/transactional.html`.

### Schritt 3: Optional – vom Projektroot aus bauen

Im **Laravel-**`package.json` (Projektroot) können Sie ein Script ergänzen:

```json
"scripts": {
  "emails:build": "cd resources/emails && npm run build"
}
```

Dann: `npm run emails:build`

---

## 3. package.json Scripts (resources/emails)

| Script    | Befehl                    | Beschreibung                          |
|----------|----------------------------|----------------------------------------|
| `build`  | `maizzle build production` | Baut Templates nach `../views/emails/compiled` |
| `dev`    | `maizzle serve`            | Lokaler Dev-Server mit Live-Preview    |

---

## 4. Build-Prozess

1. **Quelle:** `resources/emails/templates/*.html`
2. **Maizzle:** Inline-CSS, Minify, E-Mail-Transformationen (siehe [Maizzle Build](https://maizzle.com/docs/build-process)).
3. **Ziel:** `resources/views/emails/compiled/` (in `config.production.js` via `output.path`).
4. **Laravel:** Liest die gebaute HTML-Datei in Mailables (z. B. `TransactionalTemplateMail`) und ersetzt die Platzhalter.

Nach Änderungen an `templates/transactional.html` immer erneut ausführen:

```bash
cd resources/emails && npm run build
```

---

## 5. Laravel Mailable Integration

### Config

In `config/maizzle.php` ist der Pfad zur gebauten Datei gesetzt:

```php
'compiled_path' => resource_path('views/emails/compiled/transactional.html'),
```

### Beispiel: TransactionalTemplateMail

```php
use App\Mail\TransactionalTemplateMail;
use Illuminate\Support\Facades\Mail;

$content = [
    'subject'     => 'Ihre Rechnung R-2026-001',
    'greeting'    => 'Hallo Max Mustermann,',
    'body'        => "Ihre Rechnung **R-2026-001** wurde erstellt.\nBetrag: **9,99 €**",
    'action_text' => 'Rechnung herunterladen',
];
$actionUrl = 'https://example.com/invoices/1/pdf';

Mail::to($user->email)->send(new TransactionalTemplateMail($content, $actionUrl));
```

**Test-Mail (z. B. aus dem Admin):**

```php
Mail::to($email)->send(new TransactionalTemplateMail($content, $actionUrl, isTest: true));
```

### Platzhalter im Template

Die gebaute HTML-Datei enthält:

- `__GREETING__`  → wird durch den Begrüßungstext ersetzt
- `__BODY__`      → wird durch den HTML-Body (aus Markdown) ersetzt
- `__ACTION_BUTTON__` → Button (nur wenn `action_text` + `actionUrl` gesetzt)
- `__FOOTER__`    → Standard-Footer (App-Name)

---

## 6. Best Practices (Outlook, Gmail)

### Layout

- **Tabellen-Layout:** Nutzen Sie `<table role="presentation">` für Struktur. Kein Flexbox/Grid in E-Mails.
- **Inline-CSS:** Maizzle inlined CSS beim Build. Zusätzlich in `transactional.html` wichtige Werte direkt im `style`-Attribut setzen (z. B. `padding`, `font-size`, `color`).
- **Breite:** Container typisch 600px max; `width="100%"` auf Wrapper-Tabellen mit `max-width` im style.

### Outlook

- **MSO-Kommentare:** Für spezielle Outlook-Anpassungen können Sie in Maizzle-Templates `<!--[if mso]>` nutzen (siehe [Maizzle Outlook](https://maizzle.com/docs/tags/outlook)).
- **VML für Buttons:** In sehr alten Outlook-Versionen können Buttons als VML gesetzt werden; für die meisten Fälle reicht ein einfacher `<a style="...">`.
- **Bilder:** Immer `display: block` und feste Breite/Höhe wo nötig; `alt` setzen.

### Gmail

- **Kein `<style>` im Body:** Gmail kann `<style>` im `<head>` stripben. Wichtige Styles daher inline auf den Elementen (Maizzle macht das).
- **Kurz halten:** Sehr große HTML-Mails können in Gmail gekürzt werden; Inhalt möglichst kompakt.

### Allgemein

- **Keine JavaScript:** E-Mails rendern keinen JS.
- **Links:** Absolute URLs (`https://...`) verwenden.
- **Tests:** Mit [Litmus](https://litmus.com), [Email on Acid](https://www.emailonacid.com) oder manuell in Outlook (Desktop), Gmail, Apple Mail prüfen.

---

## 7. Übersicht

| Thema              | Umsetzung |
|--------------------|-----------|
| Ein Repository     | Maizzle liegt unter `resources/emails/`, Build unter `resources/views/emails/compiled/`. |
| Outlook-kompatibel | Tabellen-Layout, inline Styles, optional MSO. |
| Inline CSS         | Maizzle-Build inlined CSS; wichtige Werte in Templates zusätzlich inline. |
| Tabellen-Layout    | Kein Flexbox/Grid; alles mit `<table>`. |
| Laravel Mailables  | `TransactionalTemplateMail` lädt gebaute HTML und ersetzt Platzhalter. |
| Kein separates Repo| Alles im gleichen Laravel-Projekt. |
