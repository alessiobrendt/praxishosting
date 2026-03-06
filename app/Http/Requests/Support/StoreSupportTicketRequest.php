<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSupportTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    /**
     * Service types allowed for the user's brand (only enabled features).
     *
     * @return list<string>
     */
    private function allowedServiceTypes(): array
    {
        $features = $this->user()?->brand?->getFeaturesArray() ?? [];
        $allowed = [];
        if (! empty($features['sites_editor'])) {
            $allowed[] = 'site';
        }
        if (! empty($features['domains_shop'])) {
            $allowed[] = 'reseller_domain';
        }
        if (! empty($features['webspace'])) {
            $allowed[] = 'webspace_account';
        }
        if (! empty($features['gaming'])) {
            $allowed[] = 'game_server_account';
        }
        if (! empty($features['teamspeak'])) {
            $allowed[] = 'teamspeak_server_account';
        }

        return $allowed;
    }

    /**
     * @return array<string, array<int, string|\Illuminate\Validation\ValidationRule>>
     */
    public function rules(): array
    {
        $allowedTypes = $this->allowedServiceTypes();

        return [
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:10000'],
            'ticket_category_id' => ['required', 'exists:ticket_categories,id'],
            'ticket_priority_id' => ['nullable', 'exists:ticket_priorities,id'],
            'affected_services' => ['nullable', 'array'],
            'affected_services.*' => ['required', 'array'],
            'affected_services.*.type' => ['required', 'string', Rule::in($allowedTypes)],
            'affected_services.*.id' => [
                'required',
                'integer',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $user = $this->user();
                    if (! $user) {
                        $fail(__('validation.required'));

                        return;
                    }
                    $index = (int) preg_replace('/^affected_services\.(\d+)\.id$/', '$1', $attribute);
                    $type = $this->input("affected_services.{$index}.type");
                    if (! is_string($type)) {
                        $fail(__('validation.required'));

                        return;
                    }
                    $exists = match ($type) {
                        'site' => $user->sites()->where('id', (int) $value)->exists(),
                        'reseller_domain' => $user->resellerDomains()->where('id', (int) $value)->exists(),
                        'webspace_account' => $user->webspaceAccounts()->where('id', (int) $value)->exists(),
                        'game_server_account' => $user->gameServerAccounts()->where('id', (int) $value)->exists(),
                        'teamspeak_server_account' => $user->teamSpeakServerAccounts()->where('id', (int) $value)->exists(),
                        default => false,
                    };
                    if (! $exists) {
                        $fail(__('validation.exists', ['attribute' => 'affected service']));
                    }
                },
            ],
        ];
    }
}
