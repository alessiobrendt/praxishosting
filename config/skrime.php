<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Skrime API Base URL
    |--------------------------------------------------------------------------
    */
    'base_url' => env('SKRIME_API_URL', 'https://skrime.eu/api'),

    /*
    |--------------------------------------------------------------------------
    | Skrime API Token
    |--------------------------------------------------------------------------
    */
    'api_key' => env('SKRIME_API_TOKEN'),

    /*
    |--------------------------------------------------------------------------
    | Request Timeout (seconds)
    |--------------------------------------------------------------------------
    */
    'timeout' => (int) env('SKRIME_API_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Default Nameservers (used when ordering domains)
    |--------------------------------------------------------------------------
    */
    'default_nameservers' => [
        'nameserver01.eu',
        'nameserver02.eu',
        'nameserver03.eu',
        'nameserver04.eu',
        'nameserver05.eu',
        'nameserver06.eu',
    ],

    /*
    |--------------------------------------------------------------------------
    | Margin for Reseller Pricing
    |--------------------------------------------------------------------------
    | margin_type: 'fixed' = add X EUR per domain, 'percent' = add X% to purchase price
    | margin_value: amount in EUR or percentage (e.g. 2 or 15)
    | Per-TLD overrides can be added under 'tlds' (e.g. 'de' => ['margin_type' => 'fixed', 'margin_value' => 2])
    */
    'margin_type' => env('SKRIME_MARGIN_TYPE', 'fixed'),
    'margin_value' => (float) env('SKRIME_MARGIN_VALUE', 2),
    'tlds' => [],
];
