<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class UserEmailLog extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'uuid',
        'user_id',
        'subject',
        'body_html',
        'snippet',
        'notification_type',
        'sent_at',
        'read_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
            'read_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Derive a short preview text from HTML body (strips style/script, takes first sentence or chars).
     */
    public static function snippetFromHtml(?string $html, int $maxLength = 120): string
    {
        if ($html === null || $html === '') {
            return '';
        }
        $html = preg_replace('/<style[^>]*>.*?<\/style>/is', ' ', $html);
        $html = preg_replace('/<script[^>]*>.*?<\/script>/is', ' ', $html);
        $text = strip_tags($html);
        $text = preg_replace('/\s+/', ' ', $text);
        $text = preg_replace('/\bTransactional\b/i', '', $text);
        $text = trim($text);
        if ($text === '') {
            return '';
        }
        $firstSentence = preg_match('/^[^.!?]*[.!?]/u', $text, $m) ? trim($m[0]) : null;
        if ($firstSentence !== null && mb_strlen($firstSentence) <= $maxLength) {
            return $firstSentence;
        }
        if (mb_strlen($text) <= $maxLength) {
            return $text;
        }

        return mb_substr($text, 0, $maxLength).'...';
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (UserEmailLog $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }
}
