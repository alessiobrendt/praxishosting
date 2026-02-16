<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTldPricelistBulkRequest extends FormRequest
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
            'tlds' => ['sometimes', 'array'],
            'tlds.*' => ['string', 'max:32'],
            'margin_type' => ['required', 'string', 'in:fixed,percent'],
            'margin_value' => ['required', 'numeric', 'min:0'],
        ];
    }
}
