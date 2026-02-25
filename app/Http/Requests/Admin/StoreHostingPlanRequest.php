<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreHostingPlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'brand_id' => ['nullable', 'exists:brands,id'],
            'hosting_server_id' => ['required_if:panel_type,pterodactyl', 'nullable', 'exists:hosting_servers,id'],
            'panel_type' => ['required', 'string', 'in:plesk,pterodactyl'],
            'config' => ['nullable', 'array'],
            'name' => ['required', 'string', 'max:255'],
            'plesk_package_name' => ['required_if:panel_type,plesk', 'nullable', 'string', 'max:255'],
            'disk_gb' => ['integer', 'min:0'],
            'traffic_gb' => ['integer', 'min:0'],
            'domains' => ['integer', 'min:0'],
            'subdomains' => ['integer', 'min:0'],
            'mailboxes' => ['integer', 'min:0'],
            'databases' => ['integer', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'stripe_price_id' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ];
        if ($this->input('panel_type') === 'pterodactyl') {
            $rules['config.nest_id'] = ['required', 'integer', 'min:1'];
            $rules['config.egg_id'] = ['required', 'integer', 'min:1'];
            $rules['config.memory'] = ['nullable', 'integer', 'min:0'];
            $rules['config.disk'] = ['nullable', 'integer', 'min:0'];
            $rules['config.cpu'] = ['nullable', 'integer', 'min:0'];
            $rules['config.location_ids'] = ['nullable', 'array'];
            $rules['config.location_ids.*'] = ['integer', 'min:1'];
            $rules['config.node'] = ['nullable', 'integer', 'min:1'];
            $rules['config.swap'] = ['nullable', 'integer', 'min:-1'];
            $rules['config.io'] = ['nullable', 'integer', 'min:0'];
            $rules['config.additional_allocations'] = ['nullable', 'integer', 'min:0'];
            $rules['config.port_array'] = ['nullable', 'string', 'max:2000'];
            $rules['config.port_range'] = ['nullable', 'array'];
            $rules['config.port_range.*'] = ['string', 'max:100'];
            $rules['config.databases'] = ['nullable', 'integer', 'min:0'];
            $rules['config.backups'] = ['nullable', 'integer', 'min:0'];
            $rules['config.allow_egg_selection_override'] = ['nullable', 'boolean'];
            $rules['config.skip_scripts'] = ['nullable', 'boolean'];
            $rules['config.dedicated_ip'] = ['nullable', 'boolean'];
            $rules['config.start_on_completion'] = ['nullable', 'boolean'];
            $rules['config.oom_killer'] = ['nullable', 'boolean'];
            $rules['config.cpu_pinning'] = ['nullable', 'string', 'max:255'];
        }

        return $rules;
    }
}
