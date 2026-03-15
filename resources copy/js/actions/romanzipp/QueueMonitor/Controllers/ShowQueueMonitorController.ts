import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
const ShowQueueMonitorController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ShowQueueMonitorController.url(options),
    method: 'get',
})

ShowQueueMonitorController.definition = {
    methods: ["get","head"],
    url: '/jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
ShowQueueMonitorController.url = (options?: RouteQueryOptions) => {
    return ShowQueueMonitorController.definition.url + queryParams(options)
}

/**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
ShowQueueMonitorController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ShowQueueMonitorController.url(options),
    method: 'get',
})
/**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
ShowQueueMonitorController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ShowQueueMonitorController.url(options),
    method: 'head',
})

    /**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
    const ShowQueueMonitorControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ShowQueueMonitorController.url(options),
        method: 'get',
    })

            /**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
        ShowQueueMonitorControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ShowQueueMonitorController.url(options),
            method: 'get',
        })
            /**
* @see \romanzipp\QueueMonitor\Controllers\ShowQueueMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/ShowQueueMonitorController.php:23
 * @route '/jobs'
 */
        ShowQueueMonitorControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ShowQueueMonitorController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ShowQueueMonitorController.form = ShowQueueMonitorControllerForm
export default ShowQueueMonitorController