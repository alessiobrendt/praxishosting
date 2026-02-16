<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DomainCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $rules = [
            'domain' => ['required', 'string', 'max:253'],
            'sale_price' => ['required', 'numeric', 'min:0'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'tld' => ['nullable', 'string', 'max:20'],
            'use_profile_contact' => ['required', 'boolean'],
        ];
        if (! $this->boolean('use_profile_contact')) {
            $rules['contact'] = ['required', 'array'];
            $rules['contact.firstname'] = ['required', 'string', 'max:255'];
            $rules['contact.lastname'] = ['required', 'string', 'max:255'];
            $rules['contact.street'] = ['required', 'string', 'max:255'];
            $rules['contact.number'] = ['required', 'string', 'max:20'];
            $rules['contact.postcode'] = ['required', 'string', 'max:20'];
            $rules['contact.city'] = ['required', 'string', 'max:255'];
            $rules['contact.state'] = ['required', 'string', 'min:1', 'max:255'];
            $rules['contact.country'] = ['required', 'string', 'size:2'];
            $rules['contact.email'] = ['required', 'email'];
            $rules['contact.phone'] = ['required', 'string', 'min:1', 'max:50'];
            $rules['contact.company'] = ['nullable', 'string', 'max:255'];
        }

        return $rules;
    }
}
