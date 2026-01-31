<?php

return [

    /*
    |--------------------------------------------------------------------------
    | PIN Configuration
    |--------------------------------------------------------------------------
    */

    'pin' => [
        'max_attempts' => (int) env('PIN_MAX_ATTEMPTS', 5),
        'lockout_minutes' => (int) env('PIN_LOCKOUT_MINUTES', 15),
    ],

    /*
    |--------------------------------------------------------------------------
    | Inactivity Lock Default
    |--------------------------------------------------------------------------
    */

    'inactivity_lock_default_minutes' => (int) env('INACTIVITY_LOCK_DEFAULT_MINUTES', 0),

];
