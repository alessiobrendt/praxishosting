# Ticket-System: Mögliche Erweiterungen

Ideensammlung für spätere Erweiterungen des Support-Ticket-Systems.

| Idee | Kurzbeschreibung |
|------|------------------|
| **E-Mail bei neuer Antwort** | Bereits E-Mail-Vorlagen (ticket_reply, ticket_admin_reply); Versand bei neuer Nachricht per Job/Notification auslösen (Kunde oder Admin benachrichtigen). |
| **Anhänge** | Pro Nachricht Dateianhänge (Migration `ticket_message_attachments`, Storage, Validierung Typ/Größe, Download-Link in der Nachricht). |
| **Canned Responses / Vorlagen** | Admin kann Textbausteine anlegen; beim Antworten eine Vorlage wählen und einfügen (CRUD für Snippets, z. B. pro Kategorie). |
| **SLA / Fristen** | Ziel-Erstantwortzeit oder Lösungsfrist pro Priorität/Kategorie; Anzeige „Antwort fällig in X h“ und ggf. Escalation oder Farbe. |
| **Ticket-Zusammenführung** | Zwei Tickets zu einem zusammenführen (Nachrichten des einen unter dem anderen anzeigen, zweites schließen). |
| **Suche** | Volltextsuche in Betreff/Nachrichten (Scout oder LIKE), Filter in der Admin-Ticket-Liste. |
| **Export** | Tickets als CSV/PDF exportieren (Filter wie in der Liste). |
| **Bewertung nach Schließung** | Optional: Kunde bewertet die Lösung (1–5 Sterne oder Zufriedenheit), Speicherung in `tickets` oder neuer Tabelle. |
| **Interne Notizen vs. öffentliche Antwort** | Bereits umgesetzt (`is_internal`); ggf. visuell stärker trennen (z. B. farbiger Block). |
| **Zuweisung an Team/Gruppe** | Statt nur `assigned_to` (User) optional „Team“ oder „Queue“; Zuweisung an Gruppe, dann an Mitarbeiter. |
| **Ticket-Tags/Labels** | Zusätzlich zu Kategorie flexible Tags (many-to-many), Filter und Anzeige in der Liste. |
