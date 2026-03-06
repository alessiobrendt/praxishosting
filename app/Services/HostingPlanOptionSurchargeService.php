<?php

namespace App\Services;

use App\Models\HostingPlan;

class HostingPlanOptionSurchargeService
{
    /**
     * Compute total surcharge (in EUR) from option_choices for the given plan.
     *
     * @param  array<string, mixed>  $optionChoices  [ option_id => value ]
     */
    public function computeSurcharge(HostingPlan $plan, array $optionChoices): float
    {
        $planOptions = $plan->config['plan_options'] ?? null;
        if (! is_array($planOptions)) {
            return 0.0;
        }

        $total = 0.0;
        foreach ($planOptions as $opt) {
            $id = $opt['id'] ?? null;
            if ($id === null || ! array_key_exists($id, $optionChoices)) {
                continue;
            }
            $value = $optionChoices[$id];
            $total += $this->surchargeForOption($opt, $value);
        }

        return round($total, 2);
    }

    /**
     * Surcharge for a single option given the chosen value.
     *
     * @param  array<string, mixed>  $opt
     * @param  mixed  $value
     */
    protected function surchargeForOption(array $opt, $value): float
    {
        $type = $opt['type'] ?? 'free';
        if ($type === 'free') {
            return 0.0;
        }
        if ($value === null || $value === '') {
            return 0.0;
        }
        if ($type === 'choice' || $type === 'select') {
            $choices = $opt['choices'] ?? [];
            foreach ($choices as $c) {
                if (isset($c['value']) && (string) $c['value'] === (string) $value) {
                    return (float) ($c['price_delta'] ?? 0);
                }
            }

            return 0.0;
        }
        if ($type === 'range_slider') {
            $num = (float) $value;
            $min = (float) ($opt['min'] ?? 0);
            $step = (float) ($opt['step'] ?? 1);
            $pricePerUnit = (float) ($opt['price_per_unit'] ?? 0);
            $optId = $opt['id'] ?? '';

            if (($optId === 'slots') && $num >= 0) {
                return $pricePerUnit * $num;
            }
            if ($step <= 0) {
                return 0.0;
            }

            return $pricePerUnit * (($num - $min) / $step);
        }
        if ($type === 'text') {
            return (float) ($opt['price_per_unit'] ?? 0);
        }

        return 0.0;
    }

    /**
     * Validate option_choices: only allow keys that exist in plan_options; return sanitized array.
     *
     * @param  array<string, mixed>  $optionChoices
     * @return array<string, mixed>
     */
    public function validateOptionChoices(HostingPlan $plan, array $optionChoices): array
    {
        $planOptions = $plan->config['plan_options'] ?? null;
        if (! is_array($planOptions)) {
            return [];
        }
        $allowedIds = [];
        foreach ($planOptions as $opt) {
            $id = $opt['id'] ?? null;
            if (is_string($id) && $id !== '') {
                $allowedIds[$id] = true;
            }
        }
        $out = [];
        foreach ($optionChoices as $id => $value) {
            if (is_string($id) && isset($allowedIds[$id]) && ($value !== null && $value !== '')) {
                $out[$id] = is_numeric($value) ? (float) $value : (string) $value;
            }
        }

        return $out;
    }
}
