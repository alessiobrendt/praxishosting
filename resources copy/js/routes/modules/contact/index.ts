import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ModuleController::submissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
export const submissions = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: submissions.url(args, options),
    method: 'get',
})

submissions.definition = {
    methods: ["get","head"],
    url: '/modules/contact/sites/{site}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuleController::submissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
submissions.url = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return submissions.definition.url
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleController::submissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
submissions.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: submissions.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuleController::submissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
submissions.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: submissions.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuleController::submissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
    const submissionsForm = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: submissions.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuleController::submissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
        submissionsForm.get = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: submissions.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuleController::submissions
 * @see app/Http/Controllers/ModuleController.php:119
 * @route '/modules/contact/sites/{site}'
 */
        submissionsForm.head = (args: { site: string | { uuid: string } } | [site: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: submissions.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    submissions.form = submissionsForm
/**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/modules/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuleController::index
 * @see app/Http/Controllers/ModuleController.php:45
 * @route '/modules/contact'
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
const contact = {
    submissions: Object.assign(submissions, submissions),
index: Object.assign(index, index),
}

export default contact