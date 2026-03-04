<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketMessageTemplate extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'body',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }
}
