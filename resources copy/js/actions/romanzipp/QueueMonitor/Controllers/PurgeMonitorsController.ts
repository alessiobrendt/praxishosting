import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \romanzipp\QueueMonitor\Controllers\PurgeMonitorsController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/PurgeMonitorsController.php:11
 * @route '/jobs/purge'
 */
const PurgeMonitorsController = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: PurgeMonitorsController.url(options),
    method: 'delete',
})

PurgeMonitorsController.definition = {
    methods: ["delete"],
    url: '/jobs/purge',
} satisfies RouteDefinition<["delete"]>

/**
* @see \romanzipp\QueueMonitor\Controllers\PurgeMonitorsController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/PurgeMonitorsController.php:11
 * @route '/jobs/purge'
 */
PurgeMonitorsController.url = (options?: RouteQueryOptions) => {
    return PurgeMonitorsController.definition.url + queryParams(options)
}

/**
* @see \romanzipp\QueueMonitor\Controllers\PurgeMonitorsController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/PurgeMonitorsController.php:11
 * @route '/jobs/purge'
 */
PurgeMonitorsController.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: PurgeMonitorsController.url(options),
    method: 'delete',
})

    /**
* @see \romanzipp\QueueMonitor\Controllers\PurgeMonitorsController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/PurgeMonitorsController.php:11
 * @route '/jobs/purge'
 */
    const PurgeMonitorsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: PurgeMonitorsController.url({
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
        PurgeMonitorsControllerForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: PurgeMonitorsController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    PurgeMonitorsController.form = PurgeMonitorsControllerForm
export default PurgeMonitorsController