<?php

namespace App\Modules;

use App\Contracts\ModuleHandler;
use Illuminate\Support\Arr;

class ModuleRegistry
{
    /**
     * @var array<string, class-string<ModuleHandler>>
     */
    protected static array $handlers = [];

    /**
     * Register a module handler.
     *
     * @param  class-string<ModuleHandler>  $handler
     */
    public static function register(string $moduleType, string $handler): void
    {
        static::$handlers[$moduleType] = $handler;
    }

    /**
     * Get the handler for a module type.
     *
     * @return class-string<ModuleHandler>|null
     */
    public static function getHandler(string $moduleType): ?string
    {
        return Arr::get(static::$handlers, $moduleType);
    }

    /**
     * Check if a module type is registered.
     */
    public static function has(string $moduleType): bool
    {
        return isset(static::$handlers[$moduleType]);
    }

    /**
     * Get all registered module types.
     *
     * @return array<string>
     */
    public static function getRegisteredTypes(): array
    {
        return array_keys(static::$handlers);
    }

    /**
     * Resolve and instantiate the handler for a module type.
     */
    public static function resolve(string $moduleType): ?ModuleHandler
    {
        $handler = static::getHandler($moduleType);

        if ($handler === null) {
            return null;
        }

        return app($handler);
    }
}
