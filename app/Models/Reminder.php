<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Reminder extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'type',
        'subject_type',
        'subject_id',
        'sent_at',
        'created_by',
        'note',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return array<string, string>
     */
    public static function typeLabels(): array
    {
        return [
            'payment_reminder' => 'Zahlungserinnerung',
            'subscription_ending' => 'Abo endet bald',
            'phone_call' => 'Telefonat',
            'email_manual' => 'E-Mail (manuell)',
            'other' => 'Sonstiges',
        ];
    }
}
