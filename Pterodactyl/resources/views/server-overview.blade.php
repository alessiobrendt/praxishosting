<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md" data-server-overview>
    <div class="mb-4">
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary);">Server Overview</h3>
    </div>
    <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
        Monitor your server status, resource usage, and manage power controls.
        @if($status === 'offline' && !isset($usage['cpu']) && $usage['cpu'] === 0)
            <br><span style="color:var(--text-warning);">⚠️ Real-time monitoring unavailable. Contact support if this persists.</span>
        @endif
    </p>

    @if($suspended)
        <div class="rounded-lg border border-neutral bg-background-primary p-4 mb-4">
            <p style="color:var(--text-primary); font-weight:600; margin-bottom:0.25rem;">Server Suspended</p>
            <p style="color:var(--text-secondary); font-size:0.875rem;">This server is currently suspended and cannot be accessed.</p>
        </div>
    @endif

    @if($isInstalling)
        <div class="rounded-lg border border-neutral bg-background-primary p-4 mb-4">
            <p style="color:var(--text-primary); font-weight:600; margin-bottom:0.25rem;">Installation in Progress</p>
            <p style="color:var(--text-secondary); font-size:0.875rem;">Your server is currently being installed. This may take a few minutes.</p>
        </div>
    @endif

    <!-- Server Status & Controls -->
    <div class="space-y-6">
        @php
            $displayStatus = strtolower($status ?? 'offline');
        @endphp
        
        <div class="rounded-lg border border-neutral bg-background-primary p-4 flex items-center justify-between gap-4 flex-wrap">
            <div class="flex items-center gap-3">
                <h4 style="font-size:1.125rem; font-weight:600; color:var(--text-primary); margin:0;">{{ $serverName }}</h4>
                
                @if($displayStatus === 'running')
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" style="background-color: rgb(34, 197, 94); color: white;">
                        Online
                    </span>
                @elseif($displayStatus === 'starting')
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" style="background-color: rgb(234, 179, 8); color: white;">
                        Starting
                    </span>
                @elseif($displayStatus === 'stopping')
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" style="background-color: rgb(249, 115, 22); color: white;">
                        Stopping
                    </span>
                @else
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" style="background-color: rgb(107, 114, 128); color: white;">
                        Offline
                    </span>
                @endif
            </div>

            @if(!$suspended && !$isInstalling)
                <div class="flex gap-2">
                    <a href="?action=start&tab=server_overview" class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors no-underline" style="background-color: rgb(34, 197, 94); color: white;">
                        Start
                    </a>
                    <a href="?action=restart&tab=server_overview" class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors no-underline" style="background-color: rgb(55, 65, 81); color: white;">
                        Restart
                    </a>
                    <a href="?action=stop&tab=server_overview" class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors no-underline" style="background-color: rgb(239, 68, 68); color: white;">
                        Stop
                    </a>
                </div>
            @endif
        </div>

        <!-- Server Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Server Name</label>
                <input type="text" value="{{ $serverName }}" readonly 
                    class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary text-sm cursor-not-allowed">
            </div>
            <div>
                <label class="block text-sm font-medium text-text-primary mb-2">IP Address & Port</label>
                <input type="text" value="{{ $allocation }}" readonly 
                    class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm cursor-not-allowed">
            </div>
        </div>

        <!-- Resource Usage -->
        <div>
            <label class="block text-sm font-medium text-text-primary mb-3">Resources</label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- CPU -->
                <div class="rounded-md border border-neutral bg-background-primary p-4">
                    <p style="color:var(--text-secondary); font-size:0.75rem; margin-bottom:0.5rem;">CPU</p>
                    @php
                        $cpuUsage = $usage['cpu'] ?? 0;
                        $cpuLimit = $limits['cpu'] ?? 0;
                    @endphp
                    <p style="color:var(--text-primary); font-weight:700; font-size:1.5rem; margin-bottom:0.25rem;">
                        {{ number_format($cpuUsage, 1) }}%
                        @if($cpuLimit > 0)
                            <span style="color:var(--text-secondary); font-size:0.875rem; font-weight:400;">/ {{ $cpuLimit }}%</span>
                        @else
                            <span style="color:var(--text-secondary); font-size:0.875rem; font-weight:400;">/ ∞</span>
                        @endif
                    </p>
                    @if($cpuLimit > 0 && $cpuUsage > 0)
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                            <div class="bg-primary h-2 rounded-full transition-all duration-300" style="width: {{ min(($cpuUsage / $cpuLimit) * 100, 100) }}%"></div>
                        </div>
                    @endif
                </div>

                <!-- Memory -->
                <div class="rounded-md border border-neutral bg-background-primary p-4">
                    <p style="color:var(--text-secondary); font-size:0.75rem; margin-bottom:0.5rem;">Memory</p>
                    @php
                        $memUsage = $usage['memory'] ?? 0;
                        $memLimit = $limits['memory'] ?? 0;
                        $memUsageGB = round($memUsage / 1024 / 1024 / 1024, 1);
                        $memLimitGB = $memLimit > 0 ? round($memLimit / 1024, 1) : 0;
                    @endphp
                    <p style="color:var(--text-primary); font-weight:700; font-size:1.5rem; margin-bottom:0.25rem;">
                        {{ $memUsageGB }} GB
                        @if($memLimit > 0)
                            <span style="color:var(--text-secondary); font-size:0.875rem; font-weight:400;">/ {{ $memLimitGB }} GB</span>
                        @else
                            <span style="color:var(--text-secondary); font-size:0.875rem; font-weight:400;">/ ∞</span>
                        @endif
                    </p>
                    @if($memLimit > 0 && $memUsage > 0)
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                            <div class="bg-primary h-2 rounded-full transition-all duration-300" style="width: {{ min(($memUsage / ($memLimit * 1024 * 1024)) * 100, 100) }}%"></div>
                        </div>
                    @endif
                </div>

                <!-- Disk -->
                <div class="rounded-md border border-neutral bg-background-primary p-4">
                    <p style="color:var(--text-secondary); font-size:0.75rem; margin-bottom:0.5rem;">Disk</p>
                    @php
                        $diskUsage = $usage['disk'] ?? 0;
                        $diskLimit = $limits['disk'] ?? 0;
                        $diskUsageGB = round($diskUsage / 1024 / 1024 / 1024, 1);
                        $diskLimitGB = $diskLimit > 0 ? round($diskLimit / 1024, 1) : 0;
                    @endphp
                    <p style="color:var(--text-primary); font-weight:700; font-size:1.5rem; margin-bottom:0.25rem;">
                        {{ $diskUsageGB }} GB
                        @if($diskLimit > 0)
                            <span style="color:var(--text-secondary); font-size:0.875rem; font-weight:400;">/ {{ $diskLimitGB }} GB</span>
                        @else
                            <span style="color:var(--text-secondary); font-size:0.875rem; font-weight:400;">/ ∞</span>
                        @endif
                    </p>
                    @if($diskLimit > 0 && $diskUsage > 0)
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                            <div class="bg-primary h-2 rounded-full transition-all duration-300" style="width: {{ min(($diskUsage / ($diskLimit * 1024 * 1024)) * 100, 100) }}%"></div>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Network Usage -->
        @if(isset($usage['network_rx']) && isset($usage['network_tx']))
            <div>
                <label class="block text-sm font-medium text-text-primary mb-3">Network Usage</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="rounded-md border border-neutral bg-background-primary p-4">
                        <p style="color:var(--text-secondary); font-size:0.75rem; margin-bottom:0.25rem;">Inbound</p>
                        <p style="color:var(--text-primary); font-weight:700; font-size:1.125rem;">{{ round($usage['network_rx'] / 1024 / 1024, 2) }} MB</p>
                    </div>
                    <div class="rounded-md border border-neutral bg-background-primary p-4">
                        <p style="color:var(--text-secondary); font-size:0.75rem; margin-bottom:0.25rem;">Outbound</p>
                        <p style="color:var(--text-primary); font-weight:700; font-size:1.125rem;">{{ round($usage['network_tx'] / 1024 / 1024, 2) }} MB</p>
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>

@once
<script>
(function() {
    // Auto-refresh every 1 second
    let refreshInterval;
    let isRefreshing = false;
    
    function isOnOverviewTab() {
        // Check if we're on the overview tab by checking URL and DOM
        const urlParams = new URLSearchParams(window.location.search);
        const currentTab = urlParams.get('tab');
        
        // If no tab parameter, check if we're on default (overview is first tab)
        if (!currentTab) {
            // Check if the overview container exists and is visible
            const overviewContainer = document.querySelector('[data-server-overview]');
            return overviewContainer !== null;
        }
        
        return currentTab === 'server_overview';
    }
    
    function refreshServerOverview() {
        if (isRefreshing) return;
        
        // Check if we're still on the overview tab
        if (!isOnOverviewTab()) {
            if (refreshInterval) {
                clearInterval(refreshInterval);
                refreshInterval = null;
                console.log('Auto-refresh stopped - not on overview tab');
            }
            return;
        }
        
        // Make sure the container still exists
        const currentContainer = document.querySelector('[data-server-overview]');
        if (!currentContainer) {
            if (refreshInterval) {
                clearInterval(refreshInterval);
                refreshInterval = null;
                console.log('Auto-refresh stopped - container not found');
            }
            return;
        }
        
        isRefreshing = true;
        
        // Reload the current view
        const currentUrl = window.location.href;
        
        fetch(currentUrl, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'text/html'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            // Double check we're still on the overview tab before updating
            if (!isOnOverviewTab()) {
                isRefreshing = false;
                if (refreshInterval) {
                    clearInterval(refreshInterval);
                    refreshInterval = null;
                }
                return;
            }
            
            // Parse the response to extract only the overview content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Find the new content
            let newContent = doc.querySelector('[data-server-overview]');
            
            if (newContent) {
                // Find the current container
                let currentContainer = document.querySelector('[data-server-overview]');
                
                if (currentContainer) {
                    // Preserve scroll position
                    const scrollPosition = window.scrollY;
                    
                    // Replace content
                    currentContainer.innerHTML = newContent.innerHTML;
                    
                    // Restore scroll position
                    window.scrollTo(0, scrollPosition);
                    
                    console.log('Server overview refreshed at ' + new Date().toLocaleTimeString());
                }
            }
            
            isRefreshing = false;
        })
        .catch(error => {
            console.error('Failed to refresh server overview:', error);
            isRefreshing = false;
        });
    }
    
    function startAutoRefresh() {
        // Only start if we're on the overview tab
        if (!isOnOverviewTab()) {
            console.log('Not starting auto-refresh - not on overview tab');
            return;
        }
        
        // Clear any existing interval
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
        
        // Start refreshing every 1 second
        refreshInterval = setInterval(refreshServerOverview, 1000);
        
        console.log('Auto-refresh started for server overview');
    }
    
    function stopAutoRefresh() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
            console.log('Auto-refresh stopped');
        }
    }
    
    // Start auto-refresh when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAutoRefresh);
    } else {
        startAutoRefresh();
    }
    
    // Stop refreshing when user navigates away from page
    window.addEventListener('beforeunload', stopAutoRefresh);
    
    // Stop when clicking on other tabs
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes('tab=') && !link.href.includes('tab=server_overview')) {
            stopAutoRefresh();
        }
    });
    
    // Use MutationObserver to detect when overview container is removed
    const observer = new MutationObserver(function(mutations) {
        const overviewContainer = document.querySelector('[data-server-overview]');
        if (!overviewContainer && refreshInterval) {
            stopAutoRefresh();
        }
    });
    
    // Start observing the body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
</script>
@endonce

