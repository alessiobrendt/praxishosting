import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import subscription from './subscription'
/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::index
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:21
 * @route '/admin/webspace-accounts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/webspace-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::index
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:21
 * @route '/admin/webspace-accounts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::index
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:21
 * @route '/admin/webspace-accounts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::index
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:21
 * @route '/admin/webspace-accounts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::index
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:21
 * @route '/admin/webspace-accounts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::index
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:21
 * @route '/admin/webspace-accounts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::index
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:21
 * @route '/admin/webspace-accounts'
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
* @see \App\Http\Controllers\Admin\WebspaceAccountController::retryPlesk
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:51
 * @route '/admin/webspace-accounts/{webspace_account}/retry-plesk'
 */
export const retryPlesk = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryPlesk.url(args, options),
    method: 'post',
})

retryPlesk.definition = {
    methods: ["post"],
    url: '/admin/webspace-accounts/{webspace_account}/retry-plesk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::retryPlesk
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:51
 * @route '/admin/webspace-accounts/{webspace_account}/retry-plesk'
 */
retryPlesk.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return retryPlesk.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::retryPlesk
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:51
 * @route '/admin/webspace-accounts/{webspace_account}/retry-plesk'
 */
retryPlesk.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryPlesk.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::retryPlesk
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:51
 * @route '/admin/webspace-accounts/{webspace_account}/retry-plesk'
 */
    const retryPleskForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retryPlesk.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::retryPlesk
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:51
 * @route '/admin/webspace-accounts/{webspace_account}/retry-plesk'
 */
        retryPleskForm.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retryPlesk.url(args, options),
            method: 'post',
        })
    
    retryPlesk.form = retryPleskForm
/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::show
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:36
 * @route '/admin/webspace-accounts/{webspace_account}'
 */
export const show = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/webspace-accounts/{webspace_account}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::show
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:36
 * @route '/admin/webspace-accounts/{webspace_account}'
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
* @see \App\Http\Controllers\Admin\WebspaceAccountController::show
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:36
 * @route '/admin/webspace-accounts/{webspace_account}'
 */
show.get = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::show
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:36
 * @route '/admin/webspace-accounts/{webspace_account}'
 */
show.head = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::show
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:36
 * @route '/admin/webspace-accounts/{webspace_account}'
 */
    const showForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::show
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:36
 * @route '/admin/webspace-accounts/{webspace_account}'
 */
        showForm.get = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::show
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:36
 * @route '/admin/webspace-accounts/{webspace_account}'
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
const webspaceAccounts = {
    index: Object.assign(index, index),
retryPlesk: Object.assign(retryPlesk, retryPlesk),
subscription: Object.assign(subscription, subscription),
show: Object.assign(show, show),
}

export default webspaceAccounts