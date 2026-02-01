<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    public $incrementing = false;

    protected $primaryKey = 'key';

    protected $keyType = 'string';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'key',
        'name',
        'subject',
        'greeting',
        'body',
        'action_text',
    ];

    /**
     * Replace placeholders in template fields and return content for building a mail message.
     *
     * @param  array<string, string>  $replacements  e.g. ['user_name' => 'Max', 'site_name' => 'Meine Site']
     * @return array{subject: string, greeting: string, body: string, action_text: string|null}
     */
    public function replace(array $replacements): array
    {
        $search = array_map(fn (string $key) => ':'.$key, array_keys($replacements));
        $values = array_map(fn ($value) => (string) $value, array_values($replacements));

        return [
            'subject' => str_replace($search, $values, $this->subject),
            'greeting' => str_replace($search, $values, $this->greeting),
            'body' => str_replace($search, $values, $this->body),
            'action_text' => $this->action_text ? str_replace($search, $values, $this->action_text) : null,
        ];
    }
}
