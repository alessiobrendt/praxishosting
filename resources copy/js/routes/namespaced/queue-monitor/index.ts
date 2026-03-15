import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
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
* @see \romanzipp\QueueMonitor\Controllers\DeleteMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/DeleteMonitorController.php:11
 * @route '/jobs/monitors/{monitor}'
 */
export const destroy = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/jobs/monitors/{monitor}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \romanzipp\QueueMonitor\Controllers\DeleteMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/DeleteMonitorController.php:11
 * @route '/jobs/monitors/{monitor}'
 */
destroy.url = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { monitor: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    monitor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        monitor: args.monitor,
                }

    return destroy.definition.url
            .replace('{monitor}', parsedArgs.monitor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \romanzipp\QueueMonitor\Controllers\DeleteMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/DeleteMonitorController.php:11
 * @route '/jobs/monitors/{monitor}'
 */
destroy.delete = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \romanzipp\QueueMonitor\Controllers\DeleteMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/DeleteMonitorController.php:11
 * @route '/jobs/monitors/{monitor}'
 */
    const destroyForm = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \romanzipp\QueueMonitor\Controllers\DeleteMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/DeleteMonitorController.php:11
 * @route '/jobs/monitors/{monitor}'
 */
        destroyForm.delete = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \romanzipp\QueueMonitor\Controllers\RetryMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/RetryMonitorController.php:13
 * @route '/jobs/monitors/retry/{monitor}'
 */
export const retry = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: retry.url(args, options),
    method: 'patch',
})

retry.definition = {
    methods: ["patch"],
    url: '/jobs/monitors/retry/{monitor}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \romanzipp\QueueMonitor\Controllers\RetryMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/RetryMonitorController.php:13
 * @route '/jobs/monitors/retry/{monitor}'
 */
retry.url = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { monitor: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    monitor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        monitor: args.monitor,
                }

    return retry.definition.url
            .replace('{monitor}', parsedArgs.monitor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \romanzipp\QueueMonitor\Controllers\RetryMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/RetryMonitorController.php:13
 * @route '/jobs/monitors/retry/{monitor}'
 */
retry.patch = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: retry.url(args, options),
    method: 'patch',
})

    /**
* @see \romanzipp\QueueMonitor\Controllers\RetryMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/RetryMonitorController.php:13
 * @route '/jobs/monitors/retry/{monitor}'
 */
    const retryForm = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retry.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \romanzipp\QueueMonitor\Controllers\RetryMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/RetryMonitorController.php:13
 * @route '/jobs/monitors/retry/{monitor}'
 */
        retryForm.patch = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retry.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    retry.form = retryForm
/**
* @see \romanzipp\QueueMonitor\Controllers\PurgeMonitorsController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/PurgeMonitorsController.php:11
 * @route '/jobs/purge'
 */
export const purge = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: purge.url(options),
    method: 'delete',
})

purge.definition = {
    methods: ["delete"],
    url: '/jobs/purge',
} satisfies RouteDefinition<["delete"]>

/**
* @see \romanzipp\QueueMonitor\Controllers\PurgeMonitorsController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/PurgeMonitorsController.php:11
 * @route '/jobs/purge'
 */
purge.url = (options?: RouteQueryOptions) => {
    return purge.definition.url + queryParams(options)
}

/**
* @see \romanzipp\QueueMonitor\Controllers\PurgeMonitorsController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/PurgeMonitorsController.php:11
 * @route '/jobs/purge'
 */
purge.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: purge.url(options),
    method: 'delete',
})

    /**
* @see \romanzipp\QueueMonitor\Controllers\PurgeMonitorsController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/PurgeMonitorsController.php:11
 * @route '/jobs/purge'
 */
    const purgeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: purge.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \romanzipp\QueueMonitor\Controllers\PurgeMonitorsController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/PurgeMonitorsController.php:11
 * @route '/jobs/purge'
 */
        purgeForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: purge.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    purge.form = purgeForm
const queueMonitor = {
    index: Object.assign(index, index),
destroy: Object.assign(destroy, destroy),
retry: Object.assign(retry, retry),
purge: Object.assign(purge, purge),
}

export default queueMonitor