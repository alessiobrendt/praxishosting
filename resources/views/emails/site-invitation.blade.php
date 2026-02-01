@extends('emails.layout')

@section('title', 'Einladung zur Site')

@section('content')
    <h1 class="text-xl font-bold text-emerald-700 mt-0 mb-4">Sie wurden eingeladen!</h1>

    <p class="mb-4">Hallo,</p>

    <p class="mb-4">
        {{ $invitation->inviter->name }} hat Sie eingeladen, als Mitbearbeiter an der Site
        <strong>{{ $invitation->site->name }}</strong> mitzuarbeiten.
    </p>

    <div class="border-l-4 border-emerald-600 bg-gray-50 rounded-r-lg pl-5 pr-4 py-4 mb-6">
        <p class="m-0"><strong>Site:</strong> {{ $invitation->site->name }}</p>
        <p class="mt-2 mb-0"><strong>Rolle:</strong> {{ ucfirst($invitation->role) }}</p>
    </div>

    <div class="text-center my-8">
        <a href="{{ route('register', ['token' => $invitation->token]) }}"
           class="inline-block gradient-primary text-white px-6 py-3 rounded-lg font-semibold no-underline shadow-md">
            Einladung annehmen
        </a>
    </div>

    <p class="text-xs text-gray-500 mt-6">
        Diese Einladung ist 7 Tage gültig. Falls Sie kein Konto haben, können Sie sich nach dem Klick auf den Button registrieren.
    </p>

    <p class="text-xs text-gray-500">
        Falls Sie diese Einladung nicht erwartet haben, können Sie diese E-Mail ignorieren.
    </p>
@endsection
