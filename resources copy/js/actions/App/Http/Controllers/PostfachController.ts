import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PostfachController::index
 * @see app/Http/Controllers/PostfachController.php:12
 * @route '/account/postfach'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/account/postfach',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PostfachController::index
 * @see app/Http/Controllers/PostfachController.php:12
 * @route '/account/postfach'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostfachController::index
 * @see app/Http/Controllers/PostfachController.php:12
 * @route '/account/postfach'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PostfachController::index
 * @see app/Http/Controllers/PostfachController.php:12
 * @route '/account/postfach'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PostfachController::index
 * @see app/Http/Controllers/PostfachController.php:12
 * @route '/account/postfach'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PostfachController::index
 * @see app/Http/Controllers/PostfachController.php:12
 * @route '/account/postfach'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PostfachController::index
 * @see app/Http/Controllers/PostfachController.php:12
 * @route '/account/postfach'
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
* @see \App\Http\Controllers\PostfachController::show
 * @see app/Http/Controllers/PostfachController.php:17
 * @route '/account/postfach/{postfach}'
 */
export const show = (args: { postfach: string | { uuid: string } } | [postfach: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/account/postfach/{postfach}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PostfachController::show
 * @see app/Http/Controllers/PostfachController.php:17
 * @route '/account/postfach/{postfach}'
 */
show.url = (args: { postfach: string | { uuid: string } } | [postfach: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { postfach: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { postfach: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    postfach: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        postfach: typeof args.postfach === 'object'
                ? args.postfach.uuid
                : args.postfach,
                }

    return show.definition.url
            .replace('{postfach}', parsedArgs.postfach.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PostfachController::show
 * @see app/Http/Controllers/PostfachController.php:17
 * @route '/account/postfach/{postfach}'
 */
show.get = (args: { postfach: string | { uuid: string } } | [postfach: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PostfachController::show
 * @see app/Http/Controllers/PostfachController.php:17
 * @route '/account/postfach/{postfach}'
 */
show.head = (args: { postfach: string | { uuid: string } } | [postfach: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PostfachController::show
 * @see app/Http/Controllers/PostfachController.php:17
 * @route '/account/postfach/{postfach}'
 */
    const showForm = (args: { postfach: string | { uuid: string } } | [postfach: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PostfachController::show
 * @see app/Http/Controllers/PostfachController.php:17
 * @route '/account/postfach/{postfach}'
 */
        showForm.get = (args: { postfach: string | { uuid: string } } | [postfach: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PostfachController::show
 * @see app/Http/Controllers/PostfachController.php:17
 * @route '/account/postfach/{postfach}'
 */
        showForm.head = (args: { postfach: string | { uuid: string } } | [postfach: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const PostfachController = { index, show }

export default PostfachController