<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTemplateRequest extends FormRequest
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
        // Handle page_data - merge all nested data into page_data
        $pageData = [];
        
        // Collect all data that should go into page_data
        $allData = $this->except(['name', 'slug', 'price', 'is_active', 'preview_image', '_token', '_method']);
        
        foreach ($allData as $key => $value) {
            // Handle nested arrays like colors[primary], site[title], etc.
            if (str_contains($key, '[')) {
                // Parse nested keys like "colors[primary]" or "site[title]"
                preg_match('/^([^[]+)\[(.+)\]$/', $key, $matches);
                if (count($matches) === 3) {
                    $parentKey = $matches[1];
                    $childKey = $matches[2];
                    
                    if (!isset($pageData[$parentKey])) {
                        $pageData[$parentKey] = [];
                    }
                    $pageData[$parentKey][$childKey] = $value;
                }
            } else {
                // Direct keys
                if (is_string($value)) {
                    // Try to decode JSON strings
                    $decoded = json_decode($value, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $pageData[$key] = $decoded;
                    } else {
                        $pageData[$key] = $value;
                    }
                } else {
                    $pageData[$key] = $value;
                }
            }
        }
        
        if (!empty($pageData)) {
            $this->merge(['page_data' => $pageData]);
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:templates,slug'],
            'page_data' => ['nullable', 'array'],
            'page_data.*' => ['nullable'],
            'preview_image' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
            'price' => ['numeric', 'min:0'],
        ];
    }
}
