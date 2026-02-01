<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateManualInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, array<int, string|\Illuminate\Validation\ValidationRule>>
     */
    public function rules(): array
    {
        return [
            'invoice_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date', 'after_or_equal:invoice_date'],
            'status' => ['nullable', 'string', 'in:draft,sent'],
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
