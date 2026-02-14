<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Services\SitePageDataResolver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteDesignerController extends Controller
{
    private const PREVIEW_DRAFT_KEY = 'site_preview_draft';

    /**
     * Get full designer state (site, template, custom_page_data, custom_colors).
     * Used for initial load or sync.
     */
    public function state(Site $site): JsonResponse
    {
        $this->authorize('update', $site);

        if (! $site->has_page_designer) {
            abort(403, 'Page Designer is not enabled for this site.');
        }

        $site->unsetRelation('template');
        $site->load(['template.pages']);

        return response()->json([
            'site' => $site->makeHidden('id'),
            'custom_page_data' => $site->custom_page_data ?? [],
            'custom_colors' => $site->custom_colors ?? [],
            'updated_at' => $site->updated_at?->toIso8601String(),
        ]);
    }

    /**
     * Store draft in session for preview. Same behaviour as storePreviewDraft.
     */
    public function draft(Request $request, Site $site): JsonResponse
    {
        $this->authorize('update', $site);

        $validated = $request->validate([
            'custom_page_data' => ['nullable', 'array'],
            'custom_colors' => ['nullable', 'array'],
        ]);

        session([self::PREVIEW_DRAFT_KEY.'.'.$site->id => $validated]);

        return response()->json(['ok' => true]);
    }

    /**
     * Publish: save custom_page_data and custom_colors to site.
     * Uses relational site_pages/site_blocks for has_page_designer sites.
     */
    public function publish(Request $request, Site $site): JsonResponse
    {
        $this->authorize('update', $site);

        $validated = $request->validate([
            'custom_page_data' => ['nullable', 'array'],
            'custom_colors' => ['nullable', 'array'],
            'favicon_url' => ['nullable', 'string', 'max:500'],
            'updated_at' => ['nullable', 'string'],
        ]);

        $clientUpdatedAt = $validated['updated_at'] ?? null;
        if ($clientUpdatedAt !== null && $site->updated_at?->toIso8601String() !== $clientUpdatedAt) {
            return response()->json(['message' => 'Conflict: site was modified elsewhere'], 409);
        }

        $customPageData = $validated['custom_page_data'] ?? null;

        if ($customPageData !== null && is_array($customPageData) && $site->has_page_designer) {
            if (isset($customPageData['pages_meta'])) {
                $customPageData['pages_meta']['index'] = array_merge(
                    $customPageData['pages_meta']['index'] ?? [],
                    ['active' => true],
                );
            }
            app(SitePageDataResolver::class)->syncToRelational($site, $customPageData);
            if (auth()->check()) {
                $site->createVersionSnapshot(auth()->id());
            }
        } elseif ($customPageData !== null) {
            $site->update(['custom_page_data' => $customPageData]);
        }

        if (array_key_exists('custom_colors', $validated)) {
            $site->update(['custom_colors' => $validated['custom_colors']]);
        }

        if (array_key_exists('favicon_url', $validated)) {
            $site->update(['favicon_url' => $validated['favicon_url'] ?: null]);
        }

        $site->refresh();

        return response()->json([
            'ok' => true,
            'updated_at' => $site->updated_at?->toIso8601String(),
        ]);
    }

    /**
     * Update a single block by id (patch block data in draft or published tree).
     * Body: page_slug, data (merge into block.data).
     */
    public function updateBlock(Request $request, Site $site, string $blockId): JsonResponse
    {
        $this->authorize('update', $site);

        $validated = $request->validate([
            'page_slug' => ['required', 'string', 'max:255'],
            'data' => ['nullable', 'array'],
        ]);

        $pageSlug = $validated['page_slug'];
        $mergeData = $validated['data'] ?? [];

        $key = self::PREVIEW_DRAFT_KEY.'.'.$site->id;
        $draft = session($key);
        $source = isset($draft['custom_page_data']) ? $draft['custom_page_data'] : $site->custom_page_data ?? [];
        $tree = $this->getLayoutTreeForPage($source, $pageSlug);
        $updated = $this->patchBlockInTree($tree, $blockId, $mergeData);
        if (! $updated) {
            return response()->json(['message' => 'Block not found'], 404);
        }
        $newPageData = $this->setLayoutTreeForPage($source, $pageSlug, $tree);
        $merged = array_merge($draft ?: [], ['custom_page_data' => $newPageData]);
        session([$key => $merged]);

        return response()->json(['ok' => true]);
    }

    /**
     * Create a new block. Body: page_slug, parent_id (optional), type, data, position.
     */
    public function storeBlock(Request $request, Site $site): JsonResponse
    {
        $this->authorize('update', $site);

        $validated = $request->validate([
            'page_slug' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            'data' => ['nullable', 'array'],
            'position' => ['nullable', 'integer', 'min:0'],
        ]);

        $key = self::PREVIEW_DRAFT_KEY.'.'.$site->id;
        $draft = session($key);
        $source = isset($draft['custom_page_data']) ? $draft['custom_page_data'] : $site->custom_page_data ?? [];
        $tree = $this->getLayoutTreeForPage($source, $validated['page_slug']);
        $newId = 'block_'.uniqid();
        $newBlock = [
            'id' => $newId,
            'type' => $validated['type'],
            'data' => $validated['data'] ?? [],
            'children' => [],
        ];
        $position = $validated['position'] ?? count($tree);
        $parentId = $validated['parent_id'] ?? null;
        if ($parentId !== null && $parentId !== '') {
            $inserted = $this->insertBlockUnderParent($tree, $parentId, $newBlock, $position);
            if (! $inserted) {
                return response()->json(['message' => 'Parent not found'], 404);
            }
        } else {
            array_splice($tree, min($position, count($tree)), 0, [$newBlock]);
        }
        $newPageData = $this->setLayoutTreeForPage($source, $validated['page_slug'], $tree);
        $merged = array_merge($draft ?: [], ['custom_page_data' => $newPageData]);
        session([$key => $merged]);

        return response()->json(['ok' => true, 'id' => $newId]);
    }

    /**
     * Delete a block by id from the tree (draft).
     */
    public function destroyBlock(Request $request, Site $site, string $blockId): JsonResponse
    {
        $this->authorize('update', $site);

        $pageSlug = $request->validate(['page_slug' => ['required', 'string', 'max:255']])['page_slug'];

        $key = self::PREVIEW_DRAFT_KEY.'.'.$site->id;
        $draft = session($key);
        $source = isset($draft['custom_page_data']) ? $draft['custom_page_data'] : $site->custom_page_data ?? [];
        $tree = $this->getLayoutTreeForPage($source, $pageSlug);
        $removed = $this->removeBlockFromTree($tree, $blockId);
        if (! $removed) {
            return response()->json(['message' => 'Block not found'], 404);
        }
        $newPageData = $this->setLayoutTreeForPage($source, $pageSlug, $tree);
        $merged = array_merge($draft ?: [], ['custom_page_data' => $newPageData]);
        session([$key => $merged]);

        return response()->json(['ok' => true]);
    }

    /**
     * Upload image for designer. Same as SiteController@uploadImage.
     */
    public function upload(Request $request, Site $site): JsonResponse
    {
        $this->authorize('update', $site);

        $request->validate([
            'image' => ['required', 'image', 'max:5120'],
        ]);

        $path = $request->file('image')->store(
            "sites/{$site->id}/images",
            'public'
        );

        return response()->json([
            'url' => asset('storage/'.$path),
        ]);
    }

    /**
     * @param  array<string, mixed>  $source
     * @return list<array<string, mixed>>
     */
    private function getLayoutTreeForPage(array $source, string $pageSlug): array
    {
        if ($pageSlug === 'index') {
            $layout = $source['layout_components'] ?? [];

            return is_array($layout) ? $layout : [];
        }
        $pages = $source['pages'] ?? [];
        $page = $pages[$pageSlug] ?? [];
        $layout = $page['layout_components'] ?? [];

        return is_array($layout) ? $layout : [];
    }

    /**
     * @param  array<string, mixed>  $source
     * @param  list<array<string, mixed>>  $tree
     * @return array<string, mixed>
     */
    private function setLayoutTreeForPage(array $source, string $pageSlug, array $tree): array
    {
        $out = $source;
        if ($pageSlug === 'index') {
            $out['layout_components'] = $tree;

            return $out;
        }
        $pages = $source['pages'] ?? [];
        $pages[$pageSlug] = array_merge($pages[$pageSlug] ?? [], ['layout_components' => $tree]);
        $out['pages'] = $pages;

        return $out;
    }

    /**
     * @param  list<array<string, mixed>>  $tree
     */
    private function patchBlockInTree(array &$tree, string $blockId, array $mergeData): bool
    {
        foreach ($tree as &$entry) {
            if (isset($entry['id']) && $entry['id'] === $blockId) {
                $entry['data'] = array_merge($entry['data'] ?? [], $mergeData);

                return true;
            }
            if (! empty($entry['children']) && $this->patchBlockInTree($entry['children'], $blockId, $mergeData)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  list<array<string, mixed>>  $tree
     */
    private function insertBlockUnderParent(array &$tree, string $parentId, array $newBlock, int $position): bool
    {
        foreach ($tree as &$entry) {
            if (isset($entry['id']) && $entry['id'] === $parentId) {
                $children = $entry['children'] ?? [];
                array_splice($children, min($position, count($children)), 0, [$newBlock]);
                $entry['children'] = $children;

                return true;
            }
            if (! empty($entry['children']) && $this->insertBlockUnderParent($entry['children'], $parentId, $newBlock, $position)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param  list<array<string, mixed>>  $tree
     */
    private function removeBlockFromTree(array &$tree, string $blockId): bool
    {
        foreach ($tree as $i => &$entry) {
            if (isset($entry['id']) && $entry['id'] === $blockId) {
                array_splice($tree, $i, 1);

                return true;
            }
            if (! empty($entry['children']) && $this->removeBlockFromTree($entry['children'], $blockId)) {
                return true;
            }
        }

        return false;
    }
}
