{!! $iconAssets !!}
<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4 flex justify-between items-center">
        <div>
            <h3 class="text-xl font-semibold text-text-primary">
                <i class="ri-database-backup-line mr-2"></i>Backups
            </h3>
            <p class="text-text-secondary text-sm mt-1">Create, manage, and restore server backups with ease</p>
        </div>
        <button onclick="showCreateBackup()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:opacity-90 transition-opacity">
            <i class="ri-add-line mr-2"></i>Create Backup
        </button>
    </div>

    <div class="border border-neutral rounded-lg overflow-hidden">
        <table class="w-full">
            <thead class="bg-background-primary border-b border-neutral">
                <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Name</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Size</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Created</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Status</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Actions</th>
                </tr>
            </thead>
            <tbody>
                @if(!empty($backups) && count($backups) > 0)
                    @foreach($backups as $backup)
                        @php
                            $attrs = $backup['attributes'] ?? [];
                            $name = $attrs['name'] ?? 'Untitled Backup';
                            $size = isset($attrs['size']) ? number_format($attrs['size'] / 1024 / 1024, 2) : '0';
                            $created = isset($attrs['created_at']) ? date('Y-m-d H:i:s', strtotime($attrs['created_at'])) : '-';
                            $isCompleted = ($attrs['completed_at'] ?? null) !== null;
                            $backupId = $attrs['uuid'] ?? '';
                        @endphp
                        <tr class="border-b border-neutral hover:bg-background-primary transition-colors">
                            <td class="px-4 py-3 text-text-primary">{{ $name }}</td>
                            <td class="px-4 py-3 text-text-secondary text-sm">{{ $size }} MB</td>
                            <td class="px-4 py-3 text-text-secondary text-sm">{{ $created }}</td>
                            <td class="px-4 py-3">
                                @if($isCompleted)
                                    <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">Completed</span>
                                @else
                                    <span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">In Progress</span>
                                @endif
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    @if($isCompleted)
                                        <button onclick="restoreBackup('{{ $backupId }}')" 
                                            class="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:opacity-90">
                                            <i class="ri-restart-line mr-1"></i>Restore
                                        </button>
                                        <button onclick="downloadBackup('{{ $backupId }}')" 
                                            class="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:opacity-90">
                                            <i class="ri-download-line mr-1"></i>Download
                                        </button>
                                    @endif
                                    <button onclick="deleteBackup('{{ $backupId }}')" 
                                        class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:opacity-90">
                                        <i class="ri-delete-bin-line mr-1"></i>Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="5" class="px-4 py-8 text-center text-text-secondary">No backups found. Create your first backup to get started.</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>
</div>

<script>
function showCreateBackup() {
    const name = prompt('Enter backup name (optional):', 'Backup ' + new Date().toLocaleString());
    if (name === null) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=backups';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="create">
        <input type="hidden" name="name" value="${name}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function restoreBackup(backupId) {
    if (!confirm('Are you sure you want to restore this backup? This will overwrite your current server files.')) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=backups';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="restore">
        <input type="hidden" name="backup_id" value="${backupId}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function downloadBackup(backupId) {
    window.location.href = '{{ $panelUrl }}/api/client/servers/{{ $serverIdentifier }}/backups/' + backupId + '/download';
}

function deleteBackup(backupId) {
    if (!confirm('Are you sure you want to delete this backup? This action cannot be undone.')) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=backups';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="backup_id" value="${backupId}">
    `;
    document.body.appendChild(form);
    form.submit();
}
</script>
