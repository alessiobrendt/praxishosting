<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHostingPlanRequest extends FormRequest
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
            'hosting_server_id' => ['required_if:panel_type,pterodactyl', 'required_if:panel_type,teamspeak', 'nullable', 'exists:hosting_servers,id'],
            'panel_type' => ['required', 'string', 'in:plesk,pterodactyl,teamspeak'],
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

        $rules['config.plan_options'] = ['nullable', 'array'];
        $rules['config.plan_options.*.id'] = ['required', 'string', 'max:64'];
        $rules['config.plan_options.*.name'] = ['required', 'string', 'max:255'];
        $rules['config.plan_options.*.type'] = ['required', 'string', 'in:free,choice,text,range_slider,select'];
        $rules['config.plan_options.*.price_per_unit'] = ['nullable', 'numeric', 'min:0'];
        $rules['config.plan_options.*.sort_order'] = ['nullable', 'integer', 'min:0'];
        $rules['config.plan_options.*.choices'] = ['nullable', 'array'];
        $rules['config.plan_options.*.choices.*.value'] = ['required', 'string'];
        $rules['config.plan_options.*.choices.*.label'] = ['required', 'string'];
        $rules['config.plan_options.*.choices.*.price_delta'] = ['nullable', 'numeric', 'min:0'];
        $rules['config.plan_options.*.min'] = ['nullable', 'numeric'];
        $rules['config.plan_options.*.max'] = ['nullable', 'numeric'];
        $rules['config.plan_options.*.step'] = ['nullable', 'numeric', 'min:0'];
        $rules['config.plan_options.*.unit'] = ['nullable', 'string', 'max:32'];
        $rules['config.plan_options.*.source'] = ['nullable', 'string', 'in:pterodactyl_nests,pterodactyl_eggs'];
        $rules['config.plan_options.*.placeholder'] = ['nullable', 'string', 'max:255'];
        $rules['config.plan_options.*.max_length'] = ['nullable', 'integer', 'min:0', 'max:10000'];

        return $rules;
    }
}
