@extends('pdf.layout')

@section('title', 'Angebot '.$quote->number)

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
            @if(!empty($company['company_vat_id']))<div class="mt-1 text-gray-500 text-xs">USt-IdNr.: {{ $company['company_vat_id'] }}</div>@endif
        </div>
        <div class="text-right">
            <div class="inline-block px-4 py-2 rounded-lg gradient-primary text-white text-lg font-bold uppercase tracking-tight shadow-md">Angebot</div>
            <div class="mt-2 text-gray-600 font-medium">{{ $quote->number }}</div>
        </div>
    </div>

    {{-- Empfänger --}}
    <div class="border-l-4 border-emerald-600 bg-gray-50/80 rounded-r-lg pl-5 pr-4 py-4 mb-8">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">Angebotsempfänger</h2>
        <div class="text-gray-700">
            @if($quote->user->company)<div class="font-medium text-gray-900">{{ $quote->user->company }}</div>@endif
            <div>{{ $quote->user->name }}</div>
            @if($quote->user->street)<div>{{ $quote->user->street }}</div>@endif
            @if($quote->user->postal_code || $quote->user->city)
                <div>{{ trim(($quote->user->postal_code ?? '').' '.($quote->user->city ?? '')) }}</div>
            @endif
            @if($quote->user->country)<div>{{ config('countries.'.$quote->user->country, $quote->user->country) }}</div>@endif
            <div class="mt-1 text-gray-500 text-xs">{{ $quote->user->email }}</div>
        </div>
    </div>

    {{-- Details --}}
    <div class="flex flex-wrap gap-x-8 gap-y-1 mb-8 text-gray-700 text-xs">
        <div><span class="font-medium text-gray-500">Angebotsdatum:</span> {{ $quote->invoice_date->format('d.m.Y') }}</div>
        @if($quote->valid_until)
            <div><span class="font-medium text-gray-500">Gültig bis:</span> {{ $quote->valid_until->format('d.m.Y') }}</div>
        @endif
    </div>

    {{-- Positionstabelle --}}
    <table class="w-full text-left border-collapse">
        <thead>
            <tr class="border-b-2 border-emerald-600 bg-emerald-50/50">
                <th class="py-3 pr-4 font-semibold text-emerald-800 uppercase text-xs tracking-wider w-12">Pos.</th>
                <th class="py-3 pr-4 font-semibold text-emerald-800 uppercase text-xs tracking-wider">Beschreibung</th>
                <th class="py-3 pl-4 text-right font-semibold text-emerald-800 uppercase text-xs tracking-wider w-28">Betrag</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quote->lineItems as $item)
                <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                    <td class="py-4 pr-4 text-gray-700">{{ $item->position }}</td>
                    <td class="py-4 pr-4 text-gray-700">{{ $item->description }}</td>
                    <td class="py-4 pl-4 text-right font-medium text-gray-900 tabular-nums">{{ number_format($item->amount, 2, ',', '.') }} €</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- Summen --}}
    <div class="flex justify-end mt-6">
        <table class="w-72 border-t-2 border-emerald-600">
            <tr>
                <td class="py-3 pr-4 font-semibold text-gray-800">Gesamtbetrag</td>
                <td class="py-3 pl-4 text-right font-bold text-emerald-700 tabular-nums text-base">{{ number_format($quote->amount, 2, ',', '.') }} €</td>
            </tr>
        </table>
    </div>

    {{-- Footer --}}
    <div class="mt-12 pt-6 border-t border-gray-200 text-gray-500 text-xs">
        <p class="italic">{{ $company['ustg_19_text'] ?? 'Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen (Kleinunternehmerregelung).' }}</p>
    </div>
@endsection
