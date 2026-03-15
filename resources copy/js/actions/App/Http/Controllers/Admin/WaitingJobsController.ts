import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\WaitingJobsController::index
 * @see app/Http/Controllers/Admin/WaitingJobsController.php:14
 * @route '/admin/waiting-jobs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/waiting-jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WaitingJobsController::index
 * @see app/Http/Controllers/Admin/WaitingJobsController.php:14
 * @route '/admin/waiting-jobs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WaitingJobsController::index
 * @see app/Http/Controllers/Admin/WaitingJobsController.php:14
 * @route '/admin/waiting-jobs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WaitingJobsController::index
 * @see app/Http/Controllers/Admin/WaitingJobsController.php:14
 * @route '/admin/waiting-jobs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WaitingJobsController::index
 * @see app/Http/Controllers/Admin/WaitingJobsController.php:14
 * @route '/admin/waiting-jobs'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WaitingJobsController::index
 * @see app/Http/Controllers/Admin/WaitingJobsController.php:14
 * @route '/admin/waiting-jobs'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WaitingJobsController::index
 * @see app/Http/Controllers/Admin/WaitingJobsController.php:14
 * @route '/admin/waiting-jobs'
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
const WaitingJobsController = { index }

export default WaitingJobsController