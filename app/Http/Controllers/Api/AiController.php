<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\GenerateTextRequest;
use App\Http\Requests\Api\SeoSuggestionsRequest;
use App\Models\Site;
use App\Services\AiTokenService;
use App\Services\LayoutContentExtractor;
use App\Services\OpenAiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Config;

class AiController extends Controller
{
    private const SEO_TOKEN_ESTIMATE = 500;

    private const TEXT_TOKEN_ESTIMATE_MIN = 300;

    private const TEXT_TOKEN_ESTIMATE_MAX = 1500;

    public function __construct(
        protected AiTokenService $tokenService,
        protected OpenAiService $openAiService,
        protected LayoutContentExtractor $contentExtractor
    ) {}

    public function seoSuggestions(SeoSuggestionsRequest $request): JsonResponse
    {
        $user = $request->user();
        if (! $this->tokenService->hasEnough($user, self::SEO_TOKEN_ESTIMATE)) {
            return response()->json([
                'message' => 'Nicht genügend AI-Tokens. Bitte laden Sie Ihr Guthaben auf.',
            ], 402);
        }

        if (! $this->isOpenAiConfigured()) {
            return response()->json([
                'message' => 'AI-Service ist derzeit nicht verfügbar.',
            ], 503);
        }

        $pageContent = $request->validated('page_content');
        if (empty($pageContent) && ! empty($request->validated('layout_components'))) {
            $pageContent = $this->contentExtractor->extractText(
                $request->validated('layout_components')
            );
        }
        $pageContent = $pageContent ?? '';
        $pageTitle = $request->validated('page_title') ?? $request->validated('page_slug');

        try {
            $result = $this->openAiService->generateSeoSuggestions($pageContent, $pageTitle);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'AI-Anfrage fehlgeschlagen. Bitte versuchen Sie es später erneut.',
            ], 500);
        }

        $this->tokenService->deduct(
            $user,
            self::SEO_TOKEN_ESTIMATE,
            'SEO-Vorschläge',
            Site::where('uuid', $request->validated('site_uuid'))->first()
        );

        return response()->json($result);
    }

    public function generateText(GenerateTextRequest $request): JsonResponse
    {
        $user = $request->user();
        $estimate = min(
            self::TEXT_TOKEN_ESTIMATE_MAX,
            max(
                self::TEXT_TOKEN_ESTIMATE_MIN,
                (int) ceil(mb_strlen($request->validated('context')) / 4) * 2
            )
        );

        if (! $this->tokenService->hasEnough($user, $estimate)) {
            return response()->json([
                'message' => 'Nicht genügend AI-Tokens. Bitte laden Sie Ihr Guthaben auf.',
            ], 402);
        }

        if (! $this->isOpenAiConfigured()) {
            return response()->json([
                'message' => 'AI-Service ist derzeit nicht verfügbar.',
            ], 503);
        }

        $additionalPrompt = $request->validated('prompt');
        $additionalPrompt = is_string($additionalPrompt) && trim($additionalPrompt) !== ''
            ? trim($additionalPrompt)
            : null;

        try {
            $text = $this->openAiService->generateText(
                context: $request->validated('context'),
                promptTemplate: $request->validated('prompt_template'),
                pageName: $request->validated('page_name'),
                blockType: $request->validated('block_type'),
                additionalPrompt: $additionalPrompt
            );
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'AI-Anfrage fehlgeschlagen. Bitte versuchen Sie es später erneut.',
            ], 500);
        }

        $actualTokens = $this->openAiService->estimateTokens($request->validated('context')) +
            $this->openAiService->estimateTokens($text);
        $deductAmount = min($estimate, max(self::TEXT_TOKEN_ESTIMATE_MIN, $actualTokens));

        $this->tokenService->deduct($user, $deductAmount, 'KI-Author Text-Generierung');

        return response()->json(['text' => $text]);
    }

    public function balance(\Illuminate\Http\Request $request): JsonResponse
    {
        return response()->json([
            'balance' => $this->tokenService->getBalance($request->user()),
        ]);
    }

    private function isOpenAiConfigured(): bool
    {
        $key = Config::get('openai.api_key');

        return is_string($key) && trim($key) !== '';
    }
}
