<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    /**
     * Whether the user can view (e.g. download) the invoice.
     */
    public function view(User $user, Invoice $invoice): bool
    {
        return $user->isAdmin() || $invoice->user_id === $user->id;
    }
}
