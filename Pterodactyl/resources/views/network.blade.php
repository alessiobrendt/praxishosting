{!! $iconAssets !!}
<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 class="text-xl font-semibold text-text-primary">
            <i class="ri-router-line mr-2"></i>Network Management
        </h3>
        <p class="text-text-secondary text-sm mt-1">View ports and allocations, assign IPs and more</p>
    </div>

    <div class="border border-neutral rounded-lg overflow-hidden">
        <table class="w-full">
            <thead class="bg-background-primary border-b border-neutral">
                <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">IP Address</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Port</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Alias</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Primary</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Actions</th>
                </tr>
            </thead>
            <tbody>
                @if(!empty($allocations) && count($allocations) > 0)
                    @foreach($allocations as $allocation)
                        @php
                            $attrs = $allocation['attributes'] ?? [];
                            $ip = $attrs['ip'] ?? 'Unknown';
                            $port = $attrs['port'] ?? 'Unknown';
                            $alias = $attrs['alias'] ?? null;
                            $isPrimary = ($attrs['id'] ?? '') == ($server['allocation'] ?? '');
                            $allocationId = $attrs['id'] ?? '';
                        @endphp
                        <tr class="border-b border-neutral hover:bg-background-primary transition-colors">
                            <td class="px-4 py-3 text-text-primary font-mono">{{ $ip }}</td>
                            <td class="px-4 py-3 text-text-primary font-mono">{{ $port }}</td>
                            <td class="px-4 py-3 text-text-secondary text-sm">{{ $alias ?? '-' }}</td>
                            <td class="px-4 py-3">
                                @if($isPrimary)
                                    <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">Primary</span>
                                @else
                                    <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs">Secondary</span>
                                @endif
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    @if(!$isPrimary)
                                        <button onclick="setPrimary('{{ $allocationId }}')" 
                                            class="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:opacity-90">
                                            <i class="ri-star-line mr-1"></i>Set Primary
                                        </button>
                                    @endif
                                    <button onclick="setNote('{{ $allocationId }}', '{{ $alias ?? '' }}')" 
                                        class="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:opacity-90">
                                        <i class="ri-edit-line mr-1"></i>Set Note
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="5" class="px-4 py-8 text-center text-text-secondary">No allocations found</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>
</div>

<script>
function setPrimary(allocationId) {
    if (!confirm('Set this allocation as primary?')) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=network';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="set_primary">
        <input type="hidden" name="allocation_id" value="${allocationId}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function setNote(allocationId, currentNote) {
    const note = prompt('Enter note/alias (optional):', currentNote || '');
    if (note === null) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=network';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="set_note">
        <input type="hidden" name="allocation_id" value="${allocationId}">
        <input type="hidden" name="notes" value="${note}">
    `;
    document.body.appendChild(form);
    form.submit();
}
</script>
