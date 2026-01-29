<?php

namespace App\Services;

use App\Models\Domain;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SslCheckService
{
    /**
     * Check SSL certificate status for a domain.
     *
     * @return array{status: string, expires_at: ?Carbon, error: ?string}
     */
    public function checkDomain(Domain $domain): array
    {
        $domainName = $domain->domain;

        try {
            $context = stream_context_create([
                'ssl' => [
                    'capture_peer_cert' => true,
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ]);

            $url = 'https://'.$domainName;
            $result = @file_get_contents($url, false, $context);

            if ($result === false) {
                // Try to get certificate info via stream context
                $socket = @stream_socket_client(
                    'ssl://'.$domainName.':443',
                    $errno,
                    $errstr,
                    10,
                    STREAM_CLIENT_CONNECT,
                    $context
                );

                if ($socket === false) {
                    return [
                        'status' => 'not_configured',
                        'expires_at' => null,
                        'error' => "Could not connect to {$domainName}: {$errstr}",
                    ];
                }

                $cert = stream_context_get_params($socket)['options']['ssl']['peer_certificate'] ?? null;
                @fclose($socket);

                if ($cert === null) {
                    return [
                        'status' => 'not_configured',
                        'expires_at' => null,
                        'error' => 'No certificate found',
                    ];
                }
            } else {
                $cert = stream_context_get_params($context)['options']['ssl']['peer_certificate'] ?? null;
            }

            if ($cert === null) {
                return [
                    'status' => 'not_configured',
                    'expires_at' => null,
                    'error' => 'Could not retrieve certificate',
                ];
            }

            $certInfo = openssl_x509_parse($cert);

            if ($certInfo === false) {
                return [
                    'status' => 'invalid',
                    'expires_at' => null,
                    'error' => 'Could not parse certificate',
                ];
            }

            $validTo = $certInfo['validTo_time_t'] ?? null;

            if ($validTo === null) {
                return [
                    'status' => 'invalid',
                    'expires_at' => null,
                    'error' => 'Could not determine expiration date',
                ];
            }

            $expiresAt = Carbon::createFromTimestamp($validTo);
            $daysUntilExpiry = now()->diffInDays($expiresAt, false);

            if ($daysUntilExpiry < 0) {
                $status = 'invalid';
            } elseif ($daysUntilExpiry < 30) {
                $status = 'expiring_soon';
            } else {
                $status = 'valid';
            }

            return [
                'status' => $status,
                'expires_at' => $expiresAt,
                'error' => null,
            ];
        } catch (\Exception $e) {
            Log::error('SSL check failed', [
                'domain' => $domainName,
                'error' => $e->getMessage(),
            ]);

            return [
                'status' => 'not_configured',
                'expires_at' => null,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Update SSL status for a domain.
     */
    public function updateDomainStatus(Domain $domain): void
    {
        $result = $this->checkDomain($domain);

        $domain->update([
            'ssl_status' => $result['status'],
            'ssl_expires_at' => $result['expires_at'],
            'ssl_checked_at' => now(),
        ]);
    }
}
