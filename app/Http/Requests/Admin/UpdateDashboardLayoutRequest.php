<?php

namespace App\Http\Requests\Admin;

use App\Services\DashboardWidgetRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDashboardLayoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'layout' => ['required', 'array'],
            'layout.*.i' => ['required', 'string', Rule::in(DashboardWidgetRegistry::keys())],
            'layout.*.x' => ['required', 'integer', 'min:0'],
            'layout.*.y' => ['required', 'integer', 'min:0'],
            'layout.*.w' => ['required', 'integer', 'min:1'],
            'layout.*.h' => ['required', 'integer', 'min:1'],
        ];
    }
}
