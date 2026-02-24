{!! $iconAssets !!}
<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4 flex justify-between items-center">
        <div>
            <h3 class="text-xl font-semibold text-text-primary">
                <i class="ri-folder-line mr-2"></i>File Browser
            </h3>
            <p class="text-text-secondary text-sm mt-1">Double-click to open, drag & drop to upload</p>
        </div>
        <div class="flex gap-2">
            <button onclick="refreshFiles()" class="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity text-sm">
                <i class="ri-refresh-line mr-2"></i>Refresh
            </button>
            <button onclick="showCreateFolder()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:opacity-90 transition-opacity text-sm">
                <i class="ri-add-line mr-2"></i>New Folder
            </button>
        </div>
    </div>

    <div class="mb-4">
        <div class="flex items-center gap-2 text-sm">
            <a href="?tab=file_browser&directory=/" class="text-primary hover:underline">Root</a>
            @if($currentDirectory !== '/')
                @foreach(explode('/', trim($currentDirectory, '/')) as $index => $part)
                    @if($part)
                        <span>/</span>
                        <a href="?tab=file_browser&directory={{ urlencode('/' . implode('/', array_slice(explode('/', trim($currentDirectory, '/')), 0, $index + 1))) }}" class="text-primary hover:underline">{{ $part }}</a>
                    @endif
                @endforeach
            @endif
        </div>
    </div>

    <div id="drop-zone" class="border-2 border-dashed border-neutral rounded-lg p-8 mb-4 text-center hover:border-primary transition-colors">
        <i class="ri-upload-cloud-line text-4xl text-text-secondary mb-2"></i>
        <p class="text-text-primary font-medium">Drag & drop files here to upload</p>
        <p class="text-text-secondary text-sm mt-1">or</p>
        <label class="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:opacity-90 transition-opacity">
            <i class="ri-file-upload-line mr-2"></i>Select Files
            <input type="file" id="file-input" multiple class="hidden" onchange="handleFileSelect(event)">
        </label>
    </div>

    <div class="border border-neutral rounded-lg overflow-hidden">
        <table class="w-full">
            <thead class="bg-background-primary border-b border-neutral">
                <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Name</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Size</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Modified</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Actions</th>
                </tr>
            </thead>
            <tbody id="files-table-body">
                @if(!empty($files))
                    @foreach($files as $file)
                        <tr class="border-b border-neutral hover:bg-background-primary transition-colors cursor-pointer" 
                            data-name="{{ $file['attributes']['name'] ?? '' }}"
                            data-type="{{ $file['attributes']['mime'] ?? '' }}"
                            ondblclick="handleDoubleClick(this)">
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    @if(($file['attributes']['mime'] ?? '') === 'inode/directory')
                                        <i class="ri-folder-line text-yellow-500"></i>
                                    @else
                                        <i class="ri-file-line text-blue-500"></i>
                                    @endif
                                    <span class="text-text-primary">{{ $file['attributes']['name'] ?? 'Unknown' }}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-text-secondary text-sm">
                                @if(($file['attributes']['mime'] ?? '') !== 'inode/directory')
                                    {{ number_format(($file['attributes']['size'] ?? 0) / 1024, 2) }} KB
                                @else
                                    -
                                @endif
                            </td>
                            <td class="px-4 py-3 text-text-secondary text-sm">
                                {{ isset($file['attributes']['modified_at']) ? date('Y-m-d H:i', strtotime($file['attributes']['modified_at'])) : '-' }}
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    @if(($file['attributes']['mime'] ?? '') !== 'inode/directory')
                                        <button onclick="downloadFile('{{ $file['attributes']['name'] ?? '' }}')" 
                                            class="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:opacity-90">
                                            <i class="ri-download-line"></i>
                                        </button>
                                    @endif
                                    <button onclick="deleteFile('{{ $file['attributes']['name'] ?? '' }}')" 
                                        class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:opacity-90">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="4" class="px-4 py-8 text-center text-text-secondary">No files found</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>
</div>

<script>
const currentDirectory = '{{ $currentDirectory }}';
const serverIdentifier = '{{ $serverIdentifier }}';
const panelUrl = '{{ $panelUrl }}';

function handleDoubleClick(row) {
    const name = row.dataset.name;
    const type = row.dataset.type;
    
    if (type === 'inode/directory') {
        const newDir = currentDirectory === '/' ? '/' + name : currentDirectory + '/' + name;
        window.location.href = '?tab=file_browser&directory=' + encodeURIComponent(newDir);
    } else {
        // Open file in new tab or download
        downloadFile(name);
    }
}

function downloadFile(name) {
    const url = `${panelUrl}/api/client/servers/${serverIdentifier}/files/download?file=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
}

function deleteFile(name) {
    if (!confirm('Are you sure you want to delete "' + name + '"?')) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=file_browser';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="files[]" value="${name}">
        <input type="hidden" name="directory" value="${currentDirectory}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function showCreateFolder() {
    const name = prompt('Enter folder name:');
    if (!name) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=file_browser';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="create_folder">
        <input type="hidden" name="name" value="${name}">
        <input type="hidden" name="root" value="${currentDirectory}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function refreshFiles() {
    window.location.reload();
}

function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    
    // Upload files via API
    Array.from(files).forEach(file => {
        uploadFile(file);
    });
}

function uploadFile(file) {
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('root', currentDirectory);
    
    // Upload via fetch
    fetch(`{{ $panelUrl }}/api/client/servers/${serverIdentifier}/files/upload`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer {{ $clientApiKey ?? "" }}'
        },
        body: formData
    }).then(() => {
        refreshFiles();
    }).catch(err => {
        alert('Upload failed: ' + err.message);
    });
}

// Drag and drop handlers
const dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-primary', 'bg-primary/10');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-primary', 'bg-primary/10');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-primary', 'bg-primary/10');
    
    const files = e.dataTransfer.files;
    Array.from(files).forEach(file => {
        uploadFile(file);
    });
});
</script>
