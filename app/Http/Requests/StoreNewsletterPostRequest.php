<?php

namespace App\Http\Requests;

use App\Models\Site;
use Illuminate\Foundation\Http\FormRequest;

class StoreNewsletterPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $site = $this->route('site');
        if (! $site instanceof Site) {
            return false;
        }

        return $this->user()?->can('view', $site) ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'action' => ['required', 'in:save_draft,send'],
        ];
    }
}
