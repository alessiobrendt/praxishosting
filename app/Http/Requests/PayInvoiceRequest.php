<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->can('view', $this->route('invoice'));
    }

    /**
     * @return array<string, array<int, string|\Illuminate\Validation\ValidationRule>>
     */
    public function rules(): array
    {
        return [
            'payment_method' => ['required', 'string', 'in:stripe,balance'],
        ];
    }
}
