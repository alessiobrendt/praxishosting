<?php

namespace App\Http\Requests\Api;

use App\Models\Site;
use Illuminate\Foundation\Http\FormRequest;

class SeoSuggestionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $uuid = $this->input('site_uuid');
        if (! $uuid) {
            return true;
        }
        $site = Site::where('uuid', $uuid)->first();

        return $site && $this->user()?->can('update', $site);
    }

    /**
     * @return array<string, array<int, string|\Illuminate\Validation\ValidationRule>>
     */
    public function rules(): array
    {
        return [
            'site_uuid' => ['required', 'string', 'exists:sites,uuid'],
            'page_slug' => ['required', 'string', 'max:255'],
            'page_title' => ['nullable', 'string', 'max:255'],
            'page_content' => ['nullable', 'string', 'max:50000'],
            'layout_components' => ['nullable', 'array'],
        ];
    }
}
