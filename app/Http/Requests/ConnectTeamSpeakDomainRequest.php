<?php

namespace App\Http\Requests;

use App\Models\TeamSpeakServerAccount;
use Illuminate\Foundation\Http\FormRequest;

class ConnectTeamSpeakDomainRequest extends FormRequest
{
    public function authorize(): bool
    {
        $teamSpeakServerAccount = $this->route('team_speak_server_account');

        if (! $teamSpeakServerAccount instanceof TeamSpeakServerAccount) {
            return false;
        }

        if ($teamSpeakServerAccount->user_id !== $this->user()?->id) {
            return false;
        }

        $resellerDomainUuid = $this->input('reseller_domain_uuid');
        if (empty($resellerDomainUuid)) {
            return true;
        }

        $domain = $this->user()?->resellerDomains()->where('uuid', $resellerDomainUuid)->first();

        return $domain !== null;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reseller_domain_uuid' => ['required', 'string', 'exists:reseller_domains,uuid'],
            'subdomain' => ['required', 'string', 'max:63', 'regex:/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'subdomain.regex' => 'Die Subdomain darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten.',
        ];
    }
}
