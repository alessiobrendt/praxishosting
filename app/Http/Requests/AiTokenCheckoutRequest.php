<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AiTokenCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, string|\Illuminate\Validation\ValidationRule>>
     */
    public function rules(): array
    {
        $packages = config('billing.ai_token_packages', []);
        $packages = is_array($packages) ? $packages : [];
        $validAmounts = array_keys(array_filter($packages, fn ($price) => $price !== null && $price !== ''));

        if (count($validAmounts) === 0) {
            $validAmounts = [500, 2000, 10000];
        }

        return [
            'token_amount' => ['required', 'integer', 'in:'.implode(',', $validAmounts)],
        ];
    }

    public function messages(): array
    {
        return [
            'token_amount.in' => 'Ungültiges AI-Token-Paket. Bitte wählen Sie ein verfügbares Paket.',
        ];
    }
}
