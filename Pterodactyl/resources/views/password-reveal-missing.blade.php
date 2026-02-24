{!! $iconAssets !!}

<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary);">Password Unavailable</h3>
    </div>
    <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
        No cached password is available for this server. This may occur if the server was recently created, the password was manually changed in the control panel, or the cache was cleared.
    </p>

    <div class="flex justify-end gap-3">
        <a href="?tab=show_credentials" class="inline-flex items-center bg-background-primary hover:bg-background-secondary border border-neutral text-text-primary rounded-md px-5 py-3 text-sm font-semibold no-underline transition-colors">
            Back to Credentials
        </a>
        <a href="?tab=reveal_password&confirm_generate_password=1" class="inline-flex items-center bg-primary hover:bg-primary/90 text-white rounded-md px-5 py-3 text-sm font-semibold no-underline transition-colors">
            Generate New Password
        </a>
    </div>
</div>
