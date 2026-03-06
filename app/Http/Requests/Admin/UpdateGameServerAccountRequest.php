<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGameServerAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('game_server_account')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('current_period_ends_at') && $this->input('current_period_ends_at') === '') {
            $this->merge(['current_period_ends_at' => null]);
        }
        if ($this->has('custom_monthly_price') && $this->input('custom_monthly_price') === '') {
            $this->merge(['custom_monthly_price' => null]);
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:active,suspended,pending'],
            'current_period_ends_at' => ['nullable', 'date'],
            'custom_monthly_price' => ['nullable', 'numeric', 'min:0'],
            'option_values' => ['nullable', 'array'],
            'option_values.memory' => ['nullable', 'integer', 'min:0'],
            'option_values.disk' => ['nullable', 'integer', 'min:0'],
            'option_values.swap' => ['nullable', 'integer', 'min:0'],
            'option_values.io' => ['nullable', 'integer', 'min:0'],
            'option_values.cpu' => ['nullable', 'integer', 'min:0'],
            'option_values.databases' => ['nullable', 'integer', 'min:0'],
            'option_values.backups' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
