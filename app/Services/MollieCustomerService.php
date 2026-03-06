<?php

namespace App\Services;

use App\Models\User;
use Mollie\Api\Exceptions\ApiException as MollieApiException;
use Mollie\Api\MollieApiClient;

class MollieCustomerService
{
    /**
     * Ensure the user has a Mollie customer; create one if not. Returns the Mollie customer ID.
     *
     * @throws MollieApiException
     */
    public function ensureCustomer(User $user): string
    {
        if ($user->mollie_customer_id !== null && $user->mollie_customer_id !== '') {
            return $user->mollie_customer_id;
        }

        $mollie = app(MollieApiClient::class);
        $customer = $mollie->customers->create([
            'name' => $user->name ?? $user->email,
            'email' => $user->email,
        ]);

        $user->update(['mollie_customer_id' => $customer->id]);

        return $customer->id;
    }
}
