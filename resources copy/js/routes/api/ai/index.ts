import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AiController::seoSuggestions
 * @see app/Http/Controllers/Api/AiController.php:29
 * @route '/api/ai/seo-suggestions'
 */
export const seoSuggestions = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: seoSuggestions.url(options),
    method: 'post',
})

seoSuggestions.definition = {
    methods: ["post"],
    url: '/api/ai/seo-suggestions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AiController::seoSuggestions
 * @see app/Http/Controllers/Api/AiController.php:29
 * @route '/api/ai/seo-suggestions'
 */
seoSuggestions.url = (options?: RouteQueryOptions) => {
    return seoSuggestions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AiController::seoSuggestions
 * @see app/Http/Controllers/Api/AiController.php:29
 * @route '/api/ai/seo-suggestions'
 */
seoSuggestions.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: seoSuggestions.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AiController::seoSuggestions
 * @see app/Http/Controllers/Api/AiController.php:29
 * @route '/api/ai/seo-suggestions'
 */
    const seoSuggestionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: seoSuggestions.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AiController::seoSuggestions
 * @see app/Http/Controllers/Api/AiController.php:29
 * @route '/api/ai/seo-suggestions'
 */
        seoSuggestionsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: seoSuggestions.url(options),
            method: 'post',
        })
    
    seoSuggestions.form = seoSuggestionsForm
/**
* @see \App\Http\Controllers\Api\AiController::generateText
 * @see app/Http/Controllers/Api/AiController.php:71
 * @route '/api/ai/generate-text'
 */
export const generateText = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateText.url(options),
    method: 'post',
})

generateText.definition = {
    methods: ["post"],
    url: '/api/ai/generate-text',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AiController::generateText
 * @see app/Http/Controllers/Api/AiController.php:71
 * @route '/api/ai/generate-text'
 */
generateText.url = (options?: RouteQueryOptions) => {
    return generateText.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AiController::generateText
 * @see app/Http/Controllers/Api/AiController.php:71
 * @route '/api/ai/generate-text'
 */
generateText.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateText.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AiController::generateText
 * @see app/Http/Controllers/Api/AiController.php:71
 * @route '/api/ai/generate-text'
 */
    const generateTextForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generateText.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AiController::generateText
 * @see app/Http/Controllers/Api/AiController.php:71
 * @route '/api/ai/generate-text'
 */
        generateTextForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generateText.url(options),
            method: 'post',
        })
    
    generateText.form = generateTextForm
/**
* @see \App\Http\Controllers\Api\AiController::balance
 * @see app/Http/Controllers/Api/AiController.php:122
 * @route '/api/ai/balance'
 */
export const balance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: balance.url(options),
    method: 'get',
})

balance.definition = {
    methods: ["get","head"],
    url: '/api/ai/balance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AiController::balance
 * @see app/Http/Controllers/Api/AiController.php:122
 * @route '/api/ai/balance'
 */
balance.url = (options?: RouteQueryOptions) => {
    return balance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AiController::balance
 * @see app/Http/Controllers/Api/AiController.php:122
 * @route '/api/ai/balance'
 */
balance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: balance.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AiController::balance
 * @see app/Http/Controllers/Api/AiController.php:122
 * @route '/api/ai/balance'
 */
balance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: balance.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AiController::balance
 * @see app/Http/Controllers/Api/AiController.php:122
 * @route '/api/ai/balance'
 */
    const balanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: balance.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AiController::balance
 * @see app/Http/Controllers/Api/AiController.php:122
 * @route '/api/ai/balance'
 */
        balanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: balance.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AiController::balance
 * @see app/Http/Controllers/Api/AiController.php:122
 * @route '/api/ai/balance'
 */
        balanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: balance.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    balance.form = balanceForm
const ai = {
    seoSuggestions: Object.assign(seoSuggestions, seoSuggestions),
generateText: Object.assign(generateText, generateText),
balance: Object.assign(balance, balance),
}

export default ai