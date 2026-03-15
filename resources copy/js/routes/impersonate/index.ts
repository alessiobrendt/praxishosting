import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::leave
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:67
 * @route '/impersonate/leave'
 */
export const leave = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leave.url(options),
    method: 'get',
})

leave.definition = {
    methods: ["get","head"],
    url: '/impersonate/leave',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::leave
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:67
 * @route '/impersonate/leave'
 */
leave.url = (options?: RouteQueryOptions) => {
    return leave.definition.url + queryParams(options)
}

/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::leave
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:67
 * @route '/impersonate/leave'
 */
leave.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leave.url(options),
    method: 'get',
})
/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::leave
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:67
 * @route '/impersonate/leave'
 */
leave.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leave.url(options),
    method: 'head',
})

    /**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::leave
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:67
 * @route '/impersonate/leave'
 */
    const leaveForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: leave.url(options),
        method: 'get',
    })

            /**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::leave
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:67
 * @route '/impersonate/leave'
 */
        leaveForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: leave.url(options),
            method: 'get',
        })
            /**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::leave
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:67
 * @route '/impersonate/leave'
 */
        leaveForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: leave.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    leave.form = leaveForm
const impersonate = {
    leave: Object.assign(leave, leave),
}

export default impersonate