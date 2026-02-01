<?php

namespace App\Providers;

use App\Listeners\CreateLocalInvoiceFromStripeWebhook;
use App\Listeners\LogStripeWebhookReceived;
use App\Listeners\SendPaymentFailedNotification;
use App\Listeners\SyncSiteSubscriptionFromStripeWebhook;
use App\Models\Site;
use App\Observers\SiteObserver;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Cashier\Events\WebhookReceived;
use Stripe\StripeClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(StripeClient::class, function () {
            return new StripeClient(config('cashier.secret'));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
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

        Event::listen(WebhookReceived::class, LogStripeWebhookReceived::class);
        Event::listen(WebhookReceived::class, SyncSiteSubscriptionFromStripeWebhook::class);
        Event::listen(WebhookReceived::class, CreateLocalInvoiceFromStripeWebhook::class);
        Event::listen(WebhookReceived::class, SendPaymentFailedNotification::class);

        Event::listen(MessageSending::class, function (MessageSending $event): void {
            $replyTo = Setting::get('mail_reply_to_address');
            if ($replyTo !== null && $replyTo !== '') {
                $event->message->replyTo(trim($replyTo));
            }
        });
    }
}
