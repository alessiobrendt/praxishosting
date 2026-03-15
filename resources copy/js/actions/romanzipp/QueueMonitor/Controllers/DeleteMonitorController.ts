import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \romanzipp\QueueMonitor\Controllers\DeleteMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/DeleteMonitorController.php:11
 * @route '/jobs/monitors/{monitor}'
 */
const DeleteMonitorController = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeleteMonitorController.url(args, options),
    method: 'delete',
})

DeleteMonitorController.definition = {
    methods: ["delete"],
    url: '/jobs/monitors/{monitor}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \romanzipp\QueueMonitor\Controllers\DeleteMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/DeleteMonitorController.php:11
 * @route '/jobs/monitors/{monitor}'
 */
DeleteMonitorController.url = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return DeleteMonitorController.definition.url
            .replace('{monitor}', parsedArgs.monitor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \romanzipp\QueueMonitor\Controllers\DeleteMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/DeleteMonitorController.php:11
 * @route '/jobs/monitors/{monitor}'
 */
DeleteMonitorController.delete = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DeleteMonitorController.url(args, options),
    method: 'delete',
})

    /**
* @see \romanzipp\QueueMonitor\Controllers\DeleteMonitorController::__invoke
 * @see vendor/romanzipp/laravel-queue-monitor/src/Controllers/DeleteMonitorController.php:11
 * @route '/jobs/monitors/{monitor}'
 */
    const DeleteMonitorControllerForm = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: DeleteMonitorController.url(args, {
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
        DeleteMonitorControllerForm.delete = (args: { monitor: string | number } | [monitor: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: DeleteMonitorController.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    DeleteMonitorController.form = DeleteMonitorControllerForm
export default DeleteMonitorController