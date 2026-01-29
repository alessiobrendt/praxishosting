<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTemplatePageRequest extends FormRequest
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
        // Data should already be an array from the frontend, but handle both cases
        if ($this->has('data')) {
            if (is_string($this->data)) {
                $decoded = json_decode($this->data, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $this->merge(['data' => $decoded]);
                } else {
                    \Log::warning('Failed to decode JSON data', [
                        'data' => substr($this->data, 0, 100),
                        'error' => json_last_error_msg(),
                    ]);
                    $this->merge(['data' => null]);
                }
            }
            // If it's already an array, Laravel will handle it automatically
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $template = $this->route('template');
        $page = $this->route('page');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('template_pages', 'slug')
                    ->where('template_id', $template->id)
                    ->ignore($page->id),
            ],
            'order' => ['integer', 'min:0'],
            'data' => ['nullable', 'array'],
        ];
    }
}
