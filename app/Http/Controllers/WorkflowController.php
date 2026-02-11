<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WorkflowController extends Controller
{
    private function storageDir(): string
    {
        return 'workflows';
    }

    private function safeId(string $id): string
    {
        $id = preg_replace('/[^a-zA-Z0-9_-]/', '', $id);

        return $id !== '' ? $id : 'default';
    }

    public function index(Request $request): Response
    {
        $ids = $this->listIds();

        return Inertia::render('WorkflowBuilder/Index', [
            'workflowIds' => $ids,
        ]);
    }

    public function list(Request $request): JsonResponse
    {
        $ids = $this->listIds();

        return response()->json(['ok' => true, 'ids' => $ids]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $request->all();

        if (! is_array($payload) || ! isset($payload['meta'], $payload['nodes'], $payload['edges'])) {
            return response()->json(['ok' => false, 'error' => 'Invalid JSON body'], 400);
        }

        $id = $this->safeId((string) ($payload['meta']['id'] ?? 'default'));
        $payload['meta']['id'] = $id;
        $payload['meta']['saved_at'] = now()->toIso8601String();

        $path = $this->storageDir().'/'.$id.'.json';
        $content = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

        if (! Storage::put($path, $content)) {
            return response()->json(['ok' => false, 'error' => 'Could not write file'], 500);
        }

        return response()->json(['ok' => true, 'id' => $id, 'path' => basename($path)]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $id = $this->safeId($id);
        $path = $this->storageDir().'/'.$id.'.json';

        if (! Storage::exists($path)) {
            return response()->json(['ok' => false, 'error' => 'Not found'], 404);
        }

        $raw = Storage::get($path);
        $data = json_decode($raw ?: 'null', true);

        if (! is_array($data)) {
            return response()->json(['ok' => false, 'error' => 'Corrupt JSON'], 500);
        }

        return response()->json(['ok' => true, 'data' => $data]);
    }

    /**
     * @return array<int, string>
     */
    private function listIds(): array
    {
        $files = Storage::files($this->storageDir());
        $ids = [];

        foreach ($files as $file) {
            if (str_ends_with($file, '.json')) {
                $ids[] = basename($file, '.json');
            }
        }

        sort($ids);

        return $ids;
    }
}
