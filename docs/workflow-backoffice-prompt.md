# Prompt: Workflow inkl. Backoffice vollständig zum Laufen bringen

Nutze diesen Prompt, um alle fehlenden Teile zu implementieren, sodass der Workflow-Builder nicht nur als Prototyp (Design + Simulation) funktioniert, sondern **echte Workflows** laufen und das **Backoffice** Daten empfängt und anzeigt.

---

## Ist-Zustand (bereits vorhanden)

- **Workflow Builder (Vue)**: UI unter `/workflow-builder` mit Node-Palette, Canvas (Drag & Drop, Verbindungen), Node-Inspector, Speichern/Laden (JSON), Server-Speicherung in `storage/app/workflows/*.json`, „Run simulieren“ (nur Log-Ausgabe, keine echte Ausführung).
- **Backend**: `WorkflowController` mit `index`, `list`, `store`, `show` – reines Speichern/Laden von Workflow-JSON; keine Ausführung, kein Backoffice.
- **Node-Typen** (definiert in `resources/js/types/workflow.ts`): Trigger (Kontaktformular), Actions (Fonio, eSign, **Backoffice: Ergebnisse übergeben**, **Backoffice: Status aktualisieren**), Webhooks (Termin bestätigt, eSign completed), Timer (Erinnerung T-1 Tag, Unterlagen-Check PT3H).

---

## Ziel

1. **Workflow-Execution**: Ein ausgewählter Workflow kann **wirklich** gestartet werden (durch Trigger oder manuell) und führt die verbundenen Schritte nacheinander aus; Kontext (Patient, Termin, Unterlagen, etc.) wird zwischen den Nodes durchgereicht.
2. **Backoffice**:  
   - **Ergebnisse übergeben** (`action.backoffice_push`): Daten/Zusammenfassung landen in einer eigenen Ablage (z.B. DB-Tabelle + optional CSV-Export oder Ordner).  
   - **Status aktualisieren** (`action.backoffice_status_update`): Status (z.B. „vollständig“/„nachreichen“) und Notiz werden im Backoffice gespeichert und sind sichtbar.  
   - **Backoffice-UI**: Eine (Panel-)Seite, auf der eingegangene Fälle/Patienten mit Status und Notiz angezeigt werden (Liste + ggf. Detail).
3. **Trigger**: Mindestens ein Trigger muss den Workflow starten können – z.B. **Kontaktformular** (wenn ein Formular auf einer Site abgeschickt wird, wird ein konfigurierter Workflow gestartet und der Kontext aus dem Formular übergeben).
4. **Timer** (optional, aber empfohlen): Laravel Scheduler (cron) prüft z.B. geplante Termine und stößt Timer-Nodes an („T-1 Tag“, „PT3H vor Termin“), sodass Erinnerungen/Unterlagen-Checks automatisch laufen.
5. **Fonio / eSign**: Können zunächst als Stub (nur Log, keine echten API-Calls) bleiben; wichtig ist, dass die **Backoffice-Actions und der Ablauf** echt funktionieren.

---

## Was konkret umgesetzt werden soll

### 1. Workflow-Execution-Engine (Backend)

- **Workflow laden**: Aus `storage/app/workflows/{id}.json` oder aus DB (falls Workflows später in DB gewandert werden).
- **Lauf-Konzept**: Ein „Run“ = eine Instanz eines Workflows mit Kontext (Payload/Variablen: z.B. `patient`, `appointment`, `docs`, `summary`).  
  - Start entweder durch Trigger (z.B. Form-Submit) oder manuell (z.B. „Run starten“ im Panel mit Test-Payload).  
  - Ausführung: Von den Start-Nodes (Trigger/Webhook) ausgehend die verbundenen Nodes in Reihenfolge (BFS/DFS entlang der Edges) ausführen; pro Node die passende „Executor“-Logik aufrufen.
- **Kontext**: Ein Run hat einen Kontext (Key-Value, z.B. `patient.name`, `appointment.start`). Actions lesen daraus (z.B. `field_map`) und schreiben ggf. zurück (z.B. Status, Notiz).
- **Persistenz eines Runs**: Run-Id, Workflow-Id, Status (running/completed/failed), Kontext-Snapshot, Zeitstempel; speichern in DB (Tabelle `workflow_runs` o.ä.), damit Backoffice und Timer darauf zugreifen können.

### 2. Backoffice-Datenmodell und -Logik

- **Tabelle (z.B. `backoffice_cases` oder `workflow_backoffice_entries`)**:  
  - Eindeutige Id, Referenz auf `workflow_run_id` (oder direkt Patient/Termin-Identifikatoren),  
  - Payload (JSON: Name, Telefon, E-Mail, Zusammenfassung, fehlende Unterlagen, etc.),  
  - Status (z.B. `vollständig`, `nachreichen`),  
  - Notiz (Text),  
  - Zeitstempel (created_at, updated_at).
- **Action „Backoffice: Ergebnisse übergeben“** (`action.backoffice_push`):  
  - Beim Ausführen: Kontext aus dem Run lesen (gemäß `field_map`/Config), einen Eintrag in der Backoffice-Tabelle anlegen (oder aktualisieren, wenn es einen Fall pro Run gibt).  
  - Optional: CSV-Export in ein Verzeichnis (`drop_folder` aus Config) oder nur DB – mindestens DB.
- **Action „Backoffice: Status aktualisieren“** (`action.backoffice_status_update`):  
  - Beim Ausführen: Den zum aktuellen Run gehörenden Backoffice-Eintrag finden und `status` (z.B. `status_complete`/`status_missing` aus Config) sowie `note` setzen.
- **API oder direkte Aufrufe**: Die Execution-Engine ruft diese Logik in PHP auf (Service-Klassen z.B. `WorkflowExecutor`, `BackofficePushAction`, `BackofficeStatusUpdateAction`).

### 3. Backoffice-UI im Panel

- **Neue Route** (z.B. `/backoffice` oder `/workflow-backoffice`) im bestehenden Panel (AppLayout, Sidebar-Eintrag).
- **Seite**: Liste der Backoffice-Einträge (Tabelle oder Karten): z.B. Name, Kontakt, Status, Notiz, Datum; Filter/Suche optional.
- **Detail**: Klick auf einen Eintrag zeigt alle gespeicherten Daten (Payload, Status, Notiz, zugehöriger Workflow-Run).
- Keine Abhängigkeit von THEORG oder externen Systemen – alles aus der eigenen DB.

### 4. Trigger: Kontaktformular

- **Anbindung**: Wenn auf einer Site (z.B. Praxisemerald) ein Kontaktformular abgeschickt wird, soll ein konfigurierter Workflow (z.B. per Setting: „Workflow für Kontaktformular“ = ID) gestartet werden.
- **Payload**: Formulardaten (name, phone, email, Nachricht, etc.) als Start-Kontext (z.B. `patient.name`, `patient.email`) in den Run übergeben.
- **Technisch**: Im bestehenden Form-Submit-Handler (z.B. Kontaktmodul) nach dem Speichern/Senden ein Event dispatchen oder einen Job dispatchen (z.B. `StartWorkflowJob` mit Workflow-Id und Payload); der Job startet die Execution-Engine mit diesem Workflow und Kontext.

### 5. Timer (Laravel Scheduler)

- **Konzept**: Ein Cron-Job (z.B. `php artisan schedule:run`) ruft regelmäßig (z.B. jede Minute) einen Befehl auf, der:  
  - Geplante Termine (aus einer Kalender-/Termin-Quelle oder aus Backoffice-Einträgen mit Termin) lädt,  
  - Für „T-1 Tag“: Termine findet, die in 24 h liegen, und für zugehörige Runs den Node `timer.reminder_call` anstößt (oder einen neuen Run mit Kontext „appointment“ startet),  
  - Für „PT3H“: Termine in 3 h, und stößt `timer.precheck_docs` an.
- **Hinweis**: Wenn noch kein echtes Kalender-System existiert, kann man Timer zunächst mit Test-Daten oder mit in der DB gespeicherten „geplanten Terminen“ aus dem Backoffice-Kontext simulieren – wichtig ist die Architektur (Scheduler → Workflow-Engine → Timer-Node ausführen).

### 6. Fonio / eSign (Stub)

- **Fonio** (`action.fonio_call`, `webhook.appointment_confirmed`): In der Execution nur loggen („Fonio-Anruf würde ausgeführt“) und Kontext durchreichen; Webhook „Termin bestätigt“ kann manuell oder per Test-Route ausgelöst werden.
- **eSign** (`action.esign_request`, `webhook.esign_completed`): Ebenfalls Stub (Log); „eSign completed“ kann für Tests manuell getriggert werden, um den Rest des Workflows (Unterlagen prüfen → Backoffice Push) zu testen.

### 7. Manueller Test-Run im Workflow-Builder

- Im UI: Button „Workflow ausführen“ (nicht nur „Run simulieren“), der einen echten Run mit Demo-Payload startet (z.B. per API `POST /workflow-builder/api/run` mit `workflow_id` und `payload`).  
- Zeigt nach Ausführung z.B. Run-Status und Link zum Backoffice-Eintrag (falls einer angelegt wurde).

---

## Technische Hinweise

- **Laravel**: Queued Jobs für asynchrone Ausführung (z.B. `StartWorkflowJob`, `ExecuteWorkflowNodeJob`) nutzen, damit Form-Submit und Scheduler nicht blockieren.
- **Struktur**: Pro Node-Typ eine kleine „Executor“-Klasse oder Methode (z.B. `executeTriggerFormSubmit`, `executeActionBackofficePush`, `executeTimerReminderCall`), die von der zentralen Engine aufgerufen wird.
- **Konfiguration**: Welcher Workflow bei Form-Submit startet, kann in Settings oder in der Site-/Modul-Konfiguration stehen (z.B. `workflow_id` für Kontaktformular).
- **Bestehende Dateien**:  
  - Workflow-Definition: `resources/js/types/workflow.ts` (Node-Typen, Default-Config).  
  - Backend: `app/Http/Controllers/WorkflowController.php` (nur Speichern/Laden; neue Endpoints für Run/Backoffice ergänzen).  
  - Keine Änderung nötig am Vue-Builder selbst für die reine Execution – nur optional „Workflow ausführen“-Button und Anzeige des Run-Ergebnisses.

---

## Kurz-Checkliste

- [ ] DB-Migration: `workflow_runs` (run_id, workflow_id, status, context snapshot, timestamps).
- [ ] DB-Migration: Backoffice-Tabelle (Einträge mit Payload, Status, Notiz, Run-Referenz).
- [ ] Workflow-Execution-Engine (Workflow laden, Run starten, Nodes der Reihe nach ausführen, Kontext verwalten).
- [ ] Executor für `action.backoffice_push` (Eintrag anlegen/aktualisieren).
- [ ] Executor für `action.backoffice_status_update` (Status + Notiz setzen).
- [ ] Backoffice-Panel-Seite (Liste + Detail).
- [ ] Trigger Kontaktformular: Nach Form-Submit Workflow starten (Event/Job).
- [ ] Optional: Scheduler für Timer-Nodes (T-1 Tag, PT3H).
- [ ] Optional: API „Workflow ausführen“ + Button im Builder.
- [ ] Stubs für Fonio/eSign (nur Log), damit der Ablauf durchlaufen werden kann.

Wenn das umgesetzt ist, „geht alles“ vom Workflow inkl. Backoffice: Formular → Workflow startet → Schritte laufen → Backoffice erhält Daten und Status → sichtbar in der Backoffice-UI.
