import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:247
 * @route '/admin/gameserver-cloud-accounts/{subscription}/period-and-status'
 */
export const update = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/gameserver-cloud-accounts/{subscription}/period-and-status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:247
 * @route '/admin/gameserver-cloud-accounts/{subscription}/period-and-status'
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
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:247
 * @route '/admin/gameserver-cloud-accounts/{subscription}/period-and-status'
 */
update.put = (args: { subscription: string | { uuid: string } } | [subscription: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\GameServerAccountController::update
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:247
 * @route '/admin/gameserver-cloud-accounts/{subscription}/period-and-status'
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
 * @see app/Http/Controllers/Admin/GameServerAccountController.php:247
 * @route '/admin/gameserver-cloud-accounts/{subscription}/period-and-status'
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
const periodAndStatus = {
    update: Object.assign(update, update),
}

export default periodAndStatus