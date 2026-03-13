<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Domain connection service types
    |--------------------------------------------------------------------------
    |
    | Defines how each product type supports "connect domain": either by
    | automatically creating an SRV record (Skrime DNS) or by showing a
    | bind zone for the user to configure at their registrar.
    |
    */

    'services' => [
        'gameserver' => [
            'label' => 'Gameserver',
            'record_type' => 'srv',
            // srv_service and srv_protocol come from PterodactylEggConfig per egg
            'srv_service_from' => 'egg_config',
            'srv_protocol_from' => 'egg_config',
            'priority' => 0,
            'weight' => 5,
            'port_from' => 'pterodactyl',
            'target_from' => 'pterodactyl',
        ],

        'teamspeak' => [
            'label' => 'TeamSpeak',
            'record_type' => 'srv',
            'srv_service' => '_ts3',
            'srv_protocol' => '_udp',
            'priority' => 0,
            'weight' => 5,
            'port_from' => 'account',
            'target_from' => 'hosting_server',
        ],

        'webspace' => [
            'label' => 'Webspace',
            'record_type' => 'bind',
            'bind_from' => 'hosting_server',
        ],
    ],
];
