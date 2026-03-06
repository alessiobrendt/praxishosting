<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketService extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'ticket_id',
        'service_type',
        'service_id',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}
