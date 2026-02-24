<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary);">Failed to Load Server Information</h3>
    </div>
    <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
        {{ $errorMessage }}
    </p>
    <div class="rounded-md border border-neutral bg-background-primary p-4">
        <p style="color:var(--text-primary); font-weight:600; margin-bottom:0.75rem; font-size:0.875rem;">Troubleshooting</p>
        <ul class="space-y-2" style="color:var(--text-secondary); font-size:0.875rem;">
            <li>• Ensure your Pterodactyl panel is accessible</li>
            <li>• Check that the API key has the correct permissions</li>
            <li>• Verify the server still exists in the panel</li>
            <li>• Contact support if the issue persists</li>
        </ul>
    </div>
</div>

