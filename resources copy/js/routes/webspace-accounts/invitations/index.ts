import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:277
 * @route '/webspace-accounts/{webspace_account}/invitations/{invitation}'
 */
export const destroy = (args: { webspace_account: string | { uuid: string }, invitation: number | { id: number } } | [webspace_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/webspace-accounts/{webspace_account}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:277
 * @route '/webspace-accounts/{webspace_account}/invitations/{invitation}'
 */
destroy.url = (args: { webspace_account: string | { uuid: string }, invitation: number | { id: number } } | [webspace_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: typeof args.webspace_account === 'object'
                ? args.webspace_account.uuid
                : args.webspace_account,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroy.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:277
 * @route '/webspace-accounts/{webspace_account}/invitations/{invitation}'
 */
destroy.delete = (args: { webspace_account: string | { uuid: string }, invitation: number | { id: number } } | [webspace_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:277
 * @route '/webspace-accounts/{webspace_account}/invitations/{invitation}'
 */
    const destroyForm = (args: { webspace_account: string | { uuid: string }, invitation: number | { id: number } } | [webspace_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductShareController::destroy
 * @see app/Http/Controllers/ProductShareController.php:277
 * @route '/webspace-accounts/{webspace_account}/invitations/{invitation}'
 */
        destroyForm.delete = (args: { webspace_account: string | { uuid: string }, invitation: number | { id: number } } | [webspace_account: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const invitations = {
    destroy: Object.assign(destroy, destroy),
}

export default invitations