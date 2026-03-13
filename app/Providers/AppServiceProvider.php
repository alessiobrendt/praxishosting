<?php

namespace App\Providers;

use App\Listeners\LogUserEmailToPostfach;
use App\Listeners\SendLoginNotification;
use App\Models\Setting;
use App\Models\Site;
use App\Modules\Handlers\ContactModuleHandler;
use App\Modules\Handlers\NewsletterModuleHandler;
use App\Modules\ModuleRegistry;
use App\Notifications\Channels\DiscordChannel;
use App\Notifications\Channels\TransactionalMailChannel;
use App\Observers\SiteObserver;
use App\Services\DiscordApiService;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Mail\Events\MessageSending;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use SocialiteProviders\Manager\SocialiteWasCalled;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(
            \Laravel\Fortify\Contracts\LoginResponse::class,
            \App\Http\Responses\LoginResponse::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureApiRateLimiting();
    }

    protected function configureApiRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );

        Site::observe(SiteObserver::class);

        ModuleRegistry::register('contact', ContactModuleHandler::class);
        ModuleRegistry::register('newsletter', NewsletterModuleHandler::class);

        Event::listen(Login::class, SendLoginNotification::class);

        Event::listen(SocialiteWasCalled::class, function (SocialiteWasCalled $event): void {
            $event->extendSocialite('google', \SocialiteProviders\Google\Provider::class);
            $event->extendSocialite('discord', \SocialiteProviders\Discord\Provider::class);
        });

        Notification::extend('transactional_mail', function () {
            return new TransactionalMailChannel;
        });

        Notification::extend('discord', function () {
            return new DiscordChannel(app(DiscordApiService::class));
        });

        Event::listen(MessageSending::class, function (MessageSending $event): void {
            $replyTo = Setting::get('mail_reply_to_address');
            if ($replyTo !== null && $replyTo !== '') {
                $event->message->replyTo(trim($replyTo));
            }
        });

        Event::listen(MessageSent::class, LogUserEmailToPostfach::class);
    }
}
