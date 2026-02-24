{!! $iconAssets !!}
<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4 flex justify-between items-center">
        <div>
            <h3 class="text-xl font-semibold text-text-primary">
                <i class="ri-time-line mr-2"></i>Schedules
            </h3>
            <p class="text-text-secondary text-sm mt-1">Automate tasks like restarts, backups, or script runs</p>
        </div>
        <button onclick="showCreateSchedule()" class="px-4 py-2 bg-green-600 text-white rounded-md hover:opacity-90 transition-opacity">
            <i class="ri-add-line mr-2"></i>Create Schedule
        </button>
    </div>

    <div class="border border-neutral rounded-lg overflow-hidden">
        <table class="w-full">
            <thead class="bg-background-primary border-b border-neutral">
                <tr>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Name</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Cron Expression</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Last Run</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Next Run</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Status</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-text-primary">Actions</th>
                </tr>
            </thead>
            <tbody>
                @if(!empty($schedules) && count($schedules) > 0)
                    @foreach($schedules as $schedule)
                        @php
                            $attrs = $schedule['attributes'] ?? [];
                            $name = $attrs['name'] ?? 'Untitled Schedule';
                            $cron = $attrs['cron']['day_of_week'] ?? 'N/A';
                            $cronFull = isset($attrs['cron']) ? 
                                ($attrs['cron']['minute'] ?? '*') . ' ' .
                                ($attrs['cron']['hour'] ?? '*') . ' ' .
                                ($attrs['cron']['day_of_month'] ?? '*') . ' ' .
                                ($attrs['cron']['month'] ?? '*') . ' ' .
                                ($attrs['cron']['day_of_week'] ?? '*') : 'N/A';
                            $lastRun = isset($attrs['last_run_at']) ? date('Y-m-d H:i:s', strtotime($attrs['last_run_at'])) : 'Never';
                            $nextRun = isset($attrs['next_run_at']) ? date('Y-m-d H:i:s', strtotime($attrs['next_run_at'])) : 'N/A';
                            $isActive = $attrs['is_active'] ?? false;
                            $scheduleId = $attrs['id'] ?? '';
                        @endphp
                        <tr class="border-b border-neutral hover:bg-background-primary transition-colors">
                            <td class="px-4 py-3 text-text-primary">{{ $name }}</td>
                            <td class="px-4 py-3 text-text-secondary text-sm font-mono">{{ $cronFull }}</td>
                            <td class="px-4 py-3 text-text-secondary text-sm">{{ $lastRun }}</td>
                            <td class="px-4 py-3 text-text-secondary text-sm">{{ $nextRun }}</td>
                            <td class="px-4 py-3">
                                @if($isActive)
                                    <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">Active</span>
                                @else
                                    <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs">Inactive</span>
                                @endif
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <button onclick="executeSchedule('{{ $scheduleId }}')" 
                                        class="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:opacity-90">
                                        <i class="ri-play-line mr-1"></i>Run Now
                                    </button>
                                    <button onclick="editSchedule('{{ $scheduleId }}', '{{ $name }}', '{{ $cronFull }}', {{ $isActive ? 'true' : 'false' }})" 
                                        class="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:opacity-90">
                                        <i class="ri-edit-line mr-1"></i>Edit
                                    </button>
                                    <button onclick="deleteSchedule('{{ $scheduleId }}')" 
                                        class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:opacity-90">
                                        <i class="ri-delete-bin-line mr-1"></i>Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="6" class="px-4 py-8 text-center text-text-secondary">No schedules found. Create your first schedule to get started.</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>
</div>

<script>
function showCreateSchedule() {
    const name = prompt('Enter schedule name:');
    if (!name) return;
    
    const cron = prompt('Enter cron expression (e.g., "0 0 * * *" for daily at midnight):');
    if (!cron) return;
    
    const isActive = confirm('Enable schedule immediately?');
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=schedules';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="create">
        <input type="hidden" name="name" value="${name}">
        <input type="hidden" name="cron" value="${cron}">
        <input type="hidden" name="is_active" value="${isActive ? '1' : '0'}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function executeSchedule(scheduleId) {
    if (!confirm('Execute this schedule now?')) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=schedules';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="execute">
        <input type="hidden" name="schedule_id" value="${scheduleId}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function editSchedule(scheduleId, name, cron, isActive) {
    const newName = prompt('Enter schedule name:', name);
    if (!newName) return;
    
    const newCron = prompt('Enter cron expression:', cron);
    if (!newCron) return;
    
    const newIsActive = confirm('Enable schedule?');
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=schedules';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="update">
        <input type="hidden" name="schedule_id" value="${scheduleId}">
        <input type="hidden" name="name" value="${newName}">
        <input type="hidden" name="cron" value="${newCron}">
        <input type="hidden" name="is_active" value="${newIsActive ? '1' : '0'}">
    `;
    document.body.appendChild(form);
    form.submit();
}

function deleteSchedule(scheduleId) {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '?tab=schedules';
    form.innerHTML = `
        @csrf
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="schedule_id" value="${scheduleId}">
    `;
    document.body.appendChild(form);
    form.submit();
}
</script>
