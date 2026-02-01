<?php

namespace App\Policies;

use App\Models\TicketPriority;
use App\Models\User;

class TicketPriorityPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, TicketPriority $ticketPriority): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, TicketPriority $ticketPriority): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, TicketPriority $ticketPriority): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, TicketPriority $ticketPriority): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, TicketPriority $ticketPriority): bool
    {
        return $user->isAdmin();
    }
}
