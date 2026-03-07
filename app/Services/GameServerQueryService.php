<?php

namespace App\Services;

use GameQ\GameQ;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Query game server player count via GameQ (supported games) or custom logic (e.g. FiveM).
 * Always uses the server port (allocation port); no separate query port is used.
 */
class GameServerQueryService
{
    /**
     * Query a game server and return player counts (and optional extra info).
     * Uses the given port (server/allocation port) for the query.
     * Returns null if type is empty, unsupported, or query fails.
     *
     * @param  string  $host  Server host (IP or hostname)
     * @param  int  $port  Server port (allocation port – same as game port)
     * @return array{num_players: int, max_players: int, hostname?: string}|null
     */
    public function query(string $host, int $port, string $gameqType): ?array
    {
        $gameqType = trim(strtolower($gameqType));
        if ($gameqType === '') {
            return null;
        }

        if ($gameqType === 'fivem') {
            return $this->queryFiveM($host, $port);
        }

        return $this->queryWithGameQ($host, $port, $gameqType);
    }

    /**
     * Query using GameQ. Uses server port only (no separate query_port).
     *
     * @return array{num_players: int, max_players: int, hostname?: string}|null
     */
    protected function queryWithGameQ(string $host, int $port, string $type): ?array
    {
        try {
            $gameQ = new GameQ;
            $gameQ->addServer([
                'type' => $type,
                'host' => $host.':'.$port,
            ]);
            $results = $gameQ->process();
            if ($results === []) {
                return null;
            }
            $first = reset($results);
            if (! is_array($first)) {
                return null;
            }
            $numPlayers = (int) ($first['num_players'] ?? $first['numplayers'] ?? $first['gq_num_players'] ?? 0);
            $maxPlayers = (int) ($first['max_players'] ?? $first['maxplayers'] ?? $first['gq_max_players'] ?? 0);
            $hostname = isset($first['hostname']) ? (string) $first['hostname'] : null;

            if ($maxPlayers <= 0) {
                return null;
            }

            return [
                'num_players' => $numPlayers,
                'max_players' => $maxPlayers,
                'hostname' => $hostname,
            ];
        } catch (\Throwable $e) {
            Log::debug('GameServerQueryService GameQ failed', [
                'host' => $host,
                'port' => $port,
                'type' => $type,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * FiveM is not supported by GameQ. Query Cfx.re public API by matching endpoint (ip:port).
     *
     * @return array{num_players: int, max_players: int, hostname?: string}|null
     */
    protected function queryFiveM(string $host, int $port): ?array
    {
        $endpoint = $host.':'.$port;
        try {
            $response = Http::timeout(8)
                ->get('https://servers-live.fivem.net/api/servers/');
            if (! $response->successful()) {
                return null;
            }
            $body = $response->body();
            $items = [];
            $trimmed = trim($body);
            if ($trimmed !== '' && $trimmed[0] === '[') {
                $items = json_decode($body, true);
                $items = is_array($items) ? $items : [];
            } else {
                foreach (explode("\n", $trimmed) as $line) {
                    $line = trim($line);
                    if ($line === '') {
                        continue;
                    }
                    $decoded = json_decode($line, true);
                    if (is_array($decoded)) {
                        $items[] = $decoded;
                    }
                }
            }
            foreach ($items as $data) {
                if (! is_array($data)) {
                    continue;
                }
                $endpoints = $data['EndPoints'] ?? $data['Data']['connectEndPoints'] ?? [];
                if (! is_array($endpoints)) {
                    continue;
                }
                foreach ($endpoints as $ep) {
                    $ep = (string) $ep;
                    if (strpos($ep, $endpoint) !== false || $this->endpointMatches($ep, $host, $port)) {
                        $dataObj = $data['Data'] ?? $data;
                        $clients = (int) ($dataObj['Clients'] ?? $dataObj['clients'] ?? 0);
                        $max = (int) ($dataObj['ServerMaxClients'] ?? $dataObj['sv_maxclients'] ?? 32);
                        $hostname = $dataObj['hostname'] ?? $dataObj['Hostname'] ?? null;

                        $maxPlayers = $max > 0 ? $max : 32;
                        if ($maxPlayers <= 0) {
                            continue;
                        }

                        return [
                            'num_players' => $clients,
                            'max_players' => $maxPlayers,
                            'hostname' => $hostname !== null ? (string) $hostname : null,
                        ];
                    }
                }
            }

            return null;
        } catch (\Throwable $e) {
            Log::debug('GameServerQueryService FiveM API failed', [
                'host' => $host,
                'port' => $port,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    private function endpointMatches(string $ep, string $host, int $port): bool
    {
        if (strpos($ep, ':') !== false) {
            [$h, $p] = explode(':', $ep, 2);

            return (strtolower(trim($h)) === strtolower($host)) && ((int) $p === $port);
        }

        return false;
    }

    /**
     * Return list of game types that can be used in egg config (for admin dropdown).
     *
     * @return array<string, string> keys = internal type, values = label
     */
    public static function getSupportedTypes(): array
    {
        return [
            '' => '— Keine Spieler-Anzeige',
            'csgo' => 'CS:GO / CS2',
            'css' => 'Counter-Strike: Source',
            'minecraft' => 'Minecraft (Java)',
            'rust' => 'Rust',
            'valheim' => 'Valheim',
            'fivem' => 'FiveM (eigene Abfrage)',
            'squad' => 'Squad',
            'teeworlds' => 'Teeworlds',
            'gmod' => 'Garry\'s Mod',
            'l4d2' => 'Left 4 Dead 2',
            'tf2' => 'Team Fortress 2',
            'sevendaystodie' => '7 Days to Die',
            'unturned' => 'Unturned',
            'terraria' => 'Terraria',
            'vrising' => 'V Rising',
            'arkse' => 'ARK: Survival Evolved',
        ];
    }
}
