<?php

namespace App\Services;

class LayoutContentExtractor
{
    /**
     * Extract text content from layout_components tree for SEO/LLM use.
     *
     * @param  array<int, array{type?: string, data?: array, children?: array}>  $components
     */
    public function extractText(array $components): string
    {
        $parts = [];

        foreach ($components as $comp) {
            if (! is_array($comp)) {
                continue;
            }

            $data = $comp['data'] ?? [];
            $textFields = ['heading', 'text', 'title', 'subtitle', 'content', 'button_text', 'label'];
            foreach ($textFields as $field) {
                $val = $data[$field] ?? null;
                if (is_string($val) && trim($val) !== '') {
                    $parts[] = trim(strip_tags($val));
                }
            }

            $children = $comp['children'] ?? [];
            if (! empty($children)) {
                $parts[] = $this->extractText($children);
            }
        }

        return implode("\n", array_filter($parts));
    }
}
