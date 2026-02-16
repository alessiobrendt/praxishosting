<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TldPricelist extends Model
{
    protected $table = 'tld_pricelist';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'tld',
        'create_price',
        'renew_price',
        'transfer_price',
        'restore_price',
        'margin_type',
        'margin_value',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'create_price' => 'decimal:2',
            'renew_price' => 'decimal:2',
            'transfer_price' => 'decimal:2',
            'restore_price' => 'decimal:2',
            'margin_value' => 'decimal:2',
        ];
    }
}
