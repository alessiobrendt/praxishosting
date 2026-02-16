<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Easy DNS Presets
    |--------------------------------------------------------------------------
    |
    | Konfigurierbare Vorlagen für den Easy-DNS-Dialog. Jeder Eintrag erscheint
    | als Karte im Modal. Du kannst Presets hinzufügen, entfernen oder anpassen.
    |
    | - id: Eindeutiger Schlüssel (z. B. "website", "mx")
    | - label: Überschrift der Karte
    | - button_label: Text des Buttons (optional; bei null wird ein Default genutzt)
    | - fields: Eingabefelder (key, label, type: text|number, placeholder?, default?)
    | - records: DNS-Einträge die erzeugt werden:
    |   - name: Fester Name (z. B. "@") oder name_key: Feld-Key für den Namen
    |   - type: DNS-Typ (A, AAAA, MX, CNAME, …)
    |   - data_key: Ein Feld-Key dessen Wert als data genutzt wird
    |   - data_template: Oder Template "{{priority}} {{server}}" (Platzhalter = Feld-Key)
    |
    */

    'presets' => [
        'website' => [
            'label' => 'Website verknüpfen',
            'button_label' => null,
            'fields' => [
                [
                    'key' => 'ip',
                    'label' => 'IP-Adresse',
                    'type' => 'text',
                    'placeholder' => 'IPv4 oder IPv6',
                ],
            ],
            'records' => [
                [
                    'name' => '@',
                    'type' => 'A',
                    'data_key' => 'ip',
                ],
            ],
        ],

        'mx' => [
            'label' => 'E-Mail Server (MX)',
            'button_label' => 'MX-Eintrag erstellen',
            'fields' => [
                [
                    'key' => 'server',
                    'label' => 'Mail-Server',
                    'type' => 'text',
                    'placeholder' => 'z. B. mail.example.com',
                ],
                [
                    'key' => 'priority',
                    'label' => 'Priorität',
                    'type' => 'number',
                    'placeholder' => '10',
                    'default' => 10,
                ],
            ],
            'records' => [
                [
                    'name' => '@',
                    'type' => 'MX',
                    'data_template' => '{{priority}} {{server}}',
                ],
            ],
        ],

        'subdomain' => [
            'label' => 'Subdomain weiterleiten',
            'button_label' => 'CNAME erstellen',
            'fields' => [
                [
                    'key' => 'subdomain',
                    'label' => 'Subdomain',
                    'type' => 'text',
                    'placeholder' => 'z. B. www',
                ],
                [
                    'key' => 'target',
                    'label' => 'Ziel',
                    'type' => 'text',
                    'placeholder' => 'Ziel-Domain',
                ],
            ],
            'records' => [
                [
                    'name_template' => '{{subdomain}}.{{domain}}',
                    'type' => 'CNAME',
                    'data_key' => 'target',
                ],
            ],
        ],
    ],

];
