<?php

namespace App\Services;

use App\Models\Domain;
use Illuminate\Support\Facades\Log;

class DnsVerificationService
{
    /**
     * Base domain for CNAME records.
     */
    protected string $baseDomain;

    public function __construct()
    {
        $this->baseDomain = config('domains.base_domain', 'praxishosting.abrendt.de');
    }

    /**
     * Verify CNAME record for a domain.
     *
     * @return array{verified: bool, cname_value: ?string, error: ?string}
     */
    public function verifyCname(Domain $domain): array
    {
        $domainName = $domain->domain;

        try {
            $records = dns_get_record($domainName, DNS_CNAME);

            if (empty($records)) {
                return [
                    'verified' => false,
                    'cname_value' => null,
                    'error' => 'No CNAME record found',
                ];
            }

            foreach ($records as $record) {
                if (isset($record['target'])) {
                    $target = rtrim($record['target'], '.');

                    if ($target === $this->baseDomain) {
                        return [
                            'verified' => true,
                            'cname_value' => $target,
                            'error' => null,
                        ];
                    }
                }
            }

            $cnameValue = $records[0]['target'] ?? null;

            return [
                'verified' => false,
                'cname_value' => $cnameValue ? rtrim($cnameValue, '.') : null,
                'error' => "CNAME points to {$cnameValue}, expected {$this->baseDomain}",
            ];
        } catch (\Exception $e) {
            Log::error('DNS verification failed', [
                'domain' => $domainName,
                'error' => $e->getMessage(),
            ]);

            return [
                'verified' => false,
                'cname_value' => null,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Update verification status for a domain.
     */
    public function updateVerificationStatus(Domain $domain): void
    {
        $result = $this->verifyCname($domain);

        $domain->update([
            'is_verified' => $result['verified'],
        ]);
    }

    /**
     * Get CNAME configuration instructions.
     */
    public function getCnameInstructions(string $domain): array
    {
        return [
            'type' => 'CNAME',
            'name' => $domain,
            'value' => $this->baseDomain,
            'ttl' => 3600,
        ];
    }
}
