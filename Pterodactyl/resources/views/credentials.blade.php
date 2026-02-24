{!! $iconAssets !!}

<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary);">Server Access</h3>
    </div>
    <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
        Your login credentials for accessing the server control panel.
    </p>

    <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Server Name</label>
                <input type="text" value="{{ $serverName }}" readonly 
                    class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm cursor-not-allowed">
            </div>
            <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Server ID</label>
                <input type="text" value="{{ $serverIdentifier }}" readonly 
                    class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm cursor-not-allowed">
            </div>
        </div>

        <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Email Address</label>
            <input type="text" value="{{ $userEmail }}" readonly 
                class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm cursor-not-allowed">
        </div>

        <div class="pt-2">
            <a href="{{ $panelUrl }}/server/{{ $serverIdentifier }}" target="_blank" class="inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white rounded-md px-5 py-3 text-sm font-semibold no-underline transition-colors">
                Login to Panel
            </a>
        </div>
    </div>
</div>

