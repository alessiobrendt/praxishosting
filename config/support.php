<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Support PIN Secret
    |--------------------------------------------------------------------------
    |
    | Secret used to generate the daily support PIN (user_id + secret + date).
    | Set SUPPORT_PIN_SECRET in .env to a random string. If unset, app key is used.
    |
    */

    'pin_secret' => env('SUPPORT_PIN_SECRET') ?: config('app.key'),

];
