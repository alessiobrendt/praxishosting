@extends('pdf.layout')

@section('title', $dunningLetter->level . '. Mahnung zu Rechnung ' . $invoice->number)

@section('content')
    {{-- Header: Logo + Absender + Titel --}}
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
        <div class="text-gray-700">
            @if(!empty($company['company_logo_data_url']) || !empty($company['company_logo_url']))
                <img src="{{ $company['company_logo_data_url'] ?? $company['company_logo_url'] }}" alt="{{ $company['company_name'] ?? config('app.name') }}" class="h-12 w-auto object-contain object-left mb-4" style="max-height: 3rem;">
            @endif
            <div class="font-semibold text-base text-gray-900">{{ $company['company_name'] ?? config('app.name') }}</div>
            @if(!empty($company['company_street']))<div>{{ $company['company_street'] }}</div>@endif
            @if(!empty($company['company_postal_code']) || !empty($company['company_city']))
                <div>{{ trim(($company['company_postal_code'] ?? '').' '.($company['company_city'] ?? '')) }}</div>
            @endif
            @if(!empty($company['company_country']))<div>{{ config('countries.'.$company['company_country'], $company['company_country']) }}</div>@endif
        </div>
        <div class="text-right">
            <div class="inline-block px-4 py-2 rounded-lg bg-amber-600 text-white text-lg font-bold uppercase tracking-tight shadow-md">{{ $dunningLetter->level }}. Mahnung</div>
            <div class="mt-2 text-gray-600 font-medium">zu Rechnung {{ $invoice->number }}</div>
        </div>
    </div>

    {{-- Empfänger --}}
    <div class="border-l-4 border-amber-600 bg-gray-50/80 rounded-r-lg pl-5 pr-4 py-4 mb-8">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">Rechnungsempfänger</h2>
        <div class="text-gray-700">
            @if($invoice->user->company)<div class="font-medium text-gray-900">{{ $invoice->user->company }}</div>@endif
            <div>{{ $invoice->user->name }}</div>
            @if($invoice->user->street)<div>{{ $invoice->user->street }}</div>@endif
            @if($invoice->user->postal_code || $invoice->user->city)
                <div>{{ trim(($invoice->user->postal_code ?? '').' '.($invoice->user->city ?? '')) }}</div>
            @endif
            @if($invoice->user->country)<div>{{ config('countries.'.$invoice->user->country, $invoice->user->country) }}</div>@endif
            <div class="mt-1 text-gray-500 text-xs">{{ $invoice->user->email }}</div>
        </div>
    </div>

    {{-- Mahnungstext --}}
    <div class="mb-8 text-gray-700">
        <p class="mb-4">hiermit erinnern wir an unsere Rechnung <strong>{{ $invoice->number }}</strong> vom {{ $invoice->invoice_date->format('d.m.Y') }}.</p>
        <p class="mb-4">Der folgende Betrag ist bislang nicht bei uns eingegangen:</p>
        <p class="text-lg font-bold text-gray-900">{{ number_format($invoice->amount, 2, ',', '.') }} €</p>
        @if($dunningLetter->fee_amount > 0)
            <p class="mt-4">Zusätzlich berechnen wir eine Mahngebühr in Höhe von <strong>{{ number_format($dunningLetter->fee_amount, 2, ',', '.') }} €</strong>.</p>
            <p class="mt-2 font-semibold text-gray-900">Gesamtbetrag (offener Rechnungsbetrag + Mahngebühr): {{ number_format((float) $invoice->amount + (float) $dunningLetter->fee_amount, 2, ',', '.') }} €</p>
        @endif
    </div>

    {{-- Zahlungshinweis --}}
    <div class="border-t border-gray-200 pt-6 text-gray-600 text-sm">
        <p>Bitte überweisen Sie den {{ $dunningLetter->fee_amount > 0 ? 'Gesamtbetrag' : 'Betrag' }} unter Angabe der Rechnungsnummer <strong class="text-gray-800">{{ $invoice->number }}</strong>.</p>
        <p class="mt-2">Bei Zahlungseingang wird die Angelegenheit für uns erledigt. Sollten Sie bereits gezahlt haben, betrachten Sie dieses Schreiben bitte als gegenstandslos.</p>
    </div>
@endsection
