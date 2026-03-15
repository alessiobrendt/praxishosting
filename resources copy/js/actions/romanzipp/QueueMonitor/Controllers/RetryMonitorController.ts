import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \romanzipp\QueueMonitor\Controllers\RetryMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/RetryMonitorController.php:13
 * @route '/jobs/monitors/retry/{monitor}'
 */
const RetryMonitorController = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RetryMonitorController.url(args, options),
    method: 'patch',
})

RetryMonitorController.definition = {
    methods: ["patch"],
    url: '/jobs/monitors/retry/{monitor}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \romanzipp\QueueMonitor\Controllers\RetryMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/RetryMonitorController.php:13
 * @route '/jobs/monitors/retry/{monitor}'
 */
RetryMonitorController.url = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return RetryMonitorController.definition.url
            .replace('{monitor}', parsedArgs.monitor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \romanzipp\QueueMonitor\Controllers\RetryMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/RetryMonitorController.php:13
 * @route '/jobs/monitors/retry/{monitor}'
 */
RetryMonitorController.patch = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RetryMonitorController.url(args, options),
    method: 'patch',
})

    /**
* @see \romanzipp\QueueMonitor\Controllers\RetryMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/RetryMonitorController.php:13
 * @route '/jobs/monitors/retry/{monitor}'
 */
    const RetryMonitorControllerForm = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: RetryMonitorController.url(args, {
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
        RetryMonitorControllerForm.patch = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RetryMonitorController.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    RetryMonitorController.form = RetryMonitorControllerForm
export default RetryMonitorController