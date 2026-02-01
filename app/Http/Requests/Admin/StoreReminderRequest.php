<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreReminderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_admin === true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $subjectType = $this->input('subject_type');
        $table = $subjectType ? Str::plural(Str::lower($subjectType)) : 'users';

        return [
            'type' => ['required', 'string', Rule::in(array_keys(\App\Models\Reminder::typeLabels()))],
            'subject_type' => ['required', 'string', Rule::in(['Invoice', 'Site', 'User'])],
            'subject_id' => [
                'required',
                'integer',
                Rule::exists($table, 'id'),
            ],
            'sent_at' => ['required', 'date'],
            'note' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Bitte Art der Erinnerung wählen.',
            'subject_type.required' => 'Bitte Bezug (Rechnung, Site oder Kunde) wählen.',
            'subject_id.required' => 'Bitte ein konkretes Objekt wählen.',
            'subject_id.exists' => 'Das gewählte Objekt existiert nicht.',
            'sent_at.required' => 'Bitte Datum der Kommunikation angeben.',
        ];
    }
}
