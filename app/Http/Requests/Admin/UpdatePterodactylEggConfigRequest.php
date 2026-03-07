<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePterodactylEggConfigRequest extends FormRequest
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
        return [
            'config' => ['nullable', 'array'],
            'config.variable_defaults' => ['nullable', 'array'],
            'config.variable_defaults.*' => ['nullable', 'string'],
            'config.required_env_variables' => ['nullable', 'array'],
            'config.required_env_variables.*' => ['string', 'max:255'],
            'config.subdomain_srv_protocol' => ['nullable', 'string', 'max:64'],
            'config.subdomain_protocol_type' => ['nullable', 'string', 'in:none,tcp,udp,tls'],
        ];
    }
}
