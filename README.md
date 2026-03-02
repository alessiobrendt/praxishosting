# neroserv - Customer Dashbord

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

## Queue und Scheduler (E-Mails, Jobs)

- **Queue-Worker:** Transaktionale E-Mails und viele Benachrichtigungen laufen über die Queue. Damit E-Mails versendet werden, muss ein Worker laufen, z. B. `php artisan queue:work` (dauerhaft) oder `php artisan queue:work --once` (einmalig, z. B. im Cron).
- **Scheduler:** Tägliche Jobs (Abo-Verlängerung, Rechnungen, Suspend/Löschung) werden über den Scheduler ausgeführt. Dafür muss `php artisan schedule:work` laufen oder ein Cron-Eintrag: `* * * * * cd /pfad/zum/projekt && php artisan schedule:run >> /dev/null 2>&1`.

## Code-Style

- **PHP**: Laravel Pint — `vendor/bin/pint --dirty`
- **Frontend**: ESLint, Prettier
