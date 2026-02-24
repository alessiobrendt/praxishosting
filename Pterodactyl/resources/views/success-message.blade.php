{!! $iconAssets !!}

<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary);">{{ $title }}</h3>
    </div>
    
    <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
        {{ $message }}
    </p>

    <div class="bg-background border border-neutral rounded-md px-4 py-3 text-center">
        <p style="color:var(--text-secondary); font-size:0.875rem;">
            Redirecting in <span id="countdown">2</span> seconds...
        </p>
    </div>
</div>

<script>
    (function() {
        let seconds = 2;
        const countdownEl = document.getElementById('countdown');
        
        const interval = setInterval(() => {
            seconds--;
            if (countdownEl) {
                countdownEl.textContent = seconds;
            }
            
            if (seconds <= 0) {
                clearInterval(interval);
                window.location.href = '?tab={{ $redirectTab }}';
            }
        }, 1000);
    })();
</script>
