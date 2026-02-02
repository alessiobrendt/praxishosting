<?php

namespace App\Http\Requests;

use App\Modules\ModuleRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ModuleSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string|\Illuminate\Validation\ValidationRule>>
     */
    public function rules(): array
    {
        return [
            'module_type' => ['required', 'string', Rule::in(ModuleRegistry::getRegisteredTypes())],
            'module_instance_id' => ['nullable', 'string', 'max:255'],
            'module_config' => ['nullable', 'array'],
            'data' => ['required', 'array'],
            'honeypot' => ['nullable', 'string', 'max:0'],
        ];
    }
}
