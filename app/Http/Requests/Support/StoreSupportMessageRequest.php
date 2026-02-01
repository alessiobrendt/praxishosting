<?php

namespace App\Http\Requests\Support;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupportMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'max:10000'],
        ];
    }
}
