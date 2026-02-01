<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('assigned_to') && $this->input('assigned_to') === '') {
            $this->merge(['assigned_to' => null]);
        }
        if ($this->has('site_id') && $this->input('site_id') === '') {
            $this->merge(['site_id' => null]);
        }
        if ($this->has('ticket_priority_id') && $this->input('ticket_priority_id') === '') {
            $this->merge(['ticket_priority_id' => null]);
        }
        if ($this->has('due_at') && $this->input('due_at') === '') {
            $this->merge(['due_at' => null]);
        }
        if ($this->has('tag_ids') && ! is_array($this->input('tag_ids'))) {
            $this->merge(['tag_ids' => []]);
        }
    }

    /**
     * @return array<string, array<int, string|\Illuminate\Validation\ValidationRule>>
     */
    public function rules(): array
    {
        $ticket = $this->route('ticket');
        $allowedSiteIds = $ticket?->user?->sites()->pluck('id')->all() ?? [];

        return [
            'status' => ['sometimes', Rule::in(['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'])],
            'ticket_category_id' => ['sometimes', 'exists:ticket_categories,id'],
            'ticket_priority_id' => ['nullable', 'exists:ticket_priorities,id'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'site_id' => ['nullable', Rule::in($allowedSiteIds)],
            'due_at' => ['nullable', 'date'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
