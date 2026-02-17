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
    | Default Stripe Price ID (Meine Seiten)
    |--------------------------------------------------------------------------
    |
    | Fallback Stripe Price ID when no product is configured in the panel.
    | Prices are managed centrally in the Admin Panel / DB.
    |
    */

    'default_meine_seiten_price_id' => env('STRIPE_MEINE_SEITEN_PRICE_ID'),

    /*
    |--------------------------------------------------------------------------
    | Stripe Product ID (Meine Seiten)
    |--------------------------------------------------------------------------
    |
    | One Stripe Product under which template prices are created as Stripe
    | Prices. Required for Option 2 (sync template price -> Stripe Price).
    |
    */

    'stripe_meine_seiten_product_id' => env('STRIPE_MEINE_SEITEN_PRODUCT_ID'),

    /*
    |--------------------------------------------------------------------------
    | Additional Domain Price ID
    |--------------------------------------------------------------------------
    |
    | Stripe Price ID for additional domains (Zusatzdomain).
    |
    */

    'additional_domain_price_id' => env('STRIPE_ADDITIONAL_DOMAIN_PRICE_ID'),

    /*
    |--------------------------------------------------------------------------
    | Custom Domain (Bring-your-own) Price ID
    |--------------------------------------------------------------------------
    |
    | Stripe Price ID for custom domain add-on.
    |
    */

    'custom_domain_price_id' => env('STRIPE_CUSTOM_DOMAIN_PRICE_ID'),

    /*
    |--------------------------------------------------------------------------
    | AI Token Packages (Menge => Preis in EUR)
    |--------------------------------------------------------------------------
    |
    | Ein Stripe-Produkt (z. B. "AI Tokens") in Stripe anlegen und die
    | Produkt-ID (prod_…) in .env als STRIPE_AI_TOKENS_PRODUCT_ID eintragen.
    | Beim ersten Checkout werden die Einmalpreise automatisch in Stripe
    | angelegt. Preise hier in EUR angeben (z. B. 5 für 5 €).
    |
    */

    'stripe_ai_tokens_product_id' => env('STRIPE_AI_TOKENS_PRODUCT_ID'),

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

];
