<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResellerDomainNameserverRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
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
