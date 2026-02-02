<?php

namespace App\Modules\Handlers;

use App\Contracts\ModuleHandler;
use App\Models\ContactSubmission;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactModuleHandler implements ModuleHandler
{
    public function getModuleType(): string
    {
        return 'contact';
    }

    public function handle(Site $site, Request $request): JsonResponse
    {
        $config = $request->input('module_config', []);
        $fieldsConfig = $config['fields'] ?? [];
        $data = $request->input('data', []);

        $rules = $this->buildValidationRules($fieldsConfig);
        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $customFields = collect($validated)->except(['name', 'email', 'subject', 'message'])->toArray();

        ContactSubmission::create([
            'site_id' => $site->id,
            'name' => $validated['name'] ?? null,
            'email' => $validated['email'] ?? null,
            'subject' => $validated['subject'] ?? null,
            'message' => $validated['message'] ?? null,
            'custom_fields' => $customFields,
            'ip_hash' => hash('sha256', $request->ip().config('app.key')),
        ]);

        return response()->json([
            'success' => true,
            'message' => __('Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze.'),
        ]);
    }

    /**
     * Build validation rules from module field configuration.
     *
     * @param  array<int, array{key: string, type?: string, required?: bool}>  $fieldsConfig
     * @return array<string, array<int, string|\Illuminate\Validation\ValidationRule>>
     */
    protected function buildValidationRules(array $fieldsConfig): array
    {
        $rules = [];

        if (empty($fieldsConfig)) {
            return [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email'],
                'message' => ['required', 'string', 'max:10000'],
                'subject' => ['nullable', 'string', 'max:255'],
            ];
        }

        foreach ($fieldsConfig as $field) {
            $key = $field['key'] ?? null;
            if (! is_string($key) || $key === '') {
                continue;
            }

            $fieldRules = ! empty($field['required']) ? ['required'] : ['nullable'];

            $type = $field['type'] ?? 'text';
            match ($type) {
                'email' => $fieldRules[] = 'email',
                'tel' => $fieldRules[] = 'string',
                'textarea' => array_push($fieldRules, 'string', 'max:10000'),
                'select' => $fieldRules[] = 'string',
                'checkbox' => $fieldRules[] = 'boolean',
                default => array_push($fieldRules, 'string', 'max:1000'),
            };

            $rules[$key] = $fieldRules;
        }

        $defaults = ['name' => ['nullable', 'string', 'max:255'], 'email' => ['nullable', 'email'], 'subject' => ['nullable', 'string', 'max:255'], 'message' => ['nullable', 'string', 'max:10000']];
        foreach ($defaults as $key => $fieldRules) {
            if (! isset($rules[$key])) {
                $rules[$key] = $fieldRules;
            }
        }

        return $rules;
    }
}
