<?php

/**
 * Run before Laravel boots. Force DB to SQLite :memory: so the real DB is never touched.
 * If tests still use MySQL, run: php artisan config:clear
 * (Cached config ignores env vars and keeps the DB that was active when cache was created.)
 */
putenv('DB_CONNECTION=sqlite');
putenv('DB_DATABASE=:memory:');
$_ENV['DB_CONNECTION'] = 'sqlite';
$_ENV['DB_DATABASE'] = ':memory:';

require __DIR__.'/../vendor/autoload.php';
