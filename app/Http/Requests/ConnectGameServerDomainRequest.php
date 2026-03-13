<?php

namespace App\Http\Requests;

use App\Models\GameServerAccount;
use Illuminate\Foundation\Http\FormRequest;

class ConnectGameServerDomainRequest extends FormRequest
{
    public function authorize(): bool
    {
        $gameServerAccount = $this->route('game_server_account');

        if (! $gameServerAccount instanceof GameServerAccount) {
            return false;
        }

        if ($gameServerAccount->user_id !== $this->user()?->id) {
            return false;
        }

        if (! $gameServerAccount->isCloudAccount()) {
            return false;
        }

        $allocation = is_array($gameServerAccount->allocation) ? $gameServerAccount->allocation : [];
        if (empty($allocation['subdomain'])) {
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
