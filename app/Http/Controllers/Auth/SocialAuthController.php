<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\DiscordApiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Fortify;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\RedirectResponse as SymfonyRedirectResponse;

class SocialAuthController extends Controller
{
    private const PROVIDERS = ['google', 'discord'];

    /**
     * Redirect the user to the provider's OAuth page.
     */
    public function redirect(string $provider): SymfonyRedirectResponse|RedirectResponse
    {
        $this->validateProvider($provider);

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Redirect the authenticated user to Discord to connect their account (link only, no login).
     */
    public function connectDiscord(): RedirectResponse
    {
        session(['discord_connect' => true]);

        return Socialite::driver('discord')->redirect();
    }

    /**
     * Handle the callback from the OAuth provider.
     */
    public function callback(string $provider): RedirectResponse
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Throwable $e) {
            return redirect()->route('login')
                ->with('error', __('Die Anmeldung mit :provider ist fehlgeschlagen. Bitte versuchen Sie es erneut.', ['provider' => $this->providerLabel($provider)]));
        }

        if ($provider === 'discord' && session('discord_connect') && Auth::check()) {
            session()->forget('discord_connect');
            $user = Auth::user();
            $this->linkProviderAndUpdate(
                $user,
                'discord',
                $socialUser->getId(),
                trim((string) ($socialUser->getName() ?? ''))
            );
            $this->assignDiscordCustomerRoleIfConfigured($user->fresh());

            return redirect()->route('integration.show')->with('success', 'Discord wurde verbunden.');
        }

        $user = $this->findOrCreateUser($provider, $socialUser);

        Auth::login($user, remember: true);

        return redirect()->intended(Fortify::redirects('login'));
    }

    private function validateProvider(string $provider): void
    {
        if (! in_array($provider, self::PROVIDERS, true)) {
            abort(404);
        }
    }

    private function providerLabel(string $provider): string
    {
        return match ($provider) {
            'google' => 'Google',
            'discord' => 'Discord',
            default => $provider,
        };
    }

    private function findOrCreateUser(string $provider, SocialiteUser $socialUser): User
    {
        $providerId = $socialUser->getId();
        $email = $socialUser->getEmail();
        $name = trim((string) ($socialUser->getName() ?? ''));

        $user = User::findByProvider($provider, $providerId);

        if ($user !== null) {
            $this->updateUserFromSocial($user, $name);

            return $user;
        }

        if ($email !== null && $email !== '') {
            $user = User::query()->where('email', $email)->first();
            if ($user !== null) {
                $this->linkProviderAndUpdate($user, $provider, $providerId, $name);

                return $user;
            }
        }

        return $this->createUserFromSocial($provider, $providerId, $email ?? '', $name);
    }

    private function updateUserFromSocial(User $user, string $name): void
    {
        if ($name !== '' && ! $user->hasName()) {
            $user->update(['name' => $name]);
        }
    }

    private function linkProviderAndUpdate(User $user, string $provider, string $providerId, string $name): void
    {
        $column = match ($provider) {
            'google' => 'google_id',
            'discord' => 'discord_id',
            default => null,
        };

        if ($column === null) {
            return;
        }

        $updates = [$column => $providerId];
        if ($name !== '' && ! $user->hasName()) {
            $updates['name'] = $name;
        }
        $user->update($updates);
    }

    private function assignDiscordCustomerRoleIfConfigured(User $user): void
    {
        if (empty($user->discord_id)) {
            return;
        }
        $roleId = config('services.discord.customer_role_id');
        if (empty($roleId)) {
            return;
        }
        app(DiscordApiService::class)->addRoleToMember($user->discord_id, $roleId);
    }

    private function createUserFromSocial(string $provider, string $providerId, string $email, string $name): User
    {
        $currentBrand = request()->attributes->get('current_brand');

        $column = match ($provider) {
            'google' => 'google_id',
            'discord' => 'discord_id',
            default => null,
        };

        $attributes = [
            'brand_id' => $currentBrand?->id,
            'email' => $email !== '' ? $email : 'social-'.$provider.'-'.$providerId.'@placeholder.local',
            'name' => $name !== '' ? $name : 'User',
            'password' => null,
            $column => $providerId,
        ];

        return User::create($attributes);
    }
}
