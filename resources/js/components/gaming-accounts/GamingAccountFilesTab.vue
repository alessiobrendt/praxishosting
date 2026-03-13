<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    FolderOpen,
    FileText,
    Loader2,
    Download,
    ChevronRight,
    Home,
    List,
    LayoutGrid,
    FolderPlus,
    Upload,
    FilePlus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Search,
    Archive,
    FileArchive,
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '@/components/ui/modal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import { useAppearance } from '@/composables/useAppearance';
import { notify } from '@/composables/useNotify';
import { formatBytes } from '@/composables/useGamingAccountFormatters';
import gamingAccounts from '@/routes/gaming-accounts';

const { resolvedAppearance } = useAppearance();
const monacoTheme = computed(() => (resolvedAppearance.value === 'dark' ? 'vs-dark' : 'vs'));

const MONACO_OPTIONS = {
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
};

const props = defineProps<{
    gameServerAccountId: string;
}>();

type FileItem = {
    name: string;
    size?: number;
    is_file?: boolean;
    modified_at?: string;
    mimetype?: string;
    mime?: string;
};

const currentDir = ref('/');
const files = ref<FileItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const viewMode = ref<'list' | 'grid'>('list');
const searchQuery = ref('');

const api = computed(() => gamingAccounts.api.files);
const csrfToken = computed(() => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? (meta as HTMLMetaElement).content : '';
});

const breadcrumbs = computed(() => {
    if (currentDir.value === '/') return [];
    return currentDir.value.split('/').filter(Boolean);
});

const filteredFiles = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return files.value;
    return files.value.filter((f) => f.name.toLowerCase().includes(q));
});

const createFolderOpen = ref(false);
const createFolderName = ref('');
const newFileOpen = ref(false);
const newFileName = ref('');
const renameOpen = ref(false);
const renameFrom = ref('');
const renameTo = ref('');
const deleteOpen = ref(false);
const deleteTarget = ref<FileItem | null>(null);
const editOpen = ref(false);
const editPath = ref('');
const editContent = ref('');
const editSaving = ref(false);
const uploadInput = ref<HTMLInputElement | null>(null);
const actionLoading = ref(false);
const compressOpen = ref(false);
const selectedFilesForZip = ref<string[]>([]);

function getLanguageFromPath(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase() ?? '';
    const map: Record<string, string> = {
        js: 'javascript',
        ts: 'typescript',
        vue: 'html',
        yml: 'yaml',
        yaml: 'yaml',
        json: 'json',
        md: 'markdown',
        html: 'html',
        css: 'css',
        scss: 'scss',
        php: 'php',
        py: 'python',
        sh: 'shell',
        bash: 'shell',
        xml: 'xml',
        sql: 'sql',
        env: 'plaintext',
        txt: 'plaintext',
        log: 'plaintext',
        properties: 'plaintext',
        cfg: 'plaintext',
        conf: 'plaintext',
    };
    return map[ext] ?? 'plaintext';
}

function fetchFiles() {
    loading.value = true;
    error.value = null;
    const url = api.value.list.url(props.gameServerAccountId, {
        query: { directory: currentDir.value },
    });
    fetch(url, { credentials: 'same-origin' })
        .then((r) => r.json())
        .then((data) => {
            if (data.success && Array.isArray(data.files)) {
                files.value = data.files;
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

watch(
    () => [props.gameServerAccountId, currentDir.value],
    () => fetchFiles(),
    { immediate: true },
);

function getRoot() {
    return currentDir.value || '/';
}

function getFilePath(name: string) {
    const root = getRoot();
    return root === '/' ? `/${name}` : `${root}/${name}`;
}

function navigateTo(path: string) {
    currentDir.value = path || '/';
}

function openItem(item: FileItem) {
    if (isFile(item)) {
        openEdit(item);
    } else {
        const path = getFilePath(item.name);
        currentDir.value = path;
    }
}

function isFile(item: FileItem) {
    return item.is_file === true || item.mimetype !== 'inode/directory';
}

function downloadFile(name: string) {
    const path = getFilePath(name);
    const url = api.value.download.url(props.gameServerAccountId, { query: { path } });
    window.open(url, '_blank');
}

function formatDate(val: string | undefined) {
    if (!val) return '—';
    try {
        return new Date(val).toLocaleString('de-DE');
    } catch {
        return '—';
    }
}

function apiFetch(
    url: string,
    options: RequestInit & { body?: Record<string, unknown> } = {},
): Promise<{ success: boolean; message?: string }> {
    const { body, ...rest } = options;
    const init: RequestInit = {
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrfToken.value,
            ...options.headers,
        },
        ...rest,
    };
    if (body && init.method !== 'GET') {
        init.body = JSON.stringify(body);
    }
    return fetch(url, init).then((r) => r.json());
}

function submitCreateFolder() {
    const name = createFolderName.value.trim();
    if (!name) return;
    actionLoading.value = true;
    const url = api.value.createFolder.url(props.gameServerAccountId);
    apiFetch(url, { method: 'POST', body: { root: getRoot(), name } })
        .then((data) => {
            if (data.success) {
                notify.success('Ordner erstellt');
                createFolderOpen.value = false;
                createFolderName.value = '';
                fetchFiles();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .finally(() => (actionLoading.value = false));
}

function submitNewFile() {
    const name = newFileName.value.trim();
    if (!name) return;
    actionLoading.value = true;
    const path = getFilePath(name);
    const writeUrl = api.value.write.url(props.gameServerAccountId);
    apiFetch(writeUrl, { method: 'POST', body: { path, content: '' } })
        .then((data) => {
            if (data.success) {
                notify.success('Datei erstellt');
                newFileOpen.value = false;
                newFileName.value = '';
                fetchFiles();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .finally(() => (actionLoading.value = false));
}

function openRename(item: FileItem) {
    renameFrom.value = item.name;
    renameTo.value = item.name;
    renameOpen.value = true;
}

function submitRename() {
    const to = renameTo.value.trim();
    if (!to || to === renameFrom.value) {
        renameOpen.value = false;
        return;
    }
    actionLoading.value = true;
    const url = api.value.rename.url(props.gameServerAccountId);
    apiFetch(url, {
        method: 'PUT',
        body: { root: getRoot(), files: [{ from: renameFrom.value, to }] },
    })
        .then((data) => {
            if (data.success) {
                notify.success('Umbenannt');
                renameOpen.value = false;
                fetchFiles();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .finally(() => (actionLoading.value = false));
}

function openDelete(item: FileItem) {
    deleteTarget.value = item;
    deleteOpen.value = true;
}

function submitDelete() {
    if (!deleteTarget.value) return;
    actionLoading.value = true;
    const url = api.value.delete.url(props.gameServerAccountId);
    apiFetch(url, {
        method: 'POST',
        body: { root: getRoot(), files: [deleteTarget.value.name] },
    })
        .then((data) => {
            if (data.success) {
                notify.success('Gelöscht');
                deleteOpen.value = false;
                deleteTarget.value = null;
                fetchFiles();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .finally(() => (actionLoading.value = false));
}

function openEdit(item: FileItem) {
    if (!isFile(item)) return;
    const path = getFilePath(item.name);
    editPath.value = path;
    editContent.value = '';
    editOpen.value = true;
    const contentsUrl = api.value.contents.url(props.gameServerAccountId, {
        query: { path },
    });
    fetch(contentsUrl, { credentials: 'same-origin' })
        .then((r) => r.json())
        .then((data) => {
            editContent.value = data.success ? (data.content ?? '') : '';
        })
        .catch(() => {
            editContent.value = '';
        });
}

function submitEdit() {
    actionLoading.value = true;
    editSaving.value = true;
    const writeUrl = api.value.write.url(props.gameServerAccountId);
    apiFetch(writeUrl, {
        method: 'POST',
        body: { path: editPath.value, content: editContent.value },
    })
        .then((data) => {
            if (data.success) {
                notify.success('Gespeichert');
                editOpen.value = false;
                fetchFiles();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .finally(() => {
            actionLoading.value = false;
            editSaving.value = false;
        });
}

function triggerUpload() {
    uploadInput.value?.click();
}

function onUploadChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    actionLoading.value = true;
    const form = new FormData();
    form.append('directory', currentDir.value || '/');
    form.append('file', file);
    const url = api.value.upload.url(props.gameServerAccountId);
    fetch(url, {
        method: 'POST',
        body: form,
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrfToken.value,
        },
    })
        .then((r) => r.json())
        .then((data) => {
            if (data.success) {
                notify.success('Hochgeladen');
                fetchFiles();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .finally(() => {
            actionLoading.value = false;
            input.value = '';
        });
}

const compressUrl = () =>
    api.value.list.url(props.gameServerAccountId).replace('/list', '/compress');
const decompressUrl = () =>
    api.value.list.url(props.gameServerAccountId).replace('/list', '/decompress');

function openCompressModal() {
    selectedFilesForZip.value = [];
    compressOpen.value = true;
}

function toggleFileForZip(name: string) {
    const idx = selectedFilesForZip.value.indexOf(name);
    if (idx === -1) {
        selectedFilesForZip.value = [...selectedFilesForZip.value, name];
    } else {
        selectedFilesForZip.value = selectedFilesForZip.value.filter((n) => n !== name);
    }
}

function submitCompress() {
    if (selectedFilesForZip.value.length === 0) {
        notify.error('Mindestens eine Datei oder einen Ordner auswählen.');
        return;
    }
    actionLoading.value = true;
    const url = compressUrl();
    apiFetch(url, {
        method: 'POST',
        body: { root: getRoot(), files: selectedFilesForZip.value },
    })
        .then((data) => {
            if (data.success) {
                notify.success('ZIP-Archiv wird erstellt.');
                compressOpen.value = false;
                fetchFiles();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .finally(() => (actionLoading.value = false));
}

function isArchiveFile(item: FileItem): boolean {
    const n = item.name.toLowerCase();
    return (
        (item.is_file === true || item.mimetype !== 'inode/directory') &&
        (n.endsWith('.zip') || n.endsWith('.tar.gz') || n.endsWith('.tar'))
    );
}

function submitDecompress(item: FileItem) {
    if (!isArchiveFile(item)) return;
    actionLoading.value = true;
    const url = decompressUrl();
    apiFetch(url, {
        method: 'POST',
        body: { root: getRoot(), file: item.name },
    })
        .then((data) => {
            if (data.success) {
                notify.success('Archiv wird entpackt.');
                fetchFiles();
            } else {
                notify.error(data.message ?? 'Fehler');
            }
        })
        .finally(() => (actionLoading.value = false));
}
</script>

<template>
    <Card>
        <CardContent class="pt-6">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div class="flex flex-wrap items-center gap-2">
                    <div
                        class="flex items-center gap-1 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
                    >
                        <span class="font-medium text-foreground">/</span>
                        <button
                            type="button"
                            class="hover:text-foreground"
                            @click="navigateTo('/')"
                        >
                            Root
                        </button>
                        <template v-for="(part, i) in breadcrumbs" :key="i">
                            <ChevronRight class="h-4 shrink-0" />
                            <button
                                type="button"
                                class="hover:text-foreground"
                                @click="navigateTo('/' + breadcrumbs.slice(0, i + 1).join('/'))"
                            >
                                {{ part }}
                            </button>
                        </template>
                        <span class="text-foreground">/</span>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <div class="flex rounded-lg border bg-muted/30 p-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            :class="viewMode === 'list' ? 'bg-background shadow-sm' : ''"
                            @click="viewMode = 'list'"
                        >
                            <List class="h-4 w-4" />
                            <span class="ml-1.5 hidden sm:inline">Liste</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            :class="viewMode === 'grid' ? 'bg-background shadow-sm' : ''"
                            @click="viewMode = 'grid'"
                        >
                            <LayoutGrid class="h-4 w-4" />
                            <span class="ml-1.5 hidden sm:inline">Raster</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div class="mb-4 flex flex-wrap items-center gap-2">
                <div class="relative flex-1 min-w-[200px] max-w-md">
                    <Search
                        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Dateien und Ordner durchsuchen..."
                        class="pl-9"
                    />
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" @click="createFolderOpen = true">
                        <FolderPlus class="mr-2 h-4 w-4" />
                        Ordner erstellen
                    </Button>
                    <Button variant="outline" size="sm" @click="triggerUpload">
                        <Upload class="mr-2 h-4 w-4" />
                        Hochladen
                    </Button>
                    <input
                        ref="uploadInput"
                        type="file"
                        class="hidden"
                        multiple
                        @change="onUploadChange"
                    />
                    <Button variant="outline" size="sm" @click="newFileOpen = true">
                        <FilePlus class="mr-2 h-4 w-4" />
                        Neue Datei
                    </Button>
                    <Button variant="outline" size="sm" @click="openCompressModal">
                        <Archive class="mr-2 h-4 w-4" />
                        ZIP packen
                    </Button>
                </div>
            </div>

            <div v-if="loading" class="flex items-center justify-center py-12">
                <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
            <div
                v-else-if="error"
                class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
            >
                {{ error }}
            </div>

            <div v-else-if="viewMode === 'list'" class="rounded-lg border">
                <div
                    class="grid grid-cols-[1fr_80px_140px_40px] gap-2 border-b bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground"
                >
                    <span>Name</span>
                    <span class="text-right">Größe</span>
                    <span class="text-right hidden md:block">Geändert</span>
                    <span />
                </div>
                <div
                    v-for="item in filteredFiles"
                    :key="item.name"
                    class="grid grid-cols-[1fr_80px_140px_40px] gap-2 border-b px-3 py-2 text-sm last:border-b-0 hover:bg-muted/50 items-center"
                >
                    <button
                        type="button"
                        class="flex min-w-0 items-center gap-2 truncate text-left"
                        @click="openItem(item)"
                    >
                        <FolderOpen
                            v-if="!isFile(item)"
                            class="h-4 w-4 shrink-0 text-amber-500"
                        />
                        <FileText
                            v-else
                            class="h-4 w-4 shrink-0 text-muted-foreground"
                        />
                        <span class="truncate">{{ item.name }}</span>
                    </button>
                    <span class="text-right text-muted-foreground">
                        {{ isFile(item) ? formatBytes(item.size ?? 0) : '—' }}
                    </span>
                    <span class="text-right text-muted-foreground hidden md:block">
                        {{ formatDate(item.modified_at) }}
                    </span>
                    <div class="flex justify-end" @click.stop>
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button variant="ghost" size="icon" class="h-8 w-8">
                                    <MoreHorizontal class="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    v-if="isFile(item)"
                                    @click="openEdit(item)"
                                >
                                    <Pencil class="mr-2 h-4 w-4" />
                                    Bearbeiten
                                </DropdownMenuItem>
                                <DropdownMenuItem v-if="isFile(item)" @click="downloadFile(item.name)">
                                    <Download class="mr-2 h-4 w-4" />
                                    Herunterladen
                                </DropdownMenuItem>
                                <DropdownMenuItem v-if="isArchiveFile(item)" @click="submitDecompress(item)">
                                    <FileArchive class="mr-2 h-4 w-4" />
                                    ZIP entpacken
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="openRename(item)">
                                    Umbenennen
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    class="text-destructive focus:text-destructive"
                                    @click="openDelete(item)"
                                >
                                    <Trash2 class="mr-2 h-4 w-4" />
                                    Löschen
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div
                    v-if="filteredFiles.length === 0"
                    class="py-8 text-center text-sm text-muted-foreground"
                >
                    {{ searchQuery ? 'Keine Treffer' : 'Ordner ist leer' }}
                </div>
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <div
                    v-for="item in filteredFiles"
                    :key="item.name"
                    class="group relative flex flex-col items-center rounded-lg border bg-card p-4 hover:bg-muted/50"
                >
                    <button
                        type="button"
                        class="flex flex-col items-center gap-2 w-full min-w-0"
                        @click="openItem(item)"
                    >
                        <FolderOpen
                            v-if="!isFile(item)"
                            class="h-10 w-10 shrink-0 text-amber-500"
                        />
                        <FileText
                            v-else
                            class="h-10 w-10 shrink-0 text-muted-foreground"
                        />
                        <span class="text-center text-sm font-medium truncate w-full" :title="item.name">
                            {{ item.name }}
                        </span>
                        <span class="text-xs text-muted-foreground">
                            {{ isFile(item) ? formatBytes(item.size ?? 0) : '—' }}
                        </span>
                    </button>
                    <div class="absolute right-2 top-2 opacity-0 group-hover:opacity-100">
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button variant="ghost" size="icon" class="h-8 w-8">
                                    <MoreHorizontal class="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem v-if="isFile(item)" @click="openEdit(item)">
                                    <Pencil class="mr-2 h-4 w-4" />
                                    Bearbeiten
                                </DropdownMenuItem>
                                <DropdownMenuItem v-if="isFile(item)" @click="downloadFile(item.name)">
                                    <Download class="mr-2 h-4 w-4" />
                                    Herunterladen
                                </DropdownMenuItem>
                                <DropdownMenuItem v-if="isArchiveFile(item)" @click="submitDecompress(item)">
                                    <FileArchive class="mr-2 h-4 w-4" />
                                    ZIP entpacken
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="openRename(item)">
                                    Umbenennen
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    class="text-destructive focus:text-destructive"
                                    @click="openDelete(item)"
                                >
                                    <Trash2 class="mr-2 h-4 w-4" />
                                    Löschen
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div
                    v-if="filteredFiles.length === 0"
                    class="col-span-full py-8 text-center text-sm text-muted-foreground"
                >
                    {{ searchQuery ? 'Keine Treffer' : 'Ordner ist leer' }}
                </div>
            </div>
        </CardContent>
    </Card>

    <Modal v-model="createFolderOpen" size="sm">
        <ModalHeader>
            <h3 class="text-lg font-semibold">Ordner erstellen</h3>
        </ModalHeader>
        <ModalContent>
            <Label for="create-folder-name">Name</Label>
            <Input
                id="create-folder-name"
                v-model="createFolderName"
                class="mt-2"
                placeholder="Ordnername"
                @keydown.enter="submitCreateFolder"
            />
        </ModalContent>
        <ModalFooter>
            <Button variant="outline" @click="createFolderOpen = false">Abbrechen</Button>
            <Button :disabled="actionLoading || !createFolderName.trim()" @click="submitCreateFolder">
                Erstellen
            </Button>
        </ModalFooter>
    </Modal>

    <Modal v-model="newFileOpen" size="sm">
        <ModalHeader>
            <h3 class="text-lg font-semibold">Neue Datei</h3>
        </ModalHeader>
        <ModalContent>
            <Label for="new-file-name">Dateiname</Label>
            <Input
                id="new-file-name"
                v-model="newFileName"
                class="mt-2"
                placeholder="dateiname.txt"
                @keydown.enter="submitNewFile"
            />
        </ModalContent>
        <ModalFooter>
            <Button variant="outline" @click="newFileOpen = false">Abbrechen</Button>
            <Button :disabled="actionLoading || !newFileName.trim()" @click="submitNewFile">
                Erstellen
            </Button>
        </ModalFooter>
    </Modal>

    <Modal v-model="renameOpen" size="sm">
        <ModalHeader>
            <h3 class="text-lg font-semibold">Umbenennen</h3>
        </ModalHeader>
        <ModalContent>
            <Label for="rename-to">Neuer Name</Label>
            <Input
                id="rename-to"
                v-model="renameTo"
                class="mt-2"
                @keydown.enter="submitRename"
            />
        </ModalContent>
        <ModalFooter>
            <Button variant="outline" @click="renameOpen = false">Abbrechen</Button>
            <Button
                :disabled="actionLoading || !renameTo.trim() || renameTo === renameFrom"
                @click="submitRename"
            >
                Umbenennen
            </Button>
        </ModalFooter>
    </Modal>

    <Modal v-model="deleteOpen" size="sm">
        <ModalHeader>
            <h3 class="text-lg font-semibold">Löschen</h3>
        </ModalHeader>
        <ModalContent>
            <p class="text-sm text-muted-foreground">
                „{{ deleteTarget?.name }}“ unwiderruflich löschen?
            </p>
        </ModalContent>
        <ModalFooter>
            <Button variant="outline" @click="deleteOpen = false">Abbrechen</Button>
            <Button variant="destructive" :disabled="actionLoading" @click="submitDelete">
                Löschen
            </Button>
        </ModalFooter>
    </Modal>

    <Modal v-model="compressOpen" size="md">
        <ModalHeader>
            <h3 class="text-lg font-semibold">ZIP packen</h3>
        </ModalHeader>
        <ModalContent>
            <p class="mb-3 text-sm text-muted-foreground">
                Wählen Sie die Dateien und Ordner aus, die ins Archiv sollen.
            </p>
            <div class="max-h-64 space-y-2 overflow-y-auto rounded-lg border p-2">
                <label
                    v-for="item in files"
                    :key="item.name"
                    class="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-muted/50"
                >
                    <input
                        type="checkbox"
                        :checked="selectedFilesForZip.includes(item.name)"
                        class="rounded"
                        @change="toggleFileForZip(item.name)"
                    />
                    <FolderOpen
                        v-if="!isFile(item)"
                        class="h-4 w-4 shrink-0 text-amber-500"
                    />
                    <FileText
                        v-else
                        class="h-4 w-4 shrink-0 text-muted-foreground"
                    />
                    <span class="truncate text-sm">{{ item.name }}</span>
                </label>
                <p v-if="files.length === 0" class="py-2 text-center text-sm text-muted-foreground">
                    Ordner ist leer
                </p>
            </div>
        </ModalContent>
        <ModalFooter>
            <Button variant="outline" @click="compressOpen = false">Abbrechen</Button>
            <Button
                :disabled="actionLoading || selectedFilesForZip.length === 0"
                @click="submitCompress"
            >
                ZIP packen
            </Button>
        </ModalFooter>
    </Modal>

    <Modal v-model="editOpen" size="full">
        <ModalHeader>
            <h3 class="text-lg font-semibold truncate">{{ editPath || 'Bearbeiten' }}</h3>
        </ModalHeader>
        <ModalContent class="flex-1 min-h-0 p-0 flex flex-col overflow-hidden">
            <div class="flex-1 min-h-0 w-full px-4 overflow-hidden" style="min-height: 60vh;">
                <VueMonacoEditor
                    v-model:value="editContent"
                    :language="getLanguageFromPath(editPath)"
                    :theme="monacoTheme"
                    :options="MONACO_OPTIONS"
                    class="rounded-b-xl"
                    style="height: calc(90vh - 8rem);"
                />
            </div>
        </ModalContent>
        <ModalFooter class="flex-shrink-0">
            <Button variant="outline" @click="editOpen = false">Schließen</Button>
            <Button :disabled="editSaving" @click="submitEdit">Speichern</Button>
        </ModalFooter>
    </Modal>
</template>
