<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderConfirmationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->quote_id === '' || $this->quote_id === null) {
            $this->merge(['quote_id' => null]);
        }
    }

    /**
     * @return array<string, array<int, string|\Illuminate\Validation\ValidationRule>>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'quote_id' => ['nullable', 'exists:quotes,id'],
            'order_date' => ['required', 'date'],
            'line_items' => ['required', 'array', 'min:1'],
            'line_items.*.position' => ['required', 'integer', 'min:1'],
            'line_items.*.description' => ['required', 'string', 'max:1000'],
            'line_items.*.quantity' => ['required', 'numeric', 'min:0.001'],
            'line_items.*.unit' => ['nullable', 'string', 'max:20'],
            'line_items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'line_items.*.amount' => ['required', 'numeric', 'min:0'],
        ];
    }
}
