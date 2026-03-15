import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GalleryController::index
 * @see app/Http/Controllers/GalleryController.php:12
 * @route '/gallery'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/gallery',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GalleryController::index
 * @see app/Http/Controllers/GalleryController.php:12
 * @route '/gallery'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GalleryController::index
 * @see app/Http/Controllers/GalleryController.php:12
 * @route '/gallery'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GalleryController::index
 * @see app/Http/Controllers/GalleryController.php:12
 * @route '/gallery'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GalleryController::index
 * @see app/Http/Controllers/GalleryController.php:12
 * @route '/gallery'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GalleryController::index
 * @see app/Http/Controllers/GalleryController.php:12
 * @route '/gallery'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GalleryController::index
 * @see app/Http/Controllers/GalleryController.php:12
 * @route '/gallery'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\GalleryController::preview
 * @see app/Http/Controllers/GalleryController.php:24
 * @route '/gallery/preview/{template}'
 */
export const preview = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/gallery/preview/{template}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GalleryController::preview
 * @see app/Http/Controllers/GalleryController.php:24
 * @route '/gallery/preview/{template}'
 */
preview.url = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { template: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { template: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        template: typeof args.template === 'object'
                ? args.template.id
                : args.template,
                }

    return preview.definition.url
            .replace('{template}', parsedArgs.template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GalleryController::preview
 * @see app/Http/Controllers/GalleryController.php:24
 * @route '/gallery/preview/{template}'
 */
preview.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GalleryController::preview
 * @see app/Http/Controllers/GalleryController.php:24
 * @route '/gallery/preview/{template}'
 */
preview.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GalleryController::preview
 * @see app/Http/Controllers/GalleryController.php:24
 * @route '/gallery/preview/{template}'
 */
    const previewForm = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GalleryController::preview
 * @see app/Http/Controllers/GalleryController.php:24
 * @route '/gallery/preview/{template}'
 */
        previewForm.get = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GalleryController::preview
 * @see app/Http/Controllers/GalleryController.php:24
 * @route '/gallery/preview/{template}'
 */
        previewForm.head = (args: { template: number | { id: number } } | [template: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
const GalleryController = { index, preview }

export default GalleryController