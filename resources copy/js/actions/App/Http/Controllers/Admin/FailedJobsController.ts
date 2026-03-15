import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\FailedJobsController::index
 * @see app/Http/Controllers/Admin/FailedJobsController.php:16
 * @route '/admin/failed-jobs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/failed-jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FailedJobsController::index
 * @see app/Http/Controllers/Admin/FailedJobsController.php:16
 * @route '/admin/failed-jobs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FailedJobsController::index
 * @see app/Http/Controllers/Admin/FailedJobsController.php:16
 * @route '/admin/failed-jobs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\FailedJobsController::index
 * @see app/Http/Controllers/Admin/FailedJobsController.php:16
 * @route '/admin/failed-jobs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\FailedJobsController::index
 * @see app/Http/Controllers/Admin/FailedJobsController.php:16
 * @route '/admin/failed-jobs'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\FailedJobsController::index
 * @see app/Http/Controllers/Admin/FailedJobsController.php:16
 * @route '/admin/failed-jobs'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\FailedJobsController::index
 * @see app/Http/Controllers/Admin/FailedJobsController.php:16
 * @route '/admin/failed-jobs'
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
* @see \App\Http\Controllers\Admin\FailedJobsController::retryAll
 * @see app/Http/Controllers/Admin/FailedJobsController.php:49
 * @route '/admin/failed-jobs/retry-all'
 */
export const retryAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryAll.url(options),
    method: 'post',
})

retryAll.definition = {
    methods: ["post"],
    url: '/admin/failed-jobs/retry-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\FailedJobsController::retryAll
 * @see app/Http/Controllers/Admin/FailedJobsController.php:49
 * @route '/admin/failed-jobs/retry-all'
 */
retryAll.url = (options?: RouteQueryOptions) => {
    return retryAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FailedJobsController::retryAll
 * @see app/Http/Controllers/Admin/FailedJobsController.php:49
 * @route '/admin/failed-jobs/retry-all'
 */
retryAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryAll.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\FailedJobsController::retryAll
 * @see app/Http/Controllers/Admin/FailedJobsController.php:49
 * @route '/admin/failed-jobs/retry-all'
 */
    const retryAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retryAll.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\FailedJobsController::retryAll
 * @see app/Http/Controllers/Admin/FailedJobsController.php:49
 * @route '/admin/failed-jobs/retry-all'
 */
        retryAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retryAll.url(options),
            method: 'post',
        })
    
    retryAll.form = retryAllForm
/**
* @see \App\Http\Controllers\Admin\FailedJobsController::flush
 * @see app/Http/Controllers/Admin/FailedJobsController.php:65
 * @route '/admin/failed-jobs/flush'
 */
export const flush = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flush.url(options),
    method: 'post',
})

flush.definition = {
    methods: ["post"],
    url: '/admin/failed-jobs/flush',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\FailedJobsController::flush
 * @see app/Http/Controllers/Admin/FailedJobsController.php:65
 * @route '/admin/failed-jobs/flush'
 */
flush.url = (options?: RouteQueryOptions) => {
    return flush.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FailedJobsController::flush
 * @see app/Http/Controllers/Admin/FailedJobsController.php:65
 * @route '/admin/failed-jobs/flush'
 */
flush.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flush.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\FailedJobsController::flush
 * @see app/Http/Controllers/Admin/FailedJobsController.php:65
 * @route '/admin/failed-jobs/flush'
 */
    const flushForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: flush.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\FailedJobsController::flush
 * @see app/Http/Controllers/Admin/FailedJobsController.php:65
 * @route '/admin/failed-jobs/flush'
 */
        flushForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: flush.url(options),
            method: 'post',
        })
    
    flush.form = flushForm
/**
* @see \App\Http\Controllers\Admin\FailedJobsController::retry
 * @see app/Http/Controllers/Admin/FailedJobsController.php:41
 * @route '/admin/failed-jobs/{id}/retry'
 */
export const retry = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/admin/failed-jobs/{id}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\FailedJobsController::retry
 * @see app/Http/Controllers/Admin/FailedJobsController.php:41
 * @route '/admin/failed-jobs/{id}/retry'
 */
retry.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return retry.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FailedJobsController::retry
 * @see app/Http/Controllers/Admin/FailedJobsController.php:41
 * @route '/admin/failed-jobs/{id}/retry'
 */
retry.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\FailedJobsController::retry
 * @see app/Http/Controllers/Admin/FailedJobsController.php:41
 * @route '/admin/failed-jobs/{id}/retry'
 */
    const retryForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retry.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\FailedJobsController::retry
 * @see app/Http/Controllers/Admin/FailedJobsController.php:41
 * @route '/admin/failed-jobs/{id}/retry'
 */
        retryForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retry.url(args, options),
            method: 'post',
        })
    
    retry.form = retryForm
/**
* @see \App\Http\Controllers\Admin\FailedJobsController::destroy
 * @see app/Http/Controllers/Admin/FailedJobsController.php:57
 * @route '/admin/failed-jobs/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/failed-jobs/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\FailedJobsController::destroy
 * @see app/Http/Controllers/Admin/FailedJobsController.php:57
 * @route '/admin/failed-jobs/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FailedJobsController::destroy
 * @see app/Http/Controllers/Admin/FailedJobsController.php:57
 * @route '/admin/failed-jobs/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\FailedJobsController::destroy
 * @see app/Http/Controllers/Admin/FailedJobsController.php:57
 * @route '/admin/failed-jobs/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\FailedJobsController::destroy
 * @see app/Http/Controllers/Admin/FailedJobsController.php:57
 * @route '/admin/failed-jobs/{id}'
 */
        destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const FailedJobsController = { index, retryAll, flush, retry, destroy }

export default FailedJobsController