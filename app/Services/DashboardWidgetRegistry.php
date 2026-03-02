<?php

namespace App\Services;

class DashboardWidgetRegistry
{
    /**
     * All allowed widget keys for layout validation.
     *
     * @return list<string>
     */
    public static function keys(): array
    {
        return array_column(static::widgets(), 'key');
    }

    /**
     * Widget definitions for frontend registry (key, title, description, defaultW, defaultH, demoData).
     *
     * @return array<int, array{key: string, title: string, description: string, defaultW: int, defaultH: int, demoData?: array<string, mixed>}>
     */
    public static function widgets(): array
    {
        $widgets = [
            ['key' => 'revenue-today', 'title' => 'Umsatz heute', 'description' => 'Bezahlter Umsatz heute', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['value' => 1234.56]],
            ['key' => 'revenue-month', 'title' => 'Umsatz Monat', 'description' => 'Umsatz aktueller Monat', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['value' => 45678.90]],
            ['key' => 'revenue-year', 'title' => 'Umsatz Jahr', 'description' => 'Umsatz aktuelles Jahr', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['value' => 234567.89]],
            ['key' => 'revenue-chart-daily', 'title' => 'Umsatz täglich', 'description' => 'Täglicher Umsatz (Chart)', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['labels' => ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'], 'values' => [100, 200, 150, 300, 250, 180, 220]]],
            ['key' => 'revenue-chart-monthly', 'title' => 'Umsatz monatlich', 'description' => 'Monatlicher Umsatz (Chart)', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['labels' => ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'], 'values' => [5000, 6000, 5500, 7000, 6500, 7200]]],
            ['key' => 'unpaid-overdue', 'title' => 'Offene Posten', 'description' => 'Summe unbezahlter Rechnungen, überfällig', 'defaultW' => 3, 'defaultH' => 1, 'demoData' => ['unpaidSum' => 1234.56, 'overdueCount' => 5]],
            ['key' => 'overdue-failed-invoices', 'title' => 'Überfällige Rechnungen', 'description' => 'Liste überfälliger/fehlgeschlagener Rechnungen', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['items' => [['id' => 1, 'number' => 'INV-2026-00001', 'user_name' => 'Demo', 'status' => 'pending', 'due_date' => '01.03.2026']]]],
            ['key' => 'open-dunning-invoices', 'title' => 'Offene Mahnungen', 'description' => 'Rechnungen mit Mahnstufe 2+', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['items' => [['id' => 1, 'number' => 'INV-2026-00002', 'user_name' => 'Demo', 'max_level' => 2]]]],
            ['key' => 'invoice-status-pie', 'title' => 'Rechnungsstatus', 'description' => 'Verteilung nach Status (Chart)', 'defaultW' => 3, 'defaultH' => 2, 'demoData' => ['paid' => 80, 'pending' => 10, 'draft' => 5, 'failed' => 5]],
            ['key' => 'last-stripe-webhook', 'title' => 'Stripe Webhook', 'description' => 'Letzter empfangener Webhook', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['minutesAgo' => 3]],
            ['key' => 'active-subscriptions', 'title' => 'Aktive Abos', 'description' => 'Anzahl aktiver Abonnements', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 42]],
            ['key' => 'subscriptions-ending-week', 'title' => 'Abos diese Woche', 'description' => 'Laufzeitende in dieser Woche', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 3]],
            ['key' => 'cancellations-period-end', 'title' => 'Kündigungen', 'description' => 'Kündigungen zum Periodenende', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 2]],
            ['key' => 'expiring-subscriptions', 'title' => 'Auslaufende Abos', 'description' => 'Abos in den nächsten 7 Tagen', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['items' => [['site_name' => 'Demo Site', 'current_period_ends_at' => '05.03.2026']]]],
            ['key' => 'sites-stats', 'title' => 'Webseiten-Statistik', 'description' => 'Sites gesamt, Legacy, gesperrt', 'defaultW' => 3, 'defaultH' => 1, 'demoData' => ['total' => 100, 'legacy' => 5, 'suspended' => 2]],
            ['key' => 'sites-suspended', 'title' => 'Gesperrte Sites', 'description' => 'Anzahl gesperrte Webseiten', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 2]],
            ['key' => 'subscriptions-chart-daily', 'title' => 'Abos pro Tag', 'description' => 'Neue Abos/Verlängerungen (Chart)', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['labels' => ['Mo', 'Di', 'Mi', 'Do', 'Fr'], 'values' => [2, 5, 3, 4, 6]]],
            ['key' => 'customers-total', 'title' => 'Kunden gesamt', 'description' => 'Anzahl registrierter Kunden', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 256]],
            ['key' => 'newest-customer', 'title' => 'Neuester Kunde', 'description' => 'Zuletzt registrierter Kunde', 'defaultW' => 3, 'defaultH' => 1, 'demoData' => ['name' => 'Max Mustermann', 'email' => 'max@example.com', 'created_at' => '03.03.2026', 'id' => 1]],
            ['key' => 'last-purchase', 'title' => 'Letzter Kauf', 'description' => 'Letzte bezahlte Rechnung', 'defaultW' => 3, 'defaultH' => 1, 'demoData' => ['number' => 'INV-2026-00099', 'amount' => 29.99, 'user_name' => 'Demo', 'paid_at' => '03.03.2026', 'id' => 99]],
            ['key' => 'recent-invoices', 'title' => 'Letzte Rechnungen', 'description' => 'Neueste Rechnungen', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['items' => [['id' => 1, 'number' => 'INV-2026-00100', 'amount' => 19.99, 'status' => 'paid']]]],
            ['key' => 'new-customers-chart', 'title' => 'Neue Kunden (Chart)', 'description' => 'Registrierungen pro Tag/Woche', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['labels' => ['KW1', 'KW2', 'KW3', 'KW4'], 'values' => [12, 18, 15, 20]]],
            ['key' => 'pterodactyl-nodes-load', 'title' => 'Pterodactyl Nodes', 'description' => 'Auslastung der Nodes', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['nodes' => [['name' => 'Node 1', 'memory_allocated_mb' => 4096, 'memory_total_mb' => 8192, 'disk_allocated_mb' => 20480, 'disk_total_mb' => 51200]]]],
            ['key' => 'pterodactyl-nodes-summary', 'title' => 'Nodes Übersicht', 'description' => 'Anzahl Nodes, Wartung, Auslastung %', 'defaultW' => 3, 'defaultH' => 1, 'demoData' => ['total' => 3, 'maintenance' => 0, 'memory_percent' => 65, 'disk_percent' => 40]],
            ['key' => 'hosting-servers-status', 'title' => 'Hosting-Server Status', 'description' => 'Online/Offline aller Server', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['servers' => [['name' => 'Plesk 1', 'panel_type' => 'plesk', 'api_check_status' => 'ok', 'api_checked_at' => '2026-03-02 12:00']]]],
            ['key' => 'hosting-servers-overview', 'title' => 'Server Übersicht', 'description' => 'Anzahl Server online/offline', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['total' => 5, 'online' => 4, 'offline' => 1]],
            ['key' => 'open-tickets', 'title' => 'Offene Tickets', 'description' => 'Anzahl offene Support-Tickets', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 7]],
            ['key' => 'tickets-by-priority', 'title' => 'Tickets nach Priorität', 'description' => 'Verteilung (Chart)', 'defaultW' => 3, 'defaultH' => 2, 'demoData' => ['high' => 2, 'medium' => 3, 'low' => 2]],
            ['key' => 'tickets-by-category', 'title' => 'Tickets nach Kategorie', 'description' => 'Verteilung (Chart)', 'defaultW' => 3, 'defaultH' => 2, 'demoData' => ['support' => 4, 'billing' => 2, 'technical' => 1]],
            ['key' => 'recent-tickets', 'title' => 'Letzte Tickets', 'description' => 'Neueste Support-Tickets', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['items' => [['id' => 1, 'subject' => 'Demo Ticket', 'priority' => 'medium', 'created_at' => '03.03.2026']]]],
            ['key' => 'tickets-created-chart', 'title' => 'Tickets pro Tag', 'description' => 'Neue Tickets (Chart)', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['labels' => ['Mo', 'Di', 'Mi', 'Do', 'Fr'], 'values' => [3, 5, 2, 4, 6]]],
            ['key' => 'failed-jobs', 'title' => 'Fehlgeschlagene Jobs', 'description' => 'Anzahl und Link', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 0]],
            ['key' => 'waiting-jobs', 'title' => 'Wartende Jobs', 'description' => 'Queue-Größe', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 12]],
            ['key' => 'cron-last-run', 'title' => 'Cron letzter Lauf', 'description' => 'Scheduler zuletzt ausgeführt', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['lastRunAt' => '2026-03-02 14:30:00']],
            ['key' => 'cron-daily-stats-chart', 'title' => 'Cron-Statistik', 'description' => 'Invoices, Services, Tickets pro Tag', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['labels' => ['01.03', '02.03', '03.03'], 'invoices' => [5, 8, 3], 'services' => [2, 4, 1], 'tickets' => [1, 2, 3]]],
            ['key' => 'recent-activity', 'title' => 'Letzte Aktivitäten', 'description' => 'Admin-Activity-Log', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['items' => [['action' => 'updated', 'model_type' => 'Invoice', 'created_at' => '03.03.2026 10:00']]]],
            ['key' => 'game-server-accounts', 'title' => 'Game-Server Accounts', 'description' => 'Anzahl Gaming-Accounts', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 24]],
            ['key' => 'game-servers-pending', 'title' => 'Pending Provisioning', 'description' => 'Game-Server in Bereitstellung', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 0]],
            ['key' => 'webspace-accounts', 'title' => 'Webspace-Accounts', 'description' => 'Anzahl Webspace-Accounts', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 80]],
            ['key' => 'webspace-pending-plesk', 'title' => 'Webspace Retry', 'description' => 'Accounts mit Plesk-Fehler', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 0]],
            ['key' => 'action-items', 'title' => 'Zu erledigen', 'description' => 'Abos, Rechnungen, Mahnungen', 'defaultW' => 6, 'defaultH' => 3, 'demoData' => ['expiringSubscriptions' => [], 'overdueOrFailedInvoices' => [], 'openDunningInvoices' => []]],
            ['key' => 'global-search', 'title' => 'Globale Suche', 'description' => 'Sites, Kunden, Rechnungen durchsuchen', 'defaultW' => 6, 'defaultH' => 1],
            ['key' => 'recent-items', 'title' => 'Zuletzt angesehen', 'description' => 'Sites und Kunden (localStorage)', 'defaultW' => 4, 'defaultH' => 1],
            ['key' => 'discount-codes-active', 'title' => 'Aktive Rabattcodes', 'description' => 'Anzahl aktiver Codes', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 5]],
            ['key' => 'vouchers-remaining', 'title' => 'Gutscheine', 'description' => 'Verbleibende Gutschein-Werte', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['count' => 10, 'totalValue' => 500.00]],
            ['key' => 'domains-expiring', 'title' => 'Domains Ablauf', 'description' => 'Domains in 30 Tagen ablaufend', 'defaultW' => 4, 'defaultH' => 2, 'demoData' => ['items' => []]],
            ['key' => 'templates-count', 'title' => 'Templates', 'description' => 'Anzahl Templates/Seiten', 'defaultW' => 2, 'defaultH' => 1, 'demoData' => ['templates' => 4, 'pages' => 28]],
        ];

        return $widgets;
    }

    /**
     * Default layout when user has not saved one (grid positions for initial widgets).
     * Positions and heights use 40px row units for finer resize steps.
     *
     * @return array<int, array{i: string, x: int, y: int, w: int, h: int}>
     */
    public static function defaultLayout(): array
    {
        $rows = [
            ['i' => 'global-search', 'x' => 0, 'y' => 0, 'w' => 6, 'h' => 1],
            ['i' => 'recent-items', 'x' => 6, 'y' => 0, 'w' => 6, 'h' => 1],
            ['i' => 'revenue-today', 'x' => 0, 'y' => 1, 'w' => 2, 'h' => 1],
            ['i' => 'revenue-month', 'x' => 2, 'y' => 1, 'w' => 2, 'h' => 1],
            ['i' => 'revenue-year', 'x' => 4, 'y' => 1, 'w' => 2, 'h' => 1],
            ['i' => 'active-subscriptions', 'x' => 6, 'y' => 1, 'w' => 2, 'h' => 1],
            ['i' => 'sites-stats', 'x' => 8, 'y' => 1, 'w' => 3, 'h' => 1],
            ['i' => 'customers-total', 'x' => 11, 'y' => 1, 'w' => 2, 'h' => 1],
            ['i' => 'unpaid-overdue', 'x' => 0, 'y' => 2, 'w' => 3, 'h' => 1],
            ['i' => 'subscriptions-ending-week', 'x' => 3, 'y' => 2, 'w' => 2, 'h' => 1],
            ['i' => 'cancellations-period-end', 'x' => 5, 'y' => 2, 'w' => 2, 'h' => 1],
            ['i' => 'last-stripe-webhook', 'x' => 7, 'y' => 2, 'w' => 2, 'h' => 1],
            ['i' => 'open-tickets', 'x' => 9, 'y' => 2, 'w' => 2, 'h' => 1],
            ['i' => 'failed-jobs', 'x' => 11, 'y' => 2, 'w' => 2, 'h' => 1],
            ['i' => 'action-items', 'x' => 0, 'y' => 3, 'w' => 6, 'h' => 3],
            ['i' => 'revenue-chart-daily', 'x' => 6, 'y' => 3, 'w' => 4, 'h' => 2],
            ['i' => 'recent-invoices', 'x' => 10, 'y' => 3, 'w' => 4, 'h' => 2],
            ['i' => 'expiring-subscriptions', 'x' => 6, 'y' => 5, 'w' => 4, 'h' => 2],
            ['i' => 'overdue-failed-invoices', 'x' => 10, 'y' => 5, 'w' => 4, 'h' => 2],
        ];

        $scale = 2;
        foreach ($rows as &$item) {
            $item['y'] = $item['y'] * $scale;
            $item['h'] = $item['h'] * $scale;
        }

        return $rows;
    }
}
