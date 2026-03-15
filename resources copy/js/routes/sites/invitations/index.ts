import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SiteCollaboratorController::destroy
 * @see app/Http/Controllers/SiteCollaboratorController.php:78
 * @route '/sites/{site}/invitations/{invitation}'
 */
export const destroy = (args: { site: string | { uuid: string }, invitation: number | { id: number } } | [site: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/sites/{site}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SiteCollaboratorController::destroy
 * @see app/Http/Controllers/SiteCollaboratorController.php:78
 * @route '/sites/{site}/invitations/{invitation}'
 */
destroy.url = (args: { site: string | { uuid: string }, invitation: number | { id: number } } | [site: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    site: args[0],
                    invitation: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        site: typeof args.site === 'object'
                ? args.site.uuid
                : args.site,
                                invitation: typeof args.invitation === 'object'
                ? args.invitation.id
                : args.invitation,
                }

    return destroy.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SiteCollaboratorController::destroy
 * @see app/Http/Controllers/SiteCollaboratorController.php:78
 * @route '/sites/{site}/invitations/{invitation}'
 */
destroy.delete = (args: { site: string | { uuid: string }, invitation: number | { id: number } } | [site: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\SiteCollaboratorController::destroy
 * @see app/Http/Controllers/SiteCollaboratorController.php:78
 * @route '/sites/{site}/invitations/{invitation}'
 */
    const destroyForm = (args: { site: string | { uuid: string }, invitation: number | { id: number } } | [site: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SiteCollaboratorController::destroy
 * @see app/Http/Controllers/SiteCollaboratorController.php:78
 * @route '/sites/{site}/invitations/{invitation}'
 */
        destroyForm.delete = (args: { site: string | { uuid: string }, invitation: number | { id: number } } | [site: string | { uuid: string }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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