import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
export const show = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/site/{site}/{pageSlug?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
show.url = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    pageSlug: args[1],
                }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
            "pageSlug",
        ])

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.slug
                : args.site,
                                pageSlug: args.pageSlug,
                }

    return show.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{pageSlug?}', parsedArgs.pageSlug?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
show.get = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
show.head = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
    const showForm = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
        showForm.get = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteRenderController::show
 * @see app/Http/Controllers/SiteRenderController.php:24
 * @route '/site/{site}/{pageSlug?}'
 */
        showForm.head = (args: { site: string | { slug: string }, pageSlug?: string | number } | [site: string | { slug: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
export const preview = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/sites/{site}/preview/{pageSlug?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
preview.url = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    pageSlug: args[1],
                }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
            "pageSlug",
        ])

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                pageSlug: args.pageSlug,
                }

    return preview.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{pageSlug?}', parsedArgs.pageSlug?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
preview.get = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
preview.head = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
    const previewForm = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
        previewForm.get = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SiteRenderController::preview
 * @see app/Http/Controllers/SiteRenderController.php:59
 * @route '/sites/{site}/preview/{pageSlug?}'
 */
        previewForm.head = (args: { site: string | { uuid: string }, pageSlug?: string | number } | [site: string | { uuid: string }, pageSlug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\SiteRenderController::storePreviewDraft
 * @see app/Http/Controllers/SiteRenderController.php:95
 * @route '/sites/{site}/preview'
 */
export const storePreviewDraft = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePreviewDraft.url(args, options),
    method: 'post',
})

storePreviewDraft.definition = {
    methods: ["post"],
    url: '/sites/{site}/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SiteRenderController::storePreviewDraft
 * @see app/Http/Controllers/SiteRenderController.php:95
 * @route '/sites/{site}/preview'
 */
storePreviewDraft.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { site: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { site: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                }

    return storePreviewDraft.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteRenderController::storePreviewDraft
 * @see app/Http/Controllers/SiteRenderController.php:95
 * @route '/sites/{site}/preview'
 */
storePreviewDraft.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePreviewDraft.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SiteRenderController::storePreviewDraft
 * @see app/Http/Controllers/SiteRenderController.php:95
 * @route '/sites/{site}/preview'
 */
    const storePreviewDraftForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePreviewDraft.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteRenderController::storePreviewDraft
 * @see app/Http/Controllers/SiteRenderController.php:95
 * @route '/sites/{site}/preview'
 */
        storePreviewDraftForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePreviewDraft.url(args, options),
            method: 'post',
        })
    
    storePreviewDraft.form = storePreviewDraftForm
const SiteRenderController = { show, preview, storePreviewDraft }

export default SiteRenderController