<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Grace Period (Kulanzfrist)
    |--------------------------------------------------------------------------
    |
    | Number of days after subscription end before the site is permanently
    | deleted. During this period the site is suspended (gesperrt).
    |
    */

    'grace_period_days' => (int) env('BILLING_GRACE_PERIOD_DAYS', 7),

    /*
    |--------------------------------------------------------------------------
    | AI Token Packages (Menge => Preis in EUR)
    |--------------------------------------------------------------------------
    |
    | Preise in EUR. Bei Mollie werden keine Produkt-/Preis-IDs genutzt;
    | der Betrag wird bei Zahlung aus dieser Config übergeben.
    |
    */

    'ai_token_packages' => [
        500 => (float) env('AI_TOKENS_PRICE_500', 5),
        2000 => (float) env('AI_TOKENS_PRICE_2000', 15),
        10000 => (float) env('AI_TOKENS_PRICE_10000', 50),
    ],

    /*
    |--------------------------------------------------------------------------
    | Invoice / Company (Rechnungssteller)
    |--------------------------------------------------------------------------
    |
    | Company details for PDF invoices and §19 UStG text.
    |
    */

    'invoice' => [
        'company_name' => env('INVOICE_COMPANY_NAME', config('app.name')),
        'company_street' => env('INVOICE_COMPANY_STREET', ''),
        'company_postal_code' => env('INVOICE_COMPANY_POSTAL_CODE', ''),
        'company_city' => env('INVOICE_COMPANY_CITY', ''),
        'company_country' => env('INVOICE_COMPANY_COUNTRY', 'DE'),
        'company_vat_id' => env('INVOICE_COMPANY_VAT_ID', null),
        'company_tax_id' => env('INVOICE_COMPANY_TAX_ID', null),
        'company_email' => env('INVOICE_COMPANY_EMAIL', env('MAIL_FROM_ADDRESS', 'rechnung@example.com')),
        'company_phone' => env('INVOICE_COMPANY_PHONE', ''),
        'company_iban' => env('INVOICE_COMPANY_IBAN', ''),
        'company_bic' => env('INVOICE_COMPANY_BIC', ''),
        'company_bank_name' => env('INVOICE_COMPANY_BANK_NAME', ''),
        'ustg_19_text' => 'Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen (Kleinunternehmerregelung).',
    ],

    /*
    |--------------------------------------------------------------------------
    | Dunning Fees (Mahngebühren)
    |--------------------------------------------------------------------------
    |
    | Fee in EUR for 1st, 2nd, 3rd dunning letter. Overridable via Settings.
    |
    */

    'dunning_fee_level_1' => (float) env('BILLING_DUNNING_FEE_LEVEL_1', 0),
    'dunning_fee_level_2' => (float) env('BILLING_DUNNING_FEE_LEVEL_2', 5),
    'dunning_fee_level_3' => (float) env('BILLING_DUNNING_FEE_LEVEL_3', 10),

    /*
    |--------------------------------------------------------------------------
    | Balance Top-Up (Guthaben aufladen)
    |--------------------------------------------------------------------------
    |
    | Minimum amount in EUR for customer self top-up via Mollie Checkout.
    |
    */

    'balance_topup_min_amount' => (float) env('BALANCE_TOPUP_MIN_AMOUNT', 5),

    /*
    |--------------------------------------------------------------------------
    | Balance Period (Guthaben-Zahlung Vertragslaufzeit)
    |--------------------------------------------------------------------------
    |
    | Default contract period in months when a customer pays with balance (Webspace/Gameserver).
    | Can be overridden per brand in Admin → Marken → Prepaid.
    |
    */

    'balance_period_months' => (int) env('BALANCE_PERIOD_MONTHS', 1),

    /*
    |--------------------------------------------------------------------------
    | TeamSpeak Cost per Slot (Admin-Kennzahlen)
    |--------------------------------------------------------------------------
    |
    | Deine monatlichen Kosten pro Slot in EUR für die Gewinnberechnung im
    | Admin (Hosting-Server-Detail bei TeamSpeak-Nodes).
    |
    */

    'teamspeak_cost_per_slot_per_month' => (float) env('TEAMSPEAK_COST_PER_SLOT_PER_MONTH', 0.12),

    /*
    |--------------------------------------------------------------------------
    | Mollie Payment Method Labels (DE)
    |--------------------------------------------------------------------------
    |
    | German labels for Mollie payment method types. Used when displaying
    | active payment methods in the panel.
    |
    */

    'mollie_payment_method_labels' => [
        'ideal' => 'iDEAL',
        'creditcard' => 'Karte',
        'paypal' => 'PayPal',
        'bancontact' => 'Bancontact',
        'sofort' => 'SOFORT',
        'giropay' => 'giropay',
        'eps' => 'EPS',
        'belfius' => 'Belfius',
        'kbc' => 'KBC/CBC',
        'p24' => 'Przelewy24',
        'applepay' => 'Apple Pay',
        'directdebit' => 'SEPA-Lastschrift',
        'klarnapaylater' => 'Klarna Pay Later',
        'klarnasliceit' => 'Klarna Slice It',
        'przelewy24' => 'Przelewy24',
        'blik' => 'BLIK',
        'twint' => 'TWINT',
        'billie' => 'Billie',
        'in3' => 'in3',
    ],

];
