{!! $iconAssets !!}

<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 style="font-size:1.25rem; font-weight:600; color:var(--text-primary);">Edit Server Properties</h3>
    </div>
    <p style="color:var(--text-secondary); font-size:0.875rem; margin-bottom:1.5rem;">
        Modify the server configuration properties used for communication with the control panel. Ensure all values are accurate before saving.
    </p>

    <form method="GET" class="space-y-4">
        <input type="hidden" name="tab" value="edit_server_properties">
        <input type="hidden" name="update_server_properties" value="1">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Server ID</label>
                <input type="text" name="server_id" value="{{ $serverId }}" 
                    class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="123">
            </div>
            <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Server Identifier</label>
                <input type="text" name="server_identifier" value="{{ $serverIdentifier }}" 
                    class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="abc123def">
            </div>
        </div>
        
        <div>
            <label class="block text-sm font-medium text-text-primary mb-2">Server Name</label>
            <input type="text" name="server_name" value="{{ $serverName }}" 
                class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                placeholder="My Server">
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-text-primary mb-2">User ID</label>
                <input type="text" name="user_id" value="{{ $userId }}" 
                    class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="456">
            </div>
            <div>
                <label class="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                <input type="email" name="user_email" value="{{ $userEmail }}" 
                    class="w-full px-4 py-3 rounded-md border border-neutral bg-background-primary text-text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="user@example.com">
            </div>
        </div>

        <div class="flex justify-end gap-3">
            <button type="button" onclick="history.back()" class="inline-flex items-center bg-background-primary hover:bg-background-secondary border border-neutral text-text-primary rounded-md px-5 py-3 font-medium cursor-pointer text-sm transition-colors">
                Cancel
            </button>
            <button type="submit" class="inline-flex items-center bg-primary hover:bg-primary/90 text-white border-none rounded-md px-5 py-3 font-medium cursor-pointer text-sm transition-colors">
                Save Changes
            </button>
        </div>
    </form>
</div>
