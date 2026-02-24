<?php

namespace App\Policies;

use App\Models\GameServerAccount;
use App\Models\User;

class GameServerAccountPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function view(User $user, GameServerAccount $gameServerAccount): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, GameServerAccount $gameServerAccount): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, GameServerAccount $gameServerAccount): bool
    {
        return $user->isAdmin();
    }

    public function restore(User $user, GameServerAccount $gameServerAccount): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, GameServerAccount $gameServerAccount): bool
    {
        return $user->isAdmin();
    }
}
