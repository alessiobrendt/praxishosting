<?php

use App\Http\Middleware\EnsureAdminDomainForAdminRoutes;
use App\Http\Middleware\EnsureBillingProfile;
use App\Http\Middleware\EnsureBrandFeatureSites;
use App\Http\Middleware\EnsureUserBrandMatchesDomain;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ResolveBrandFromDomain;
use App\Http\Middleware\ResolveSiteByDomain;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Sentry\Laravel\Integration;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Caddy als vertrauenswürdigen Proxy konfigurieren
        $middleware->trustProxies(at: env('TRUSTED_PROXIES', '127.0.0.1'));

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state', 'cookie_consent']);

        $middleware->validateCsrfTokens(except: [
            'api/verify-domain', // Caddy On-Demand TLS verification (GET, no session)
            'webhooks/mollie',
            'webhooks/mollie/*',
        ]);

        $middleware->prepend(ResolveBrandFromDomain::class);
        $middleware->prepend(ResolveSiteByDomain::class);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
            'admin.domain' => EnsureAdminDomainForAdminRoutes::class,
            'billing.profile' => EnsureBillingProfile::class,
            'brand.domain' => EnsureUserBrandMatchesDomain::class,
            'brand.feature.sites' => EnsureBrandFeatureSites::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        Integration::handles($exceptions);
    })->create();
