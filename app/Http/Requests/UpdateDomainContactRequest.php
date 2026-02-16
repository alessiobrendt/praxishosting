<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDomainContactRequest extends FormRequest
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
            'contact' => ['required', 'array'],
            'contact.firstname' => ['required', 'string', 'max:255'],
            'contact.lastname' => ['required', 'string', 'max:255'],
            'contact.street' => ['required', 'string', 'max:255'],
            'contact.number' => ['required', 'string', 'max:20'],
            'contact.postcode' => ['required', 'string', 'max:20'],
            'contact.city' => ['required', 'string', 'max:255'],
            'contact.state' => ['required', 'string', 'max:255'],
            'contact.country' => ['required', 'string', 'size:2'],
            'contact.email' => ['required', 'email'],
            'contact.phone' => ['required', 'string', 'max:50'],
            'contact.company' => ['nullable', 'string', 'max:255'],
        ];
    }
}
