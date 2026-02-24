{!! $iconAssets !!}

<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary);">{{ $title }}</h3>
    </div>
    <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
        The following errors were encountered while processing your request:
    </p>

    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md px-4 py-3 mb-6">
        <ul class="text-sm text-red-600 dark:text-red-400 space-y-1">
            @foreach($messages as $message)
                <li>{{ $message }}</li>
            @endforeach
        </ul>
    </div>
    
    <div class="flex justify-end gap-3">
        <button type="button" onclick="window.location.reload()" class="inline-flex items-center bg-background-primary hover:bg-background-secondary border border-neutral text-text-primary rounded-md px-5 py-3 font-medium cursor-pointer text-sm transition-colors">
            Reload
        </button>
        <button type="button" onclick="history.back()" class="inline-flex items-center bg-primary hover:bg-primary/90 text-white rounded-md px-5 py-3 font-medium cursor-pointer text-sm transition-colors">
            Go Back
        </button>
    </div>
</div>
