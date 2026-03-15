import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import periodAndStatus from './period-and-status'
import servers from './servers'
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/gameserver-cloud-accounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::index
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:64
 * @route '/admin/gameserver-cloud-accounts'
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
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
export const show = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/gameserver-cloud-accounts/{subscription}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
show.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { subscription: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                }

    return show.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
show.get = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
show.head = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
    const showForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
        showForm.get = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::show
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:122
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
        showForm.head = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:206
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
export const update = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/gameserver-cloud-accounts/{subscription}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:206
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
update.url = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { subscription: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.uuid
                : args.subscription,
                }

    return update.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:206
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
update.put = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:206
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
    const updateForm = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:206
 * @route '/admin/gameserver-cloud-accounts/{subscription}'
 */
        updateForm.put = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const gameserverCloudAccounts = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
update: Object.assign(update, update),
periodAndStatus: Object.assign(periodAndStatus, periodAndStatus),
servers: Object.assign(servers, servers),
}

export default gameserverCloudAccounts