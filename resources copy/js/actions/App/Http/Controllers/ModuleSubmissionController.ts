import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ModuleSubmissionController::submit
 * @see app/Http/Controllers/ModuleSubmissionController.php:16
 * @route '/api/sites/{site}/modules/submit'
 */
export const submit = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/api/sites/{site}/modules/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuleSubmissionController::submit
 * @see app/Http/Controllers/ModuleSubmissionController.php:16
 * @route '/api/sites/{site}/modules/submit'
 */
submit.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return submit.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleSubmissionController::submit
 * @see app/Http/Controllers/ModuleSubmissionController.php:16
 * @route '/api/sites/{site}/modules/submit'
 */
submit.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuleSubmissionController::submit
 * @see app/Http/Controllers/ModuleSubmissionController.php:16
 * @route '/api/sites/{site}/modules/submit'
 */
    const submitForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuleSubmissionController::submit
 * @see app/Http/Controllers/ModuleSubmissionController.php:16
 * @route '/api/sites/{site}/modules/submit'
 */
        submitForm.post = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submit.url(args, options),
            method: 'post',
        })
    
    submit.form = submitForm
/**
* @see \App\Http\Controllers\ModuleSubmissionController::newsletterStatus
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
export const newsletterStatus = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newsletterStatus.url(args, options),
    method: 'get',
})

newsletterStatus.definition = {
    methods: ["get","head"],
    url: '/api/sites/{site}/modules/newsletter/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuleSubmissionController::newsletterStatus
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
newsletterStatus.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return newsletterStatus.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleSubmissionController::newsletterStatus
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
newsletterStatus.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newsletterStatus.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuleSubmissionController::newsletterStatus
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
newsletterStatus.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newsletterStatus.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuleSubmissionController::newsletterStatus
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
    const newsletterStatusForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newsletterStatus.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuleSubmissionController::newsletterStatus
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
        newsletterStatusForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newsletterStatus.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuleSubmissionController::newsletterStatus
 * @see app/Http/Controllers/ModuleSubmissionController.php:42
 * @route '/api/sites/{site}/modules/newsletter/status'
 */
        newsletterStatusForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newsletterStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    newsletterStatus.form = newsletterStatusForm
const ModuleSubmissionController = { submit, newsletterStatus }

export default ModuleSubmissionController