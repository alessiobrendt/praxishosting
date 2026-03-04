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
        $ticket = $this->route('ticket');

        $all = $this->all();
        if ($ticket && (empty($all) || (! array_key_exists('status', $all) && ! array_key_exists('ticket_category_id', $all)))) {
            $content = $this->getContent();
            if ($content !== null && $content !== '') {
                $decoded = json_decode($content, true);
                if (is_array($decoded)) {
                    unset($decoded['_method']);
                    $this->merge($decoded);
                }
            }
        }

        $merge = [];
        if ($ticket) {
            if (! $this->has('status')) {
                $merge['status'] = $ticket->status;
            }
            if (! $this->has('ticket_category_id')) {
                $merge['ticket_category_id'] = $ticket->ticket_category_id;
            }
            if (! $this->has('ticket_priority_id')) {
                $merge['ticket_priority_id'] = $ticket->ticket_priority_id;
            }
            if (! $this->has('assigned_to')) {
                $merge['assigned_to'] = $ticket->assigned_to;
            }
            if (! $this->has('site_uuid')) {
                $merge['site_uuid'] = $ticket->site_id ? $ticket->site?->uuid : null;
            }
        }
        if ($merge !== []) {
            $this->merge($merge);
        }
        if ($this->has('assigned_to') && $this->input('assigned_to') === '') {
            $this->merge(['assigned_to' => null]);
        }
        if ($this->has('site_uuid') && $this->input('site_uuid') === '') {
            $this->merge(['site_uuid' => null]);
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
        $allowedSiteUuids = $ticket?->user?->sites()->pluck('uuid')->all() ?? [];

        return [
            'status' => ['required', Rule::in(['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'])],
            'ticket_category_id' => ['required', 'exists:ticket_categories,id'],
            'ticket_priority_id' => ['nullable', 'exists:ticket_priorities,id'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'site_uuid' => ['nullable', 'string', Rule::in($allowedSiteUuids)],
            'due_at' => ['nullable', 'date'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
