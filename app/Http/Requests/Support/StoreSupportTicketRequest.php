<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSupportTicketRequest extends FormRequest
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
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:10000'],
            'ticket_category_id' => ['required', 'exists:ticket_categories,id'],
            'ticket_priority_id' => ['nullable', 'exists:ticket_priorities,id'],
            'site_uuid' => [
                'nullable',
                'string',
                Rule::in($this->user()?->sites()->pluck('uuid')->all() ?? []),
            ],
        ];
    }
}
