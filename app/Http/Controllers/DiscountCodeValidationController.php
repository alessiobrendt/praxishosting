<?php

namespace App\Http\Controllers;

use App\Services\DiscountCodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DiscountCodeValidationController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'period_months' => ['nullable', 'integer', 'min:1', 'max:120'],
        ]);

        $service = app(DiscountCodeService::class);
        $result = $service->validateForCheckout(
            trim((string) $request->input('code')),
            (float) $request->input('amount'),
            (int) ($request->input('period_months') ?? 1),
        );

        if ($result === null) {
            return response()->json(['valid' => false, 'message' => 'Ungültige Anfrage.'], 400);
        }

        return response()->json($result);
    }
}
