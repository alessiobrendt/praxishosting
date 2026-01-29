<?php

namespace App\Policies;

use App\Models\Site;
use App\Models\User;

class SitePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Site $site): bool
    {
        return $user->isAdmin()
            || $site->user_id === $user->id
            || $site->collaborators()->where('user_id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Site $site): bool
    {
        return $user->isAdmin()
            || $site->user_id === $user->id
            || $site->collaborators()->where('user_id', $user->id)->exists();
    }

    public function delete(User $user, Site $site): bool
    {
        return $user->isAdmin() || $site->user_id === $user->id;
    }

    public function restore(User $user, Site $site): bool
    {
        return $user->isAdmin() || $site->user_id === $user->id;
    }

    public function forceDelete(User $user, Site $site): bool
    {
        return $user->isAdmin() || $site->user_id === $user->id;
    }

    public function manageCollaborators(User $user, Site $site): bool
    {
        return $user->isAdmin()
            || $site->user_id === $user->id
            || $site->collaborators()->where('user_id', $user->id)->exists();
    }
}
