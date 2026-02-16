<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDomainNameserverRequest extends FormRequest
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
            'nameservers' => ['required', 'array', 'min:2', 'max:6'],
            'nameservers.*' => ['required', 'string', 'max:255'],
        ];
    }
}
