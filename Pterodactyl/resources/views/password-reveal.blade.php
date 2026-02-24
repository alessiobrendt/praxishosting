{!! $iconAssets !!}

<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary);">Password Management</h3>
    </div>
    <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
        View your current password or generate a new one. The password will automatically hide after 15 seconds for security.
    </p>

    <div class="space-y-4 mb-6">
        <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Email Address</label>
            <input type="text" value="{{ $userEmail }}" readonly 
                class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm cursor-not-allowed">
        </div>

        <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Current Password</label>
            <div class="relative">
                <input type="password" id="revealedPasswordField" value="{{ $password }}" readonly 
                    class="w-full px-4 py-3 pr-12 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm font-bold">
                <button type="button" onclick="togglePasswordVisibility('revealedPasswordField', this)" 
                    aria-label="Toggle password visibility"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors">
                    <i class="ri-eye-line text-lg"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="border-t border-neutral pt-6">
        <div class="mb-4">
            <h4 style="font-size:1rem; font-weight:600; color:var(--text-primary);">Reset Password</h4>
        </div>
        <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
            Generate a new secure password. This will immediately replace your current password and apply it to your server.
        </p>
        <div class="flex justify-end">
            <a href="?tab=reveal_password&confirm_generate_password=1" class="inline-flex items-center bg-primary hover:bg-primary/90 text-white rounded-md px-5 py-3 text-sm font-semibold no-underline transition-colors">
                Generate New Password
            </a>
        </div>
    </div>
</div>

<script>
    function togglePasswordVisibility(fieldId, button) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        const icon = button.querySelector('i');
        
        if (field.type === 'password') {
            field.type = 'text';
            if (icon) {
                icon.classList.remove('ri-eye-line');
                icon.classList.add('ri-eye-off-line');
            }
        } else {
            field.type = 'password';
            if (icon) {
                icon.classList.remove('ri-eye-off-line');
                icon.classList.add('ri-eye-line');
            }
        }
    }

    setTimeout(() => {
        const field = document.getElementById('revealedPasswordField');
        if (field) {
            field.type = 'password';
            field.value = '***************';
        }
    }, {{ $autoHideMilliseconds }});
</script>
