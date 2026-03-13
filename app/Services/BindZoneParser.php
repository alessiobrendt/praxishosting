<?php

namespace App\Services;

/**
 * Parse BIND zone content into DNS records (name, type, data) for API use.
 * Skips SOA, $ORIGIN, $TTL. Handles A, AAAA, CNAME, NS, MX, TXT, SRV, CAA.
 */
class BindZoneParser
{
    private const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'NS', 'MX', 'TXT', 'SRV', 'CAA', 'ALIAS'];

    /**
     * Parse BIND zone string and return records suitable for Skrime setDns.
     *
     * @return array<int, array{name: string, type: string, data: string}>
     */
    public function parse(string $zoneContent): array
    {
        $records = [];
        $lines = preg_split('/\r\n|\r|\n/', $zoneContent);
        $i = 0;
        $zoneLength = count($lines);

        while ($i < $zoneLength) {
            $line = $lines[$i];
            $trimmed = trim($line);

            if ($trimmed === '' || str_starts_with($trimmed, ';') || str_starts_with($trimmed, '$')) {
                $i++;

                continue;
            }

            if (str_contains($trimmed, ' IN ')) {
                if (preg_match('/^\s*(\S+)\s+(?:\d+\s+)?IN\s+(\S+)\s+(.+)$/s', $line, $m)) {
                    $name = trim($m[1]);
                    $type = strtoupper(trim($m[2]));
                    $data = trim($m[3]);

                    if ($type === 'SOA') {
                        $i++;
                        while ($i < $zoneLength && ! str_contains($lines[$i], ');')) {
                            $i++;
                        }
                        $i++;

                        continue;
                    }

                    if ($type === 'TXT' && str_starts_with($data, '(')) {
                        $data = $this->collectMultilineTxt($lines, $i);
                    }

                    if (in_array($type, self::RECORD_TYPES, true)) {
                        $data = $this->normalizeData($data, $type);
                        if ($data !== '') {
                            $records[] = [
                                'name' => $name === '@' ? '@' : rtrim($name, '.'),
                                'type' => $type,
                                'data' => $data,
                            ];
                        }
                    }
                }
            }

            $i++;
        }

        return $records;
    }

    private function collectMultilineTxt(array $lines, int &$i): string
    {
        $parts = [];
        $line = trim($lines[$i]);
        $line = preg_replace('/^\s*\(\s*/', '', $line);
        $line = preg_replace('/\s*\)\s*;\s*$/', '', $line);
        if ($line !== '') {
            $parts[] = trim($line, '"');
        }
        $i++;
        while ($i < count($lines)) {
            $line = trim($lines[$i]);
            if (str_contains($line, ');')) {
                $line = preg_replace('/\s*\)\s*;\s*$/', '', $line);
                $line = trim(trim($line), '"');
                if ($line !== '') {
                    $parts[] = $line;
                }
                break;
            }
            $parts[] = trim(trim($line), '"');
            $i++;
        }

        return '"'.implode('', $parts).'"';
    }

    private function normalizeData(string $data, string $type): string
    {
        $data = trim($data);
        $data = preg_replace('/\s*;\s*.*$/', '', $data);
        $data = trim($data);

        if ($type === 'TXT' && str_contains($data, '"')) {
            return $data;
        }

        return $data;
    }
}
