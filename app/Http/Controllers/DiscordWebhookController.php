<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\DiscordApiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DiscordWebhookController extends Controller
{
    /**
     * Handle Discord Interactions API (e.g. Slash Command /link).
     */
    public function interactions(Request $request): JsonResponse
    {
        $rawBody = $request->getContent();
        if (! $this->verifySignature($request, $rawBody)) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $payload = json_decode($rawBody, true);
        if (! is_array($payload)) {
            return response()->json(['error' => 'Invalid JSON'], 400);
        }

        $type = (int) ($payload['type'] ?? 0);

        if ($type === 1) {
            return response()->json(['type' => 1]);
        }

        if ($type === 2) {
            $data = $payload['data'] ?? [];
            $name = $data['name'] ?? '';

            if ($name === 'link') {
                return $this->handleLinkCommand($payload);
            }
        }

        return response()->json(['type' => 4, 'data' => ['content' => 'Unbekannter Befehl.']]);
    }

    private function verifySignature(Request $request, string $rawBody): bool
    {
        $signature = $request->header('X-Signature-Ed25519');
        $timestamp = $request->header('X-Signature-Timestamp');
        $publicKey = config('services.discord.application_public_key');

        if (! $signature || ! $timestamp || ! $publicKey) {
            return false;
        }

        $message = $timestamp.$rawBody;
        $binarySignature = @sodium_hex2bin($signature);
        $binaryKey = @sodium_hex2bin($publicKey);

        if ($binarySignature === false || $binaryKey === false) {
            return false;
        }

        if (strlen($binaryKey) !== SODIUM_CRYPTO_SIGN_PUBLICKEYBYTES) {
            return false;
        }

        return sodium_crypto_sign_verify_detached($binarySignature, $message, $binaryKey);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handleLinkCommand(array $payload): JsonResponse
    {
        $member = $payload['member'] ?? [];
        $user = $member['user'] ?? [];
        $discordUserId = (string) ($user['id'] ?? '');

        if ($discordUserId === '') {
            return response()->json([
                'type' => 4,
                'data' => ['content' => 'Keine Discord-Benutzer-ID gefunden.'],
            ]);
        }

        $laravelUser = User::query()->where('discord_id', $discordUserId)->first();

        if ($laravelUser === null) {
            $inviteUrl = config('services.discord.invite_url');
            $hint = $inviteUrl
                ? " Kein verknüpftes Konto gefunden. Bitte verbinde Discord unter Einstellungen → Integration auf der Website. Falls du noch nicht auf dem Server bist: {$inviteUrl}"
                : ' Kein verknüpftes Konto gefunden. Bitte verbinde Discord unter Einstellungen → Integration auf der Website.';

            return response()->json([
                'type' => 4,
                'data' => ['content' => trim($hint)],
            ]);
        }

        $roleId = config('services.discord.customer_role_id');
        if (! empty($roleId)) {
            app(DiscordApiService::class)->addRoleToMember($laravelUser->discord_id, $roleId);
        }

        return response()->json([
            'type' => 4,
            'data' => ['content' => 'Dein Konto ist mit diesem Discord verknüpft. Du hast die Kunden-Rolle erhalten.'],
        ]);
    }
}
