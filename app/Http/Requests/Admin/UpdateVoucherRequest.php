<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVoucherRequest extends FormRequest
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
        $voucher = $this->route('voucher');

        return [
            'code' => ['required', 'string', 'max:255', Rule::unique('vouchers', 'code')->ignore($voucher->id)],
            'balance' => ['required', 'numeric', 'min:0'],
            'use_type' => ['required', Rule::in(['single_use', 'multi_use'])],
            'user_id' => ['nullable', 'exists:users,id'],
            'is_active' => ['boolean'],
        ];
    }
}
