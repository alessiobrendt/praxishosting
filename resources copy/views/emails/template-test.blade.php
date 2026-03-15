@extends('emails.layout')

@section('title', $content['subject'] ?? 'Test-E-Mail')

@section('content')
    <div class="prose prose-sm max-w-none mb-4">
        <p class="mt-0">{!! \Illuminate\Support\Str::markdown($content['greeting']) !!}</p>

        @foreach(explode("\n", $content['body']) as $line)
            @if(trim($line) !== '')
                <p class="my-2">{!! \Illuminate\Support\Str::markdown($line) !!}</p>
            @endif
        @endforeach
    </div>

    @if(!empty($content['action_text']) && $actionUrl)
        <div class="text-center my-6">
            <a href="{{ $actionUrl }}"
               class="inline-block gradient-primary text-white px-6 py-3 rounded-lg font-semibold no-underline shadow-md">
                {{ $content['action_text'] }}
            </a>
        </div>
    @endif

    <p class="text-xs text-gray-500 mt-6">
        Diese E-Mail wurde als Test-Versand aus dem Admin-Bereich gesendet.
    </p>
@endsection
