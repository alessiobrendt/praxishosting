{!! $iconAssets !!}
<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4 flex justify-between items-center">
        <div>
            <h3 class="text-xl font-semibold text-text-primary">
                <i class="ri-database-2-line mr-2"></i>Databases
            </h3>
            <p class="text-text-secondary text-sm mt-1">Full access to linked databases with credentials and actions</p>
        </div>
        <button onclick="showCreateDatabase()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:opacity-90 transition-opacity">
            <i class="ri-add-line mr-2"></i>Create Database
        </button>
    </div>

    <div class="border border-neutral rounded-lg overflow-hidden">
        <table class="w-full">
            <thead class="bg-background-primary border-b border-neutral">
                <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Database</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Username</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Host</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Actions</th>
                </tr>
            </thead>
            <tbody>
                @if(!empty($databases) && count($databases) > 0)
                    @foreach($databases as $database)
                        @php
                            $attrs = $database['attributes'] ?? [];
                            $dbName = $attrs['name'] ?? 'Unknown';
                            $username = $attrs['username'] ?? 'Unknown';
                            $host = $attrs['host']['address'] ?? 'localhost';
                            $port = $attrs['host']['port'] ?? 3306;
                            $password = $attrs['password'] ?? '';
                            $databaseId = $attrs['id'] ?? '';
                        @endphp
                        <tr class="border-b border-neutral hover:bg-background-primary transition-colors">
                            <td class="px-4 py-3 text-text-primary font-mono">{{ $dbName }}</td>
                            <td class="px-4 py-3 text-text-primary font-mono">{{ $username }}</td>
                            <td class="px-4 py-3 text-text-secondary text-sm">{{ $host }}:{{ $port }}</td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <button onclick="showCredentials('{{ $dbName }}', '{{ $username }}', '{{ $password }}', '{{ $host }}', '{{ $port }}')" 
                                        class="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:opacity-90">
                                        <i class="ri-key-line mr-1"></i>Show Password
                                    </button>
                                    <button onclick="resetPassword('{{ $databaseId }}')" 
                                        class="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:opacity-90">
                                        <i class="ri-refresh-line mr-1"></i>Reset Password
                                    </button>
                                    <button onclick="deleteDatabase('{{ $databaseId }}')" 
                                        class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:opacity-90">
                                        <i class="ri-delete-bin-line mr-1"></i>Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="4" class="px-4 py-8 text-center text-text-secondary">No databases found. Create your first database to get started.</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>
</div>

<div id="credentials-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-background-primary rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-text-primary mb-4">Database Credentials</h3>
        <div class="space-y-3">
            <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Database Name</label>
                <input type="text" id="cred-db-name" readonly class="w-full px-3 py-2 border border-neutral rounded bg-background-secondary text-text-primary font-mono">
            </div>
            <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Username</label>
                <input type="text" id="cred-username" readonly class="w-full px-3 py-2 border border-neutral rounded bg-background-secondary text-text-primary font-mono">
            </div>
            <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Password</label>
                <input type="password" id="cred-password" readonly class="w-full px-3 py-2 border border-neutral rounded bg-background-secondary text-text-primary font-mono">
                <button onclick="togglePasswordVisibility()" class="mt-2 text-sm text-primary hover:underline">
                    <i id="password-icon" class="ri-eye-line mr-1"></i>Show/Hide
                </button>
            </div>
            <div>
                <label class="block text-sm font-medium text-text-secondary mb-1">Host</label>
                <input type="text" id="cred-host" readonly class="w-full px-3 py-2 border border-neutral rounded bg-background-secondary text-text-primary font-mono">
            </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
            <button onclick="copyCredentials()" class="px-4 py-2 bg-primary text-white rounded hover:opacity-90">
                <i class="ri-file-copy-line mr-2"></i>Copy All
            </button>
            <button onclick="closeCredentialsModal()" class="px-4 py-2 bg-gray-600 text-white rounded hover:opacity-90">
                Close
            </button>
        </div>
    </div>
</div>

<script>
function showCreateDatabase() {
    const database = prompt('Enter database name:');
    if (!database) return;
    
    const remote = prompt('Enter allowed IP (leave blank for any):', '%');
    if (remote === null) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=databases';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="create">
        <input type="hidden" name="database" value="${database}">
        <input type="hidden" name="remote" value="${remote || '%'}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function showCredentials(dbName, username, password, host, port) {
    document.getElementById('cred-db-name').value = dbName;
    document.getElementById('cred-username').value = username;
    document.getElementById('cred-password').value = password;
    document.getElementById('cred-host').value = host + ':' + port;
    document.getElementById('credentials-modal').classList.remove('hidden');
}

function closeCredentialsModal() {
    document.getElementById('credentials-modal').classList.add('hidden');
    document.getElementById('cred-password').type = 'password';
}

function togglePasswordVisibility() {
    const input = document.getElementById('cred-password');
    const icon = document.getElementById('password-icon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'ri-eye-off-line mr-1';
    } else {
        input.type = 'password';
        icon.className = 'ri-eye-line mr-1';
    }
}

function copyCredentials() {
    const dbName = document.getElementById('cred-db-name').value;
    const username = document.getElementById('cred-username').value;
    const password = document.getElementById('cred-password').value;
    const host = document.getElementById('cred-host').value;
    
    const text = `Database: ${dbName}\nUsername: ${username}\nPassword: ${password}\nHost: ${host}`;
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Credentials copied to clipboard!');
    });
}

function resetPassword(databaseId) {
    if (!confirm('Are you sure you want to reset the password for this database?')) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=databases';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="reset_password">
        <input type="hidden" name="database_id" value="${databaseId}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function deleteDatabase(databaseId) {
    if (!confirm('Are you sure you want to delete this database? This action cannot be undone.')) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=databases';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="database_id" value="${databaseId}">
    `;
    document.body.appendChild(form);
    form.submit();
}
</script>
