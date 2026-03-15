import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
export const show = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/webspace-accounts/{webspace_account}/connect-domain',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
show.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webspace_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: args.webspace_account,
                }

    return show.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
show.get = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
show.head = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
    const showForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
        showForm.get = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WebspaceAccountController::show
 * @see app/Http/Controllers/WebspaceAccountController.php:167
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
        showForm.head = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\WebspaceAccountController::store
 * @see app/Http/Controllers/WebspaceAccountController.php:206
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
export const store = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/webspace-accounts/{webspace_account}/connect-domain',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WebspaceAccountController::store
 * @see app/Http/Controllers/WebspaceAccountController.php:206
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
store.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webspace_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: args.webspace_account,
                }

    return store.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WebspaceAccountController::store
 * @see app/Http/Controllers/WebspaceAccountController.php:206
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
store.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WebspaceAccountController::store
 * @see app/Http/Controllers/WebspaceAccountController.php:206
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
    const storeForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WebspaceAccountController::store
 * @see app/Http/Controllers/WebspaceAccountController.php:206
 * @route '/webspace-accounts/{webspace_account}/connect-domain'
 */
        storeForm.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const connectDomain = {
    show: Object.assign(show, show),
store: Object.assign(store, store),
}

export default connectDomain