<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckDomainAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'domain' => ['required', 'string', 'max:253', 'regex:/^[a-z0-9]([a-z0-9\-]*[a-z0-9])?$/i'],
            'tlds' => ['sometimes', 'array'],
            'tlds.*' => ['string', 'max:20', 'regex:/^[a-z]{2,}$/i'],
        ];
    }
}
