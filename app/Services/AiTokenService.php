<?php

namespace App\Services;

use App\Models\AiTokenBalance;
use App\Models\AiTokenTransaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AiTokenService
{
    public function getBalance(User $user): int
    {
        $balance = AiTokenBalance::where('user_id', $user->id)->first();

        return $balance?->balance ?? 0;
    }

    public function hasEnough(User $user, int $tokens): bool
    {
        return $this->getBalance($user) >= $tokens;
    }

    public function deduct(User $user, int $tokens, string $description, ?Model $reference = null): void
    {
        if ($tokens <= 0) {
            return;
        }

        $balance = AiTokenBalance::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        if ($balance->balance < $tokens) {
            throw new \RuntimeException('Insufficient AI tokens');
        }

        AiTokenTransaction::create([
            'user_id' => $user->id,
            'amount' => -$tokens,
            'type' => 'usage',
            'description' => $description,
            'reference_type' => $reference ? $reference->getMorphClass() : null,
            'reference_id' => $reference?->getKey(),
        ]);

        $balance->decrement('balance', $tokens);
    }

    public function addFromPurchase(User $user, int $tokens, string $description = 'AI-Token-Paket gekauft'): void
    {
        if ($tokens <= 0) {
            return;
        }

        AiTokenTransaction::create([
            'user_id' => $user->id,
            'amount' => $tokens,
            'type' => 'purchase',
            'description' => $description,
            'reference_type' => null,
            'reference_id' => null,
        ]);

        $balance = AiTokenBalance::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );
        $balance->increment('balance', $tokens);
    }

    public function addFromAdmin(User $user, int $tokens, string $description, User $admin): void
    {
        if ($tokens === 0) {
            return;
        }

        AiTokenTransaction::create([
            'user_id' => $user->id,
            'amount' => $tokens,
            'type' => 'admin_adjustment',
            'description' => $description,
            'reference_type' => User::class,
            'reference_id' => $admin->id,
        ]);

        $balance = AiTokenBalance::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        if ($tokens > 0) {
            $balance->increment('balance', $tokens);
        } else {
            $balance->decrement('balance', abs($tokens));
        }
    }
}
