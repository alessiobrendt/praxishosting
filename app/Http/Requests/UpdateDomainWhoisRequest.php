<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDomainWhoisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('reseller_domain')) ?? false;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'privacy' => ['required', 'array'],
            'privacy.organization' => ['sometimes', 'boolean'],
            'privacy.name' => ['sometimes', 'boolean'],
            'privacy.email' => ['sometimes', 'boolean'],
            'privacy.voice' => ['sometimes', 'boolean'],
            'privacy.addressLine' => ['sometimes', 'boolean'],
            'privacy.city' => ['sometimes', 'boolean'],
            'privacy.postalCode' => ['sometimes', 'boolean'],
        ];
    }
}
