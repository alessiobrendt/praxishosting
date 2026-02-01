<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVoucherRequest extends FormRequest
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
            'code' => ['nullable', 'string', 'max:255', 'unique:vouchers,code'],
            'balance' => ['required', 'numeric', 'min:0'],
            'use_type' => ['required', Rule::in(['single_use', 'multi_use'])],
            'user_id' => ['nullable', 'exists:users,id'],
            'is_active' => ['boolean'],
        ];
    }
}
