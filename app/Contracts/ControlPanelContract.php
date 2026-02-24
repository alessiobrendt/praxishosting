<?php

namespace App\Contracts;

use App\Models\HostingServer;

interface ControlPanelContract
{
    public function setServer(HostingServer $server): void;

    /**
     * Create an account (webspace or game server) on the panel.
     * Parameters are implementation-specific (e.g. Plesk: username, domain, package, password; Pterodactyl: user + server creation).
     *
     * @param  array<string, mixed>  $params
     */
    public function createAccount(array $params): bool;

    /**
     * Return a URL the customer can use to access the panel (e.g. Plesk session URL or Pterodactyl server link).
     *
     * @param  array<string, mixed>  $params
     */
    public function getLoginUrl(array $params): ?string;
}
