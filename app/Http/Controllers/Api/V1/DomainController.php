<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\CheckDomainAvailabilityRequest;
use App\Models\TldPricelist;
use App\Services\DomainPricingService;
use App\Services\SkrimeApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DomainController extends ApiV1Controller
{
    private const TLDs_PER_PAGE = 15;

    private const OTHER_TLDS_PER_PAGE = 5;

    /**
     * Priority TLDs shown first (in this order), then all others alphabetically.
     *
     * @var list<string>
     */
    private const PRIORITY_TLDS = ['de', 'net', 'com', 'eu', 'at', 'ch'];

    /**
     * List TLDs with prices (create, renew, transfer, sale_price for create).
     * Paginated (15 per page). Priority TLDs (.de, .net, .com, .eu, .at, .ch) appear first.
     */
    public function tlds(Request $request, DomainPricingService $pricing): JsonResponse
    {
        $cases = [];
        foreach (self::PRIORITY_TLDS as $i => $tld) {
            $cases[] = "WHEN '".addslashes($tld)."' THEN ".($i + 1);
        }
        $orderCase = 'CASE tld '.implode(' ', $cases).' ELSE '.(count(self::PRIORITY_TLDS) + 1).' END';
        $query = TldPricelist::query()
            ->orderByRaw("{$orderCase} ASC")
            ->orderBy('tld');

        $paginator = $query->paginate(self::TLDs_PER_PAGE)->withQueryString();

        $data = $paginator->through(function ($row) use ($pricing) {
            $createPrice = (float) $row->create_price;
            $salePrice = $createPrice > 0
                ? $pricing->calculateSalePrice($createPrice, $row->tld)
                : $pricing->getSalePrice($row->tld, 'create');

            return [
                'tld' => $row->tld,
                'create_price' => round((float) $row->create_price, 2),
                'renew_price' => round((float) $row->renew_price, 2),
                'transfer_price' => round((float) $row->transfer_price, 2),
                'restore_price' => round((float) $row->restore_price, 2),
                'sale_price' => round($salePrice, 2),
            ];
        });

        return response()->json([
            'data' => $data->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
        ]);
    }

    /**
     * Check domain availability: searched domain (if name.tld) first, then .de/.net/.com/.eu/.at/.ch, then other TLDs paginated (5 per page).
     */
    public function checkAvailability(CheckDomainAvailabilityRequest $request, SkrimeApiService $skrime, DomainPricingService $pricing): JsonResponse
    {
        $input = strtolower(trim($request->input('domain')));
        $baseName = $input;
        $searchedTld = null;
        if (str_contains($input, '.')) {
            $pos = strrpos($input, '.');
            $baseName = substr($input, 0, $pos);
            $searchedTld = substr($input, $pos + 1);
        }

        $checkOne = function (string $domain, string $tld) use ($skrime, $pricing): array {
            try {
                $check = $skrime->checkAvailability($domain);
                $pricingInfo = $pricing->getPricingForTld($tld, 'create');

                return [
                    'domain' => $domain,
                    'available' => $check['available'],
                    'premium' => $check['premium'] ?? false,
                    'sale_price' => $pricingInfo['sale_price'],
                    'purchase_price' => $pricingInfo['purchase_price'],
                ];
            } catch (\Throwable) {
                return [
                    'domain' => $domain,
                    'available' => false,
                    'premium' => false,
                    'sale_price' => 0,
                    'purchase_price' => 0,
                    'error' => true,
                ];
            }
        };

        $searchedDomain = null;
        if ($searchedTld !== null && $searchedTld !== '') {
            $searchedDomain = $checkOne($baseName.'.'.$searchedTld, $searchedTld);
        }

        $allTlds = $this->getOrderedTldList();
        $priorityTlds = array_values(array_intersect(self::PRIORITY_TLDS, $allTlds));
        $otherTlds = array_values(array_diff($allTlds, self::PRIORITY_TLDS));

        $page = max(1, (int) $request->input('page', 1));
        $otherPage = array_slice($otherTlds, ($page - 1) * self::OTHER_TLDS_PER_PAGE, self::OTHER_TLDS_PER_PAGE);
        $totalOther = count($otherTlds);
        $lastPage = $totalOther > 0 ? (int) ceil($totalOther / self::OTHER_TLDS_PER_PAGE) : 1;

        $priorityResults = [];
        foreach ($priorityTlds as $tld) {
            $priorityResults[] = $checkOne($baseName.'.'.$tld, $tld);
        }

        $otherResults = [];
        foreach ($otherPage as $tld) {
            $otherResults[] = $checkOne($baseName.'.'.$tld, $tld);
        }

        $path = $request->url();
        $query = $request->query();
        $query['domain'] = $request->input('domain');

        $otherLinks = [
            'first' => $path.'?'.http_build_query(array_merge($query, ['page' => 1])),
            'last' => $path.'?'.http_build_query(array_merge($query, ['page' => $lastPage])),
            'prev' => $page > 1 ? $path.'?'.http_build_query(array_merge($query, ['page' => $page - 1])) : null,
            'next' => $page < $lastPage ? $path.'?'.http_build_query(array_merge($query, ['page' => $page + 1])) : null,
        ];

        return response()->json([
            'data' => [
                'searched_domain' => $searchedDomain,
                'priority' => $priorityResults,
                'other' => [
                    'data' => $otherResults,
                    'meta' => [
                        'current_page' => $page,
                        'last_page' => $lastPage,
                        'per_page' => self::OTHER_TLDS_PER_PAGE,
                        'total' => $totalOther,
                        'from' => $totalOther === 0 ? null : ($page - 1) * self::OTHER_TLDS_PER_PAGE + 1,
                        'to' => $totalOther === 0 ? null : min($page * self::OTHER_TLDS_PER_PAGE, $totalOther),
                    ],
                    'links' => $otherLinks,
                ],
            ],
        ]);
    }

    /**
     * @return list<string>
     */
    private function getOrderedTldList(): array
    {
        $cases = [];
        foreach (self::PRIORITY_TLDS as $i => $tld) {
            $cases[] = "WHEN '".addslashes($tld)."' THEN ".($i + 1);
        }
        $orderCase = 'CASE tld '.implode(' ', $cases).' ELSE '.(count(self::PRIORITY_TLDS) + 1).' END';

        return TldPricelist::query()
            ->orderByRaw("{$orderCase} ASC")
            ->orderBy('tld')
            ->pluck('tld')
            ->values()
            ->all();
    }
}
