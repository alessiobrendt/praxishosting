<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    /** @use HasFactory<\Database\Factories\TicketFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'site_id',
        'ticket_category_id',
        'ticket_priority_id',
        'subject',
        'status',
        'assigned_to',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function ticketCategory(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class);
    }

    public function ticketPriority(): BelongsTo
    {
        return $this->belongsTo(TicketPriority::class);
    }

    /**
     * Admin user assigned to this ticket.
     *
     * @return BelongsTo<User>
     */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * @return HasMany<TicketMessage>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(TicketMessage::class);
    }
}
