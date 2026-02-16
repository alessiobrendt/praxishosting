<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (app()->environment('testing')) {
            $connection = config('database.default');
            $database = config("database.connections.{$connection}.database");
            $driver = config("database.connections.{$connection}.driver");
            if ($driver !== 'sqlite' || $database !== ':memory:') {
                throw new \RuntimeException(
                    'Tests must use SQLite in-memory database to avoid wiping your real data. '
                    ."Current: driver={$driver}, database={$database}. "
                    .'Run: php artisan config:clear (cached config overrides env). '
                    .'Then ensure phpunit.xml and tests/bootstrap.php use DB_CONNECTION=sqlite, DB_DATABASE=:memory:.'
                );
            }
        }
    }
}
