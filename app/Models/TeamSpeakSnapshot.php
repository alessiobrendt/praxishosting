<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamSpeakSnapshot extends Model
{
    protected $fillable = ['team_speak_server_account_id', 'snapshot'];

    public function teamSpeakServerAccount(): BelongsTo
    {
        return $this->belongsTo(TeamSpeakServerAccount::class);
    }
}
