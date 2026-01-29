<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Main application hosts
    |--------------------------------------------------------------------------
    |
    | Hosts under which the main app (dashboard, login, /site/{slug}) runs.
    | Requests to any other host are treated as site domains and resolved
    | against the domains table (subdomain or custom domain).
    |
    */

    'main_app_hosts' => array_values(array_filter(array_merge(
        [parse_url(config('app.url'), PHP_URL_HOST) ?: 'localhost'],
        array_map('trim', explode(',', env('MAIN_APP_HOSTS', '')))
    ))),

    /*
    |--------------------------------------------------------------------------
    | Domain Base URL
    |--------------------------------------------------------------------------
    |
    | This is the base domain that custom domains should point to via CNAME.
    |
    */

    'base_domain' => env('DOMAIN_BASE', 'praxishosting.abrendt.de'),

    /*
    |--------------------------------------------------------------------------
    | SSL Check Interval
    |--------------------------------------------------------------------------
    |
    | How often SSL certificates should be checked (in hours).
    |
    */

    'ssl_check_interval_hours' => env('SSL_CHECK_INTERVAL_HOURS', 24),

    /*
    |--------------------------------------------------------------------------
    | DNS Check Retry Count
    |--------------------------------------------------------------------------
    |
    | Number of times to retry DNS verification before marking as failed.
    |
    */

    'dns_check_retry_count' => env('DNS_CHECK_RETRY_COUNT', 3),
];
