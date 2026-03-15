@extends('emails.layout')

@section('title', $post->subject)

@section('content')
    <div class="prose prose-sm max-w-none mb-4">
        @foreach(explode("\n", $post->body) as $line)
            @if(trim($line) !== '')
                <p class="my-2">{!! \Illuminate\Support\Str::markdown($line) !!}</p>
            @endif
        @endforeach
    </div>

    <p class="text-xs text-gray-500 mt-6">
        Sie erhalten diese E-Mail, weil Sie den Newsletter von {{ $post->site->name }} abonniert haben.
    </p>
@endsection
