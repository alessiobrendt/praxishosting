{!! $iconAssets !!}

<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary);">Properties Updated</h3>
    </div>
    <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
        All server properties have been successfully updated and saved to the system.
    </p>

    <div class="bg-background border border-neutral rounded-md p-4 mb-6">
        <table class="w-full text-sm">
            <tbody style="color:var(--text-secondary);">
                <tr class="border-b border-neutral/50">
                    <td class="py-2">Server ID</td>
                    <td class="py-2 text-right font-mono text-text-primary">{{ $serverId }}</td>
                </tr>
                <tr class="border-b border-neutral/50">
                    <td class="py-2">Server Name</td>
                    <td class="py-2 text-right font-mono text-text-primary">{{ $serverName }}</td>
                </tr>
                <tr class="border-b border-neutral/50">
                    <td class="py-2">Server Identifier</td>
                    <td class="py-2 text-right font-mono text-text-primary">{{ $serverIdentifier }}</td>
                </tr>
                <tr class="border-b border-neutral/50">
                    <td class="py-2">User ID</td>
                    <td class="py-2 text-right font-mono text-text-primary">{{ $userId }}</td>
                </tr>
                <tr>
                    <td class="py-2">Email</td>
                    <td class="py-2 text-right font-mono text-text-primary">{{ $userEmail }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="flex justify-end gap-3">
        <button type="button" onclick="history.back()" class="inline-flex items-center bg-background-primary hover:bg-background-secondary border border-neutral text-text-primary rounded-md px-5 py-3 font-medium cursor-pointer text-sm transition-colors">
            Go Back
        </button>
        <button type="button" onclick="window.location.reload()" class="inline-flex items-center bg-primary hover:bg-primary/90 text-white border-none rounded-md px-5 py-3 font-medium cursor-pointer text-sm transition-colors">
            Refresh
        </button>
    </div>
</div>
