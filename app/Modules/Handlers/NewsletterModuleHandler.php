<?php

namespace App\Modules\Handlers;

use App\Contracts\ModuleHandler;
use App\Models\NewsletterSubscription;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsletterModuleHandler implements ModuleHandler
{
    public function getModuleType(): string
    {
        return 'newsletter';
    }

    public function handle(Site $site, Request $request): JsonResponse
    {
        $request->validate([
            'data.email' => ['required', 'email'],
        ]);

        $email = $request->input('data.email');

        $existing = NewsletterSubscription::query()
            ->where('site_id', $site->id)
            ->where('email', $email)
            ->first();

        if ($existing) {
            if ($existing->unsubscribed_at !== null) {
                $existing->update([
                    'unsubscribed_at' => null,
                    'token' => Str::random(64),
                    'subscribed_at' => now(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => __('Sie haben den Newsletter erfolgreich erneut abonniert.'),
                ]);
            }

            return response()->json([
                'success' => false,
                'errors' => [
                    'data.email' => [__('Diese E-Mail-Adresse ist bereits für unseren Newsletter angemeldet.')],
                ],
            ], 422);
        }

        NewsletterSubscription::create([
            'site_id' => $site->id,
            'email' => $email,
            'token' => Str::random(64),
            'subscribed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => __('Vielen Dank für Ihre Anmeldung zum Newsletter.'),
        ]);
    }
}
