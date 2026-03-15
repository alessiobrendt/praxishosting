<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Calendar, Plus, Trash2, Play, Loader2, HelpCircle, ChevronDown, ChevronUp, ListTodo } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { notify } from '@/composables/useNotify';
import gamingAccounts from '@/routes/gaming-accounts';

const props = defineProps<{
    gameServerAccountId: string;
}>();

type Schedule = {
    id: number;
    name?: string;
    cron?: { minute?: string; hour?: string; day_of_month?: string; month?: string; day_of_week?: string };
    is_active?: boolean;
    next_run_at?: string;
};

type ScheduleTask = {
    id: number;
    sequence_id?: number;
    action: string;
    payload: string;
    time_offset: number;
    continue_on_failure?: boolean;
};

const schedules = ref<Schedule[]>([]);
const scheduleTasksMap = ref<Record<number, ScheduleTask[]>>({});
const loading = ref(false);
const creating = ref(false);
const creatingTask = ref(false);
const loadingTasksFor = ref<number | null>(null);
const error = ref<string | null>(null);
const createModalOpen = ref(false);
const createTaskModalOpen = ref(false);
const createTaskScheduleId = ref<number | null>(null);
const showCheatsheet = ref(false);

const form = ref({
    name: '',
    minute: '*/5',
    hour: '*',
    day_of_month: '*',
    month: '*',
    day_of_week: '*',
    only_when_online: false,
    is_active: true,
});

const taskForm = ref({
    action: 'command' as 'command' | 'power' | 'backup',
    payload: '',
    time_offset: 0,
    continue_on_failure: false,
    ignored_files: '',
});

const api = computed(() => gamingAccounts.api.schedules);
const tasksApi = computed(() => gamingAccounts.api.schedules.tasks);

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
    const meta = document.querySelector('meta[name="csrf-token"]');
    return (meta && (meta as HTMLMetaElement).content) || '';
}

function fetchSchedules() {
    loading.value = true;
    error.value = null;
    fetch(api.value.list.url(props.gameServerAccountId), { credentials: 'same-origin' })
        .then((r) => r.json())
        .then((data) => {
            if (data.success && Array.isArray(data.schedules)) {
                schedules.value = data.schedules;
            } else {
                error.value = data.message ?? 'Fehler beim Laden';
            }
        })
        .catch((e) => {
            error.value = e.message ?? 'Verbindungsfehler';
        })
        .finally(() => {
            loading.value = false;
        });
}

watch(() => props.gameServerAccountId, fetchSchedules, { immediate: true });

function cronString(s: Schedule) {
    const c = s.cron ?? {};
    const parts = [
        c.minute ?? '*',
        c.hour ?? '*',
        c.day_of_month ?? '*',
        c.month ?? '*',
        c.day_of_week ?? '*',
    ];
    return parts.join(' ');
}

function openCreateModal() {
    form.value = {
        name: '',
        minute: '*/5',
        hour: '*',
        day_of_month: '*',
        month: '*',
        day_of_week: '*',
        only_when_online: false,
        is_active: true,
    };
    showCheatsheet.value = false;
    createModalOpen.value = true;
}

function submitCreateSchedule() {
    if (creating.value) return;
    const name = form.value.name.trim() || 'Schedule';
    creating.value = true;
    const payload = {
        name,
        minute: form.value.minute || '*',
        hour: form.value.hour || '*',
        day_of_month: form.value.day_of_month || '*',
        month: form.value.month || '*',
        day_of_week: form.value.day_of_week || '*',
        is_active: form.value.is_active,
        only_when_online: form.value.only_when_online,
    };
    fetch(api.value.create.url(props.gameServerAccountId), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
    })
        .then((r) => r.json())
        .then((data) => {
            if (data.success) {
                notify.success('Schedule erstellt.');
                createModalOpen.value = false;
                fetchSchedules();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .catch(() => notify.error('Verbindungsfehler'))
        .finally(() => {
            creating.value = false;
        });
}

function deleteSchedule(scheduleId: number) {
    if (!confirm('Schedule wirklich löschen?')) return;
    fetch(api.value.delete.url({ game_server_account: props.gameServerAccountId, schedule: scheduleId }), {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    })
        .then((r) => {
            if (r.status === 204) return { success: true };
            return r.json().catch(() => ({}));
        })
        .then((data) => {
            if (data?.success !== false) {
                notify.success('Schedule gelöscht.');
                fetchSchedules();
            } else {
                notify.error(data?.message ?? 'Fehler');
            }
        })
        .catch(() => notify.error('Verbindungsfehler'));
}

function executeSchedule(scheduleId: number) {
    fetch(api.value.execute.url({ game_server_account: props.gameServerAccountId, schedule: scheduleId }), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify({}),
    })
        .then((r) => r.json().catch(() => ({})))
        .then((data) => {
            if (data?.success !== false) {
                notify.success('Schedule ausgeführt.');
            } else {
                notify.error(data?.message ?? 'Fehler');
            }
        })
        .catch(() => notify.error('Verbindungsfehler'));
}

function formatDate(val: string | undefined) {
    if (!val) return '—';
    try {
        return new Date(val).toLocaleString('de-DE');
    } catch {
        return '—';
    }
}

function extractTasksFromSchedule(scheduleData: Record<string, unknown>): ScheduleTask[] {
    const rel = scheduleData?.relationships as Record<string, unknown> | undefined;
    const tasksData = rel?.tasks as { data?: Array<{ attributes?: ScheduleTask; id?: number }> } | undefined;
    const list = tasksData?.data ?? [];
    return list.map((t) => {
        const attrs = t.attributes ?? t;
        const id = (attrs as ScheduleTask).id ?? (t as { id?: number }).id ?? 0;
        return {
            id,
            sequence_id: (attrs as ScheduleTask).sequence_id,
            action: (attrs as ScheduleTask).action ?? 'command',
            payload: (attrs as ScheduleTask).payload ?? '',
            time_offset: (attrs as ScheduleTask).time_offset ?? 0,
            continue_on_failure: (attrs as ScheduleTask).continue_on_failure,
        };
    });
}

function fetchScheduleTasks(scheduleId: number) {
    if (loadingTasksFor.value === scheduleId) return;
    loadingTasksFor.value = scheduleId;
    fetch(api.value.show.url({ game_server_account: props.gameServerAccountId, schedule: scheduleId }), {
        credentials: 'same-origin',
    })
        .then((r) => r.json())
        .then((data) => {
            if (data.success && data.schedule) {
                const tasksList = extractTasksFromSchedule(data.schedule);
                scheduleTasksMap.value = { ...scheduleTasksMap.value, [scheduleId]: tasksList };
            }
        })
        .catch(() => {})
        .finally(() => {
            loadingTasksFor.value = null;
        });
}

function openCreateTaskModal(scheduleId: number) {
    createTaskScheduleId.value = scheduleId;
    taskForm.value = {
        action: 'command',
        payload: '',
        time_offset: 0,
        continue_on_failure: false,
        ignored_files: '',
    };
    if (!scheduleTasksMap.value[scheduleId]) {
        fetchScheduleTasks(scheduleId);
    }
    createTaskModalOpen.value = true;
}

function submitCreateTask() {
    const sid = createTaskScheduleId.value;
    if (creatingTask.value || sid === null) return;
    const payload =
        taskForm.value.action === 'power' ? taskForm.value.payload || 'start' : taskForm.value.payload;
    creatingTask.value = true;
    fetch(tasksApi.value.create.url({ game_server_account: props.gameServerAccountId, schedule: sid }), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            action: taskForm.value.action,
            payload,
            time_offset: Math.max(0, Math.min(900, taskForm.value.time_offset)),
            continue_on_failure: taskForm.value.continue_on_failure,
        }),
    })
        .then((r) => r.json())
        .then((data) => {
            if (data.success) {
                notify.success('Task erstellt.');
                createTaskModalOpen.value = false;
                fetchScheduleTasks(sid);
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .catch(() => notify.error('Verbindungsfehler'))
        .finally(() => {
            creatingTask.value = false;
        });
}

function deleteTask(scheduleId: number, taskId: number) {
    if (!confirm('Task wirklich löschen?')) return;
    fetch(
        tasksApi.value.delete.url({
            game_server_account: props.gameServerAccountId,
            schedule: scheduleId,
            task: taskId,
        }),
        {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        },
    )
        .then((r) => (r.status === 204 ? { success: true } : r.json().catch(() => ({}))))
        .then((data) => {
            if (data?.success !== false) {
                notify.success('Task gelöscht.');
                fetchScheduleTasks(scheduleId);
            } else {
                notify.error(data?.message ?? 'Fehler');
            }
        })
        .catch(() => notify.error('Verbindungsfehler'));
}

function taskActionLabel(action: string): string {
    switch (action) {
        case 'command':
            return 'Befehl senden';
        case 'power':
            return 'Power-Aktion';
        case 'backup':
            return 'Backup erstellen';
        default:
            return action;
    }
}

function powerPayloadLabel(payload: string): string {
    const labels: Record<string, string> = {
        start: 'Server starten',
        stop: 'Server stoppen',
        restart: 'Server neustarten',
        kill: 'Server beenden (Kill)',
    };
    return labels[payload] ?? payload;
}
</script>

<template>
    <Card>
        <CardContent class="pt-6">
            <div class="mb-4 flex items-center justify-between">
                <h3 class="text-lg font-medium">Schedules</h3>
                <Button @click="openCreateModal">
                    <Plus class="mr-2 h-4 w-4" />
                    Neu
                </Button>
            </div>

            <Dialog v-model:open="createModalOpen">
                <DialogContent class="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Neuen Schedule erstellen</DialogTitle>
                        <DialogDescription>
                            Legen Sie Name und Cron-Ausdruck für den Schedule fest.
                        </DialogDescription>
                    </DialogHeader>
                    <form class="space-y-5" @submit.prevent="submitCreateSchedule">
                        <div class="space-y-1.5">
                            <Label for="schedule-name">Schedule-Name</Label>
                            <Input
                                id="schedule-name"
                                v-model="form.name"
                                type="text"
                                placeholder="z. B. Täglicher Neustart"
                                class="w-full"
                            />
                            <p class="text-muted-foreground text-xs">
                                Ein lesbarer Name für diesen Schedule.
                            </p>
                        </div>

                        <div class="space-y-1.5">
                            <Label class="text-xs">Cron-Zeitplan</Label>
                            <div class="grid grid-cols-3 gap-2 sm:grid-cols-5">
                                <div class="space-y-1">
                                    <label for="cron-minute" class="text-muted-foreground text-xs">Min.</label>
                                    <Input id="cron-minute" v-model="form.minute" class="font-mono text-center text-sm" />
                                </div>
                                <div class="space-y-1">
                                    <label for="cron-hour" class="text-muted-foreground text-xs">Std.</label>
                                    <Input id="cron-hour" v-model="form.hour" class="font-mono text-center text-sm" />
                                </div>
                                <div class="space-y-1">
                                    <label for="cron-dom" class="text-muted-foreground text-xs">Tag</label>
                                    <Input id="cron-dom" v-model="form.day_of_month" class="font-mono text-center text-sm" />
                                </div>
                                <div class="space-y-1">
                                    <label for="cron-month" class="text-muted-foreground text-xs">Monat</label>
                                    <Input id="cron-month" v-model="form.month" class="font-mono text-center text-sm" />
                                </div>
                                <div class="space-y-1">
                                    <label for="cron-dow" class="text-muted-foreground text-xs">Woche</label>
                                    <Input id="cron-dow" v-model="form.day_of_week" class="font-mono text-center text-sm" />
                                </div>
                            </div>
                            <p class="text-muted-foreground text-xs">
                                Cron-Syntax (z. B. <code>*/5</code> = alle 5, <code>*</code> = beliebig).
                            </p>
                        </div>

                        <div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                class="text-muted-foreground -ml-2"
                                @click="showCheatsheet = !showCheatsheet"
                            >
                                <HelpCircle class="mr-1 h-4 w-4" />
                                {{ showCheatsheet ? 'Cheatsheet ausblenden' : 'Cheatsheet anzeigen' }}
                                <ChevronDown v-if="!showCheatsheet" class="ml-1 h-4 w-4" />
                                <ChevronUp v-else class="ml-1 h-4 w-4" />
                            </Button>
                            <div
                                v-show="showCheatsheet"
                                class="mt-2 rounded-md border bg-muted/50 p-3 text-xs"
                            >
                                <p class="mb-2 font-medium">Cron-Beispiele</p>
                                <ul class="space-y-1 text-muted-foreground">
                                    <li><code>*/5 * * * *</code> — alle 5 Minuten</li>
                                    <li><code>0 * * * *</code> — jede Stunde</li>
                                    <li><code>0 4 * * *</code> — täglich um 4:00 Uhr</li>
                                    <li><code>0 0 * * 0</code> — wöchentlich (Sonntag 0:00)</li>
                                    <li><code>*</code> — beliebig (Minute/Stunde/Tag etc.)</li>
                                </ul>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-x-6 gap-y-3">
                            <div class="flex items-start gap-2">
                                <Checkbox id="only_when_online" v-model="form.only_when_online" class="mt-0.5" />
                                <div>
                                    <label for="only_when_online" class="cursor-pointer text-sm font-medium">Nur wenn Server online</label>
                                    <p class="text-muted-foreground text-xs">Nur ausführen, wenn der Server läuft.</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-2">
                                <Checkbox id="schedule_active" v-model="form.is_active" class="mt-0.5" />
                                <div>
                                    <label for="schedule_active" class="cursor-pointer text-sm font-medium">Schedule aktiv</label>
                                    <p class="text-muted-foreground text-xs">Automatisch ausführen, wenn aktiviert.</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" @click="createModalOpen = false">
                                Abbrechen
                            </Button>
                            <Button type="submit" :disabled="creating">
                                <Loader2 v-if="creating" class="mr-2 h-4 w-4 animate-spin" />
                                Schedule erstellen
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div v-if="loading" class="flex justify-center py-12">
                <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
            <div v-else-if="error" class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {{ error }}
            </div>
            <div v-else-if="schedules.length === 0" class="py-12 text-center text-muted-foreground">
                <Calendar class="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>Keine geplanten Tasks</p>
            </div>
            <div v-else class="space-y-2">
                <div
                    v-for="s in schedules"
                    :key="s.id"
                    class="rounded-lg border p-3"
                >
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <p class="font-medium">{{ s.name ?? `Schedule #${s.id}` }}</p>
                            <p class="font-mono text-xs text-muted-foreground">
                                {{ cronString(s) }}
                            </p>
                            <p v-if="s.next_run_at" class="text-xs text-muted-foreground">
                                Nächster Lauf: {{ formatDate(s.next_run_at) }}
                            </p>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <Badge v-if="s.is_active !== false" variant="default">Aktiv</Badge>
                            <Badge v-else variant="secondary">Inaktiv</Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                @click="executeSchedule(s.id)"
                            >
                                <Play class="mr-1 h-4 w-4" />
                                Jetzt ausführen
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                @click="openCreateTaskModal(s.id)"
                            >
                                <Plus class="mr-1 h-4 w-4" />
                                Task erstellen
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                class="text-destructive hover:text-destructive"
                                @click="deleteSchedule(s.id)"
                            >
                                <Trash2 class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div class="mt-3 border-t pt-3">
                        <div class="mb-2 flex items-center justify-between">
                            <span class="text-muted-foreground text-sm font-medium">
                                <ListTodo class="mr-1 inline h-4 w-4" />
                                Tasks
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                :disabled="loadingTasksFor === s.id"
                                @click="fetchScheduleTasks(s.id)"
                            >
                                <Loader2 v-if="loadingTasksFor === s.id" class="mr-1 h-4 w-4 animate-spin" />
                                {{ scheduleTasksMap[s.id] ? 'Aktualisieren' : 'Tasks laden' }}
                            </Button>
                        </div>
                        <div v-if="loadingTasksFor === s.id" class="py-2 text-muted-foreground text-sm">
                            Wird geladen…
                        </div>
                        <div v-else-if="scheduleTasksMap[s.id]?.length" class="space-y-1.5">
                            <div
                                v-for="t in scheduleTasksMap[s.id]"
                                :key="t.id"
                                class="flex flex-wrap items-center justify-between gap-2 rounded border bg-muted/30 px-2 py-1.5 text-sm"
                            >
                                <span>
                                    <span class="font-medium">{{ taskActionLabel(t.action) }}</span>
                                    <span v-if="t.payload" class="text-muted-foreground">
                                        — {{ t.action === 'power' ? powerPayloadLabel(t.payload) : t.payload }}
                                    </span>
                                    <span class="text-muted-foreground text-xs">
                                        (Offset: {{ t.time_offset }}s{{ t.continue_on_failure ? ', bei Fehler fortfahren' : '' }})
                                    </span>
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    class="h-7 text-destructive hover:text-destructive"
                                    @click="deleteTask(s.id, t.id)"
                                >
                                    <Trash2 class="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                        <p v-else-if="scheduleTasksMap[s.id] && scheduleTasksMap[s.id].length === 0" class="text-muted-foreground text-sm">
                            Keine Tasks. Klicken Sie auf „Task erstellen“, um einen hinzuzufügen.
                        </p>
                    </div>
                </div>
            </div>

            <Dialog v-model:open="createTaskModalOpen">
                <DialogContent class="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Task erstellen</DialogTitle>
                        <DialogDescription>
                            Aktion und Optionen für diesen Schedule-Task festlegen.
                        </DialogDescription>
                    </DialogHeader>
                    <form class="space-y-4" @submit.prevent="submitCreateTask">
                        <div class="space-y-2">
                            <Label for="task-action">Aktion</Label>
                            <select
                                id="task-action"
                                v-model="taskForm.action"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="command">Befehl senden</option>
                                <option value="power">Power-Aktion</option>
                                <option value="backup">Backup erstellen</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <Label for="task-time-offset">Zeitversatz (Sekunden)</Label>
                            <Input
                                id="task-time-offset"
                                v-model.number="taskForm.time_offset"
                                type="number"
                                min="0"
                                max="900"
                                class="w-full"
                            />
                            <p class="text-muted-foreground text-xs">
                                Wartezeit nach dem vorherigen Task. Beim ersten Task wird dies nicht angewendet.
                            </p>
                        </div>
                        <div v-if="taskForm.action === 'command'" class="space-y-2">
                            <Label for="task-payload-cmd">Befehl</Label>
                            <Input
                                id="task-payload-cmd"
                                v-model="taskForm.payload"
                                type="text"
                                placeholder="z. B. say Neustart in 30 Sekunden"
                                class="w-full font-mono text-sm"
                            />
                        </div>
                        <div v-else-if="taskForm.action === 'power'" class="space-y-2">
                            <Label for="task-payload-power">Power-Aktion</Label>
                            <select
                                id="task-payload-power"
                                v-model="taskForm.payload"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="start">Server starten</option>
                                <option value="stop">Server stoppen</option>
                                <option value="restart">Server neustarten</option>
                                <option value="kill">Server beenden (Kill)</option>
                            </select>
                        </div>
                        <div v-else-if="taskForm.action === 'backup'" class="space-y-2">
                            <Label for="task-payload-backup">Backup-Name (optional)</Label>
                            <Input
                                id="task-payload-backup"
                                v-model="taskForm.payload"
                                type="text"
                                placeholder="z. B. Tägliches Backup"
                                class="w-full"
                            />
                            <Label for="task-ignored-files" class="mt-2 block">Ignorierte Dateien (optional)</Label>
                            <textarea
                                id="task-ignored-files"
                                v-model="taskForm.ignored_files"
                                rows="2"
                                class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Dateien/Ordner ausschließen (eine pro Zeile oder .pteroignore nutzen)"
                            />
                            <p class="text-muted-foreground text-xs">
                                Standardmäßig wird der Inhalt von .pteroignore verwendet.
                            </p>
                        </div>
                        <div class="flex items-start gap-2">
                            <Checkbox id="task-continue" v-model="taskForm.continue_on_failure" class="mt-0.5" />
                            <div>
                                <label for="task-continue" class="cursor-pointer text-sm font-medium">Bei Fehler fortfahren</label>
                                <p class="text-muted-foreground text-xs">
                                    Weitere Tasks werden ausgeführt, wenn dieser Task fehlschlägt.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" @click="createTaskModalOpen = false">
                                Abbrechen
                            </Button>
                            <Button type="submit" :disabled="creatingTask">
                                <Loader2 v-if="creatingTask" class="mr-2 h-4 w-4 animate-spin" />
                                Task erstellen
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </CardContent>
    </Card>
</template>
