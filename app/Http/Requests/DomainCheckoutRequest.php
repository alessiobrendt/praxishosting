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
            'transfer' => ['sometimes', 'boolean'],
            'auth_code' => ['required_if:transfer,true', 'string', 'min:1', 'max:255'],
            'use_profile_contact' => ['required', 'boolean'],
            'payment_method' => ['nullable', 'string', 'in:mollie,balance'],
            'discount_code' => ['nullable', 'string', 'max:255'],
            'accept_tos' => ['required', 'accepted'],
            'accept_early_execution' => ['required', 'accepted'],
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

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'accept_tos.accepted' => 'Bitte bestätigen Sie die AGB und Datenschutzerklärung.',
            'accept_early_execution.accepted' => 'Bitte bestätigen Sie den Widerrufsverzicht.',
            'auth_code.required_if' => 'Für einen Domain-Transfer ist der Auth-Code (EPP-Code) erforderlich.',
        ];
    }
}
