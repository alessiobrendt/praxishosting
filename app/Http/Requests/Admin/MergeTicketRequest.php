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
        $currentTicketId = $this->route('ticket')?->id;

        return [
            'target_ticket_id' => [
                'required',
                'integer',
                'exists:tickets,id',
                Rule::not($currentTicketId),
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $tid = $this->input('target_ticket_id');
        if ($tid !== null && $tid !== '') {
            $this->merge(['target_ticket_id' => (int) $tid]);
        }
    }
}
