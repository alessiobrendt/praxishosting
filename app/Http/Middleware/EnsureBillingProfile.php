<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBillingProfile
{
    /**
     * Handle an incoming request. Redirect to profile if billing address is incomplete.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->hasCompleteBillingProfile()) {
            return redirect()
                ->route('profile.edit')
                ->with('error', 'Bitte vervollständigen Sie Ihre Rechnungsadresse unter Einstellungen, um fortzufahren.');
        }

        return $next($request);
    }
}
