{!! $iconAssets !!}
<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 class="text-xl font-semibold text-text-primary">
            <i class="ri-settings-3-line mr-2"></i>Server Settings
        </h3>
        <p class="text-text-secondary text-sm mt-1">Customize startup parameters, variables, and power actions</p>
    </div>

    <div class="space-y-6">
        <!-- Startup Command -->
        <div class="border border-neutral rounded-lg p-4">
            <h4 class="text-lg font-semibold text-text-primary mb-3">Startup Command</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-text-secondary mb-2">Command</label>
                <textarea id="startup-command" class="w-full px-4 py-2 border border-neutral rounded-md bg-background-primary text-text-primary font-mono" 
                    rows="3" readonly>{{ isset($startup) && is_array($startup) ? ($startup['startup'] ?? '') : '' }}</textarea>
                <p class="text-xs text-text-secondary mt-1">This is read-only. Contact support to modify the startup command.</p>
            </div>
        </div>

        <!-- Docker Image -->
        <div class="border border-neutral rounded-lg p-4">
            <h4 class="text-lg font-semibold text-text-primary mb-3">Docker Image</h4>
            <div class="mb-3">
                <label class="block text-sm font-medium text-text-secondary mb-2">Image</label>
                <input type="text" id="docker-image" value="{{ isset($startup) && is_array($startup) ? ($startup['docker_image'] ?? '') : '' }}" 
                    class="w-full px-4 py-2 border border-neutral rounded-md bg-background-primary text-text-primary font-mono" readonly>
                <p class="text-xs text-text-secondary mt-1">This is read-only. Contact support to modify the Docker image.</p>
            </div>
        </div>

        <!-- Environment Variables -->
        <div class="border border-neutral rounded-lg p-4">
            <h4 class="text-lg font-semibold text-text-primary mb-3">Environment Variables</h4>
            <div class="space-y-3">
                @if(!empty($variables) && is_array($variables))
                    @foreach($variables as $key => $value)
                        <div class="flex gap-2 items-center">
                            <label class="block text-sm font-medium text-text-secondary w-1/3">{{ $key }}</label>
                            <input type="text" value="{{ $value }}" 
                                class="flex-1 px-4 py-2 border border-neutral rounded-md bg-background-primary text-text-primary font-mono"
                                data-key="{{ $key }}" 
                                onchange="updateVariable('{{ $key }}', this.value)">
                        </div>
                    @endforeach
                @else
                    <p class="text-text-secondary text-sm">No environment variables available</p>
                @endif
            </div>
        </div>

        <!-- Power Actions -->
        <div class="border border-neutral rounded-lg p-4">
            <h4 class="text-lg font-semibold text-text-primary mb-3">Power Actions</h4>
            <div class="flex gap-2 flex-wrap">
                <button onclick="sendPowerAction('start')" class="px-4 py-2 bg-green-600 text-white rounded-md hover:opacity-90 transition-opacity">
                    <i class="ri-play-line mr-2"></i>Start Server
                </button>
                <button onclick="sendPowerAction('stop')" class="px-4 py-2 bg-red-600 text-white rounded-md hover:opacity-90 transition-opacity">
                    <i class="ri-stop-line mr-2"></i>Stop Server
                </button>
                <button onclick="sendPowerAction('restart')" class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:opacity-90 transition-opacity">
                    <i class="ri-restart-line mr-2"></i>Restart Server
                </button>
                <button onclick="sendPowerAction('kill')" class="px-4 py-2 bg-red-800 text-white rounded-md hover:opacity-90 transition-opacity">
                    <i class="ri-close-circle-line mr-2"></i>Kill Server
                </button>
            </div>
        </div>
    </div>
</div>

<script>
function updateVariable(key, value) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=settings';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="update_startup">
        <input type="hidden" name="key" value="${key}">
        <input type="hidden" name="value" value="${value}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function sendPowerAction(action) {
    if (!confirm(`Are you sure you want to ${action} the server?`)) return;
    
    window.location.href = '?tab=server_overview&action=' + action;
}
</script>
