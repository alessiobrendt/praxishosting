<?php

namespace App\Services;

use App\Models\User;

class SkrimeContactService
{
    /**
     * Build contact from user for display/prefill (e.g. checkout form). May contain empty values.
     *
     * @return array{firstname: string, lastname: string, street: string, number: string, postcode: string, city: string, state: string, country: string, email: string, phone: string, company?: string}
     */
    public function fromUserForDisplay(User $user): array
    {
        $nameParts = $this->splitNameForDisplay($user->name ?? '');
        $street = trim((string) ($user->street ?? ''));
        $number = trim((string) ($user->street_number ?? ''));
        if ($number === '') {
            $number = $this->parseStreetNumber($street);
        }
        if ($number !== '') {
            $street = trim(preg_replace('/\s+[\d\w\-]+\s*$/', '', $street) ?? $street);
        }
        $contact = [
            'firstname' => $nameParts['firstname'],
            'lastname' => $nameParts['lastname'],
            'street' => $street,
            'number' => $number,
            'postcode' => trim((string) ($user->postal_code ?? '')),
            'city' => trim((string) ($user->city ?? '')),
            'state' => trim((string) ($user->state ?? '')),
            'country' => trim((string) ($user->country ?? '')) ?: 'DE',
            'email' => trim((string) ($user->email ?? '')),
            'phone' => trim((string) ($user->phone ?? '')),
        ];
        if (trim((string) ($user->company ?? '')) !== '') {
            $contact['company'] = trim((string) $user->company);
        }

        return $contact;
    }

    /**
     * Build Skrime contact array from User (for domain order).
     * All required fields must be non-empty; nothing empty or placeholder may be sent.
     *
     * @return array{firstname: string, lastname: string, street: string, number: string, postcode: string, city: string, state: string, country: string, email: string, phone: string, company?: string}
     */
    public function fromUser(User $user): array
    {
        $nameParts = $this->splitName($user->name);
        $street = trim((string) ($user->street ?? ''));
        $number = trim((string) ($user->street_number ?? ''));
        if ($number === '') {
            $number = $this->parseStreetNumber($street);
        }
        if ($number !== '') {
            $street = trim(preg_replace('/\s+[\d\w\-]+\s*$/', '', $street) ?? $street);
        }

        $this->requireNonEmpty($nameParts['firstname'], 'firstname');
        $this->requireNonEmpty($nameParts['lastname'], 'lastname');
        $this->requireNonEmpty($street, 'street');
        $this->requireNonEmpty($number, 'number');
        $this->requireNonEmpty(trim((string) ($user->postal_code ?? '')), 'postcode');
        $this->requireNonEmpty(trim((string) ($user->city ?? '')), 'city');
        $this->requireNonEmpty(trim((string) ($user->state ?? '')), 'state');
        $this->requireNonEmpty(trim((string) ($user->country ?? '')), 'country');
        $this->requireNonEmpty(trim((string) ($user->email ?? '')), 'email');
        $this->requireNonEmpty(trim((string) ($user->phone ?? '')), 'phone');

        $contact = [
            'firstname' => $nameParts['firstname'],
            'lastname' => $nameParts['lastname'],
            'street' => $street,
            'number' => $number,
            'postcode' => trim((string) $user->postal_code),
            'city' => trim((string) $user->city),
            'state' => trim((string) $user->state),
            'country' => trim((string) $user->country),
            'email' => trim((string) $user->email),
            'phone' => trim((string) $user->phone),
        ];
        if (trim((string) ($user->company ?? '')) !== '') {
            $contact['company'] = trim((string) $user->company);
        }

        return $contact;
    }

    private function splitNameForDisplay(string $name): array
    {
        $trimmed = trim($name);
        $parts = preg_split('/\s+/', $trimmed, 2, PREG_SPLIT_NO_EMPTY);
        if (count($parts) >= 2) {
            return ['firstname' => $parts[0], 'lastname' => implode(' ', array_slice($parts, 1))];
        }

        return ['firstname' => $trimmed, 'lastname' => $trimmed];
    }

    /**
     * @return array{firstname: string, lastname: string}
     */
    private function splitName(string $name): array
    {
        $trimmed = trim($name);
        $parts = preg_split('/\s+/', $trimmed, 2, PREG_SPLIT_NO_EMPTY);
        if (count($parts) >= 2) {
            return ['firstname' => $parts[0], 'lastname' => implode(' ', array_slice($parts, 1))];
        }
        if ($trimmed !== '') {
            return ['firstname' => $trimmed, 'lastname' => $trimmed];
        }
        throw new \RuntimeException('Kontakt: Name darf nicht leer sein.');
    }

    private function requireNonEmpty(string $value, string $field): void
    {
        if ($value === '') {
            throw new \RuntimeException('Kontakt: Feld "'.$field.'" darf nicht leer sein.');
        }
    }

    /**
     * Try to extract house number from street string (e.g. "Musterstr. 1a" -> "1a").
     */
    private function parseStreetNumber(string $street): string
    {
        if (preg_match('/\s+([0-9]+[a-zA-Z]?)\s*$/', trim($street), $m)) {
            return $m[1];
        }

        return '';
    }
}
