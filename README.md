# PraxisHosting

![Logo](https://cdn.neroserv.de/branding/logo_schrift.png)

Laravel-basierte Hosting- und Game-Server-Plattform mit Plesk- und Pterodactyl-Anbindung.

## Tech-Stack

- **PHP 8.4** · **Laravel 12**
- **Inertia.js v2** · **Vue 3** · **Tailwind CSS v4**
- **Laravel Wayfinder** (TypeScript-Routen)
- **Laravel Fortify** (Auth) · **Laravel Cashier** (Stripe)
- **Pest 4** (Tests)

## Features

- **Webspace**: Plesk-Pakete, Domains, Kundenverwaltung
- **Game Server**: Pterodactyl-Integration, Paket-Optionen (Nests/Eggs), Checkout
- **Billing**: Rechnungen, Guthaben, Stripe, Zahlungsarten
- **Multi-Brand**: Marken, Features pro Brand
- **Admin**: Hosting-Pläne, Produkte, Tickets, Einstellungen

## Entwicklung

```bash
# Abhängigkeiten
composer install
npm install

# Umgebung
cp .env.example .env
php artisan key:generate

# Assets (Entwicklung)
npm run dev
# oder
composer run dev

# Tests
php artisan test --compact
```

Die Anwendung wird per **Laravel Herd** unter `https://praxishosting.test` bereitgestellt.

## Code-Style

- **PHP**: Laravel Pint — `vendor/bin/pint --dirty`
- **Frontend**: ESLint, Prettier
