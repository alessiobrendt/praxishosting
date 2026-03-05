<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamSpeakAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('team_speak_server_account')) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('port') && $this->input('port') === '') {
            $this->merge(['port' => null]);
        }
        if ($this->has('current_period_ends_at') && $this->input('current_period_ends_at') === '') {
            $this->merge(['current_period_ends_at' => null]);
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'slots' => ['required', 'integer', 'min:1', 'max:9999'],
            'current_period_ends_at' => ['nullable', 'date'],
            'status' => ['required', 'string', 'in:active,suspended,pending'],
        ];
    }
}
