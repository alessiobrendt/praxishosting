<?php

namespace App\Policies;

use App\Models\TeamSpeakServerAccount;
use App\Models\User;

class TeamSpeakServerAccountPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, TeamSpeakServerAccount $teamSpeakServerAccount): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, TeamSpeakServerAccount $teamSpeakServerAccount): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, TeamSpeakServerAccount $teamSpeakServerAccount): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, TeamSpeakServerAccount $teamSpeakServerAccount): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, TeamSpeakServerAccount $teamSpeakServerAccount): bool
    {
        return $user->isAdmin();
    }
}
