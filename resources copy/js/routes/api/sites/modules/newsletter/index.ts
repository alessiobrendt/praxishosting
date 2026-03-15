import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\ModuleSubmissionController::status
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
export const status = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/sites/{site}/modules/newsletter/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuleSubmissionController::status
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
status.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return status.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleSubmissionController::status
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
status.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuleSubmissionController::status
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
status.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuleSubmissionController::status
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
    const statusForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuleSubmissionController::status
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
        statusForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuleSubmissionController::status
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
        statusForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    status.form = statusForm
const newsletter = {
    status: Object.assign(status, status),
}

export default newsletter