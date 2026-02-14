<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class GenerateTextRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    /**
     * @return array<string, array<int, string|\Illuminate\Validation\ValidationRule>>
     */
    public function rules(): array
    {
        return [
            'prompt' => ['nullable', 'string', 'max:2000'],
            'context' => ['required', 'string', 'max:20000'],
            'prompt_template' => ['required', 'string', 'in:expand,shorten,professional,ad_copy'],
            'page_name' => ['nullable', 'string', 'max:255'],
            'block_type' => ['nullable', 'string', 'max:255'],
            'field_type' => ['nullable', 'string', 'max:100'],
        ];
    }
}
