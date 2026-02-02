<?php

namespace App\Contracts;

use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

interface ModuleHandler
{
    /**
     * Handle a module submission request.
     */
    public function handle(Site $site, Request $request): JsonResponse;

    /**
     * Get the module type identifier (e.g. 'contact', 'newsletter').
     */
    public function getModuleType(): string;
}
