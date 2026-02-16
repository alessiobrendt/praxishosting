<?php

namespace App\Policies;

use App\Models\ResellerDomain;
use App\Models\User;

class ResellerDomainPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model (own domain only).
     */
    public function view(User $user, ResellerDomain $resellerDomain): bool
    {
        return $resellerDomain->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model (own domain only).
     */
    public function update(User $user, ResellerDomain $resellerDomain): bool
    {
        return $resellerDomain->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ResellerDomain $resellerDomain): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ResellerDomain $resellerDomain): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ResellerDomain $resellerDomain): bool
    {
        return false;
    }
}
