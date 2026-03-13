<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MergeTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $currentTicket = $this->route('ticket');

        return [
            'target_ticket_uuid' => [
                'required',
                'string',
                'exists:tickets,uuid',
                Rule::not($currentTicket?->uuid),
            ],
        ];
    }
}
