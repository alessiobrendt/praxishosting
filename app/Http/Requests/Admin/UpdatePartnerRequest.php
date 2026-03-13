<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePartnerRequest extends FormRequest
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
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'image' => ['nullable', 'image', 'max:2048'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'discount_percent' => ['required', 'numeric', 'min:0', 'max:100'],
            'expires_at' => ['nullable', 'date'],
            'is_active' => ['boolean'],
        ];
    }
}
