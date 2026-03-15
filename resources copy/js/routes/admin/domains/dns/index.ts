import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::update
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:260
 * @route '/admin/domains/{reseller_domain}/dns'
 */
export const update = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/domains/{reseller_domain}/dns',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::update
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:260
 * @route '/admin/domains/{reseller_domain}/dns'
 */
update.url = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reseller_domain: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { reseller_domain: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reseller_domain: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reseller_domain: typeof args.reseller_domain === 'object'
                ? args.reseller_domain.uuid
                : args.reseller_domain,
                }

    return update.definition.url
            .replace('{reseller_domain}', parsedArgs.reseller_domain.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ResellerDomainController::update
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:260
 * @route '/admin/domains/{reseller_domain}/dns'
 */
update.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::update
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:260
 * @route '/admin/domains/{reseller_domain}/dns'
 */
    const updateForm = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ResellerDomainController::update
 * @see app/Http/Controllers/Admin/ResellerDomainController.php:260
 * @route '/admin/domains/{reseller_domain}/dns'
 */
        updateForm.put = (args: { reseller_domain: string | { uuid: string } } | [reseller_domain: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const dns = {
    update: Object.assign(update, update),
}

export default dns