<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Compiled email templates path
    |--------------------------------------------------------------------------
    |
    | Path to the HTML file(s) built by Maizzle (npm run build in resources/emails).
    | Used by Mailables that send transactional emails with the Maizzle layout.
    |
    */

    'compiled_path' => resource_path('views/emails/compiled/transactional.html'),

    /*
    |--------------------------------------------------------------------------
    | Global email header (HTML)
    |--------------------------------------------------------------------------
    |
    | HTML for the header of all transactional emails (e.g. logo, app name).
    | Replaced into __HEADER__ in the template. If null, a default with app name is used.
    |
    */

    'header' => env('MAILLE_HEADER_HTML'),

    /*
    |--------------------------------------------------------------------------
    | Global email footer (HTML or plain text)
    |--------------------------------------------------------------------------
    |
    | HTML or plain text for the footer of all transactional emails.
    | Replaced into __FOOTER__ in the template. If null, default text with app name is used.
    |
    */

    'footer' => env('MAILLE_FOOTER_HTML'),

];
