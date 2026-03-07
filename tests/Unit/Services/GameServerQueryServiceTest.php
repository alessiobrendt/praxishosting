<?php

use App\Services\GameServerQueryService;

test('query returns null when gameq_type is empty', function () {
    $service = app(GameServerQueryService::class);
    expect($service->query('127.0.0.1', 27015, ''))->toBeNull();
});

test('getSupportedTypes returns non-empty list with empty option and game types', function () {
    $types = GameServerQueryService::getSupportedTypes();
    expect($types)->toBeArray();
    expect($types)->toHaveKey('');
    expect($types[''])->toBe('— Keine Spieler-Anzeige');
    expect($types)->toHaveKey('csgo');
    expect($types)->toHaveKey('fivem');
    expect($types['fivem'])->toBe('FiveM (eigene Abfrage)');
});
