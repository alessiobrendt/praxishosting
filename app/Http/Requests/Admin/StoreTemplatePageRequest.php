<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTemplatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('data') && is_string($this->data)) {
            $decoded = json_decode($this->data, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->merge(['data' => $decoded]);
            } else {
                $this->merge(['data' => null]);
            }
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $template = $this->route('template');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('template_pages', 'slug')->where('template_id', $template->id),
            ],
            'order' => ['integer', 'min:0'],
            'data' => ['nullable', 'array'],
        ];
    }
}
