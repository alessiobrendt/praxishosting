<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHostingServerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('port') && $this->input('port') === '') {
            $this->merge(['port' => null]);
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'panel_type' => ['required', 'string', 'in:plesk,pterodactyl,teamspeak'],
            'config' => ['nullable', 'array'],
            'name' => ['nullable', 'string', 'max:255'],
            'hostname' => ['required_unless:panel_type,teamspeak', 'nullable', 'string', 'max:255'],
            'port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'use_ssl' => ['boolean'],
            'ip_address' => ['nullable', 'string', 'max:45'],
            'api_token' => ['nullable', 'string'],
            'api_username' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ];
        if ($this->input('panel_type') === 'pterodactyl') {
            $rules['config.base_uri'] = ['nullable', 'string', 'max:500'];
            $rules['config.api_key'] = ['nullable', 'string'];
            $rules['config.client_api_key'] = ['nullable', 'string'];
        }
        if ($this->input('panel_type') === 'teamspeak') {
            $rules['config.host'] = ['required', 'string', 'max:255'];
            $rules['config.query_port'] = ['required', 'integer', 'min:1', 'max:65535'];
            $rules['config.username'] = ['required', 'string', 'max:255'];
            $rules['config.password'] = ['nullable', 'string'];
            $rules['config.port_range_min'] = ['required', 'integer', 'min:1', 'max:65535'];
            $rules['config.port_range_max'] = ['required', 'integer', 'min:1', 'max:65535', 'gte:config.port_range_min'];
        }

        return $rules;
    }
}
