@extends('invoices.layout')

@section('title', 'Rechnung '.$invoice->number)

@php
    $statusGroup = in_array($invoice->status, ['void', 'cancelled', 'canceled'], true) ? 'void' : ($invoice->status === 'paid' ? 'paid' : 'open');
    $statusLabel = $statusGroup === 'paid' ? 'Bezahlt' : ($statusGroup === 'void' ? 'Storniert' : 'Offen');
    $statusBadgeClass = $statusGroup === 'paid'
        ? 'bg-green-100 text-green-800 border-green-200'
        : ($statusGroup === 'void'
            ? 'bg-gray-100 text-gray-700 border-gray-300'
            : 'bg-amber-100 text-amber-800 border-amber-200');
@endphp

@section('content')
    @if(session('success'))
        <div class="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{{ session('success') }}</div>
    @endif
    @if(session('error'))
        <div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{{ session('error') }}</div>
    @endif
    @if(session('info'))
        <div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{{ session('info') }}</div>
    @endif

    {{-- Status-Badge oben --}}
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <span class="inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium {{ $statusBadgeClass }}">{{ $statusLabel }}</span>
        <div class="flex flex-wrap items-center gap-2">
            @if($invoice->pdf_path || $invoice->invoice_xml_path)
                <details class="relative invoice-dropdown group">
                    <summary class="inline-flex cursor-pointer list-none items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white invoice-gradient-primary hover:opacity-90 transition-opacity [&::-webkit-details-marker]:hidden">
                        Download
                        <svg class="w-4 h-4 opacity-80 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </summary>
                    <div class="invoice-dropdown-menu absolute right-0 top-full z-10 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                        @if($invoice->pdf_path)
                            <a href="{{ route('invoices.pdf', $invoice) }}" target="_blank" rel="noopener" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">PDF herunterladen</a>
                        @endif
                        @if($invoice->invoice_xml_path)
                            <a href="{{ route('invoices.xml', $invoice) }}" target="_blank" rel="noopener" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">XML herunterladen</a>
                        @endif
                    </div>
                </details>
            @endif
            @if(in_array($invoice->status, ['sent', 'pending'], true))
                <button type="button" onclick="document.getElementById('invoice-pay-modal').showModal()" class="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors">
                    Jetzt bezahlen
                </button>
            @endif
        </div>
    </div>

    {{-- Header: Logo + Absender + Rechnungstitel --}}
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
            <div class="inline-block px-4 py-2 rounded-lg invoice-gradient-primary text-white text-lg font-bold uppercase tracking-tight shadow-md">Rechnung</div>
            <div class="mt-2 text-gray-600 font-medium">{{ $invoice->number }}</div>
        </div>
    </div>

    {{-- Rechnungsempfänger --}}
    <div class="border-l-4 invoice-border-primary bg-gray-50/80 rounded-r-lg pl-5 pr-4 py-4 mb-8">
        <h2 class="text-xs font-semibold uppercase tracking-wider invoice-text-primary mb-2">Rechnungsempfänger</h2>
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

    {{-- Rechnungsdetails --}}
    <div class="flex flex-wrap gap-x-8 gap-y-1 mb-8 text-gray-700 text-xs">
        <div><span class="font-medium text-gray-500">Rechnungsdatum:</span> {{ $invoice->invoice_date->format('d.m.Y') }}</div>
        @if($invoice->due_date)
            <div><span class="font-medium text-gray-500">Zahlbar bis:</span> {{ $invoice->due_date->format('d.m.Y') }}</div>
        @endif
        @if($invoice->billing_period_start && $invoice->billing_period_end)
            <div><span class="font-medium text-gray-500">Leistungszeitraum:</span> {{ $invoice->billing_period_start->format('d.m.Y') }} – {{ $invoice->billing_period_end->format('d.m.Y') }}</div>
        @endif
    </div>

    {{-- Positionstabelle --}}
    <table class="w-full text-left border-collapse">
        <thead>
            <tr class="border-b-2 invoice-border-primary invoice-bg-primary/5">
                <th class="py-3 pr-4 font-semibold invoice-text-primary uppercase text-xs tracking-wider w-12">Pos.</th>
                <th class="py-3 pr-4 font-semibold invoice-text-primary uppercase text-xs tracking-wider">Beschreibung</th>
                <th class="py-3 pl-4 text-right font-semibold invoice-text-primary uppercase text-xs tracking-wider w-28">Betrag</th>
            </tr>
        </thead>
        <tbody>
            @if($invoice->lineItems->isNotEmpty())
                @foreach($invoice->lineItems as $item)
                    <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                        <td class="py-4 pr-4 text-gray-700">{{ $item->position }}</td>
                        <td class="py-4 pr-4 text-gray-700">{{ $item->description }}</td>
                        <td class="py-4 pl-4 text-right font-medium text-gray-900 tabular-nums">{{ number_format($item->amount, 2, ',', '.') }} €</td>
                    </tr>
                @endforeach
            @else
                <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                    <td class="py-4 pr-4 text-gray-700">1</td>
                    <td class="py-4 pr-4 text-gray-700">
                        @if($invoice->type === 'ai_tokens')
                            AI-Token-Paket ({{ number_format(($invoice->metadata ?? [])['token_amount'] ?? 0, 0, ',', '.') }} Tokens)
                        @elseif($invoice->siteSubscription && $invoice->siteSubscription->site)
                            Abonnement „Meine Seiten“ – {{ $invoice->siteSubscription->site->name }}
                        @else
                            Abonnement „Meine Seiten“
                        @endif
                        @if($invoice->type !== 'ai_tokens' && $invoice->billing_period_start && $invoice->billing_period_end)
                            <span class="text-gray-500">({{ $invoice->billing_period_start->format('d.m.Y') }} – {{ $invoice->billing_period_end->format('d.m.Y') }})</span>
                        @endif
                    </td>
                    <td class="py-4 pl-4 text-right font-medium text-gray-900 tabular-nums">{{ number_format($invoice->amount, 2, ',', '.') }} €</td>
                </tr>
            @endif
        </tbody>
    </table>

    {{-- Summen --}}
    <div class="flex justify-end mt-6">
        <table class="w-72 border-t-2 invoice-border-primary">
            <tr>
                <td class="py-3 pr-4 font-semibold text-gray-800">Gesamtbetrag</td>
                <td class="py-3 pl-4 text-right font-bold invoice-text-primary tabular-nums text-base">{{ number_format($invoice->amount, 2, ',', '.') }} €</td>
            </tr>
        </table>
    </div>

    {{-- Footer --}}
    <div class="mt-12 pt-6 border-t border-gray-200 text-gray-500 text-xs">
        <p class="italic">{{ $company['ustg_19_text'] ?? 'Gemäß § 19 UStG wird keine Umsatzsteuer ausgewiesen (Kleinunternehmerregelung).' }}</p>
        @if($invoice->status !== 'paid')
            <p class="mt-4 text-gray-600">Bitte überweisen Sie den Betrag unter Angabe der Rechnungsnummer <strong class="text-gray-800">{{ $invoice->number }}</strong>. Vielen Dank.</p>
        @endif
    </div>

    @if(in_array($invoice->status, ['sent', 'pending'], true) && isset($payInvoiceUrl))
        {{-- Zahlungs-Modal (wie Game-Server Verlängern) --}}
        <dialog id="invoice-pay-modal" class="rounded-xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/30" style="max-width: 28rem;">
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900">Rechnung bezahlen</h3>
                <p class="mt-1 text-sm text-gray-500">Wählen Sie die Zahlungsart für Rechnung {{ $invoice->number }}.</p>
                <p class="mt-3 text-sm font-medium text-gray-700">Betrag: {{ number_format((float) $invoice->amount, 2, ',', '.') }} €</p>

                <div class="mt-4 space-y-3">
                    <form method="post" action="{{ $payInvoiceUrl }}" class="block">
                        @csrf
                        <input type="hidden" name="payment_method" value="stripe" />
                        <button type="submit" class="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors hover:bg-gray-50">
                            <img src="https://logo.svgcdn.com/l/stripe.svg" alt="Stripe" class="h-5 w-5 object-contain opacity-90" />
                            <span class="text-sm font-medium">Mit Stripe zahlen (Karte, SEPA, Apple Pay, …)</span>
                        </button>
                    </form>

                    @if(!empty($canPayWithBalance))
                        @php $canUseBalance = $customerBalance >= (float) $invoice->amount && (float) $invoice->amount > 0; @endphp
                        <form method="post" action="{{ $payInvoiceUrl }}" class="block">
                            @csrf
                            <input type="hidden" name="payment_method" value="balance" />
                            <button type="submit" class="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 text-left transition-colors {{ $canUseBalance ? 'hover:bg-gray-50' : 'cursor-not-allowed opacity-60' }}" {{ $canUseBalance ? '' : 'disabled' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
                                <span class="text-sm font-medium">Mit Guthaben bezahlen</span>
                                @if($canUseBalance)
                                    <span class="ml-auto text-sm text-gray-500">({{ number_format($customerBalance, 2, ',', '.') }} € verfügbar)</span>
                                @else
                                    <span class="ml-auto text-xs text-gray-500">{{ $customerBalance >= (float) $invoice->amount ? '' : 'Guthaben reicht nicht aus' }}</span>
                                @endif
                            </button>
                        </form>
                    @endif
                </div>

                <div class="mt-6 flex justify-end">
                    <button type="button" onclick="document.getElementById('invoice-pay-modal').close()" class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Abbrechen
                    </button>
                </div>
            </div>
        </dialog>
    @endif
@endsection
