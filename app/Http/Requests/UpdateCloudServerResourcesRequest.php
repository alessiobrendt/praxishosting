<?php

namespace App\Http\Requests;

use App\Models\GameServerAccount;
use App\Models\GameserverCloudSubscription;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateCloudServerResourcesRequest extends FormRequest
{
    public function authorize(): bool
    {
        $subscription = $this->route('subscription');
        $gameServerAccount = $this->route('game_server_account');

        if (! $subscription instanceof GameserverCloudSubscription || ! $gameServerAccount instanceof GameServerAccount) {
            return false;
        }

        return $subscription->user_id === $this->user()?->id
            && $gameServerAccount->gameserver_cloud_subscription_id === $subscription->id;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cpu' => ['required', 'integer', 'min:0'],
            'memory_mb' => ['required', 'integer', 'min:64'],
            'disk_mb' => ['required', 'integer', 'min:256'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $subscription = $this->route('subscription');
            $gameServerAccount = $this->route('game_server_account');

            if (! $subscription instanceof GameserverCloudSubscription || ! $gameServerAccount instanceof GameServerAccount) {
                return;
            }

            $allocation = is_array($gameServerAccount->allocation) ? $gameServerAccount->allocation : [];
            $currentCpu = (int) ($allocation['cpu'] ?? 0);
            $currentMemoryMb = (int) ($allocation['memory_mb'] ?? 0);
            $currentDiskMb = (int) ($allocation['disk_mb'] ?? 0);

            $remainingCpu = $subscription->getRemainingCpu();
            $remainingMemoryMb = $subscription->getRemainingMemoryMb();
            $remainingDiskMb = $subscription->getRemainingDiskMb();

            $maxCpu = $currentCpu + $remainingCpu;
            $maxMemoryMb = $currentMemoryMb + $remainingMemoryMb;
            $maxDiskMb = $currentDiskMb + $remainingDiskMb;

            $cpu = (int) $this->input('cpu');
            $memoryMb = (int) $this->input('memory_mb');
            $diskMb = (int) $this->input('disk_mb');

            if ($cpu > $maxCpu) {
                $validator->errors()->add('cpu', 'Die CPU darf maximal '.$maxCpu.' % betragen (aktuell: '.$currentCpu.', verfügbar: '.$remainingCpu.').');
            }
            if ($memoryMb > $maxMemoryMb) {
                $validator->errors()->add('memory_mb', 'Der RAM darf maximal '.$maxMemoryMb.' MB betragen (aktuell: '.$currentMemoryMb.', verfügbar: '.$remainingMemoryMb.').');
            }
            if ($diskMb > $maxDiskMb) {
                $validator->errors()->add('disk_mb', 'Der Speicher darf maximal '.$maxDiskMb.' MB betragen (aktuell: '.$currentDiskMb.', verfügbar: '.$remainingDiskMb.').');
            }
        });
    }
}
