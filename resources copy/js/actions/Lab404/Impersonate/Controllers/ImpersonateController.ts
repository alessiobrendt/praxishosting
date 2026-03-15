import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../../wayfinder'
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
/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::take
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
export const take = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})

take.definition = {
    methods: ["get","head"],
    url: '/admin/impersonate/take/{id}/{guardName?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::take
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
take.url = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                    guardName: args[1],
                }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
            "guardName",
        ])

    const parsedArgs = {
                        id: args.id,
                                guardName: args.guardName,
                }

    return take.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{guardName?}', parsedArgs.guardName?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::take
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
take.get = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: take.url(args, options),
    method: 'get',
})
/**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::take
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
take.head = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: take.url(args, options),
    method: 'head',
})

    /**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::take
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
    const takeForm = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: take.url(args, options),
        method: 'get',
    })

            /**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::take
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
        takeForm.get = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, options),
            method: 'get',
        })
            /**
* @see \Lab404\Impersonate\Controllers\ImpersonateController::take
 * @see vendor/lab404/laravel-impersonate/src/Controllers/ImpersonateController.php:32
 * @route '/admin/impersonate/take/{id}/{guardName?}'
 */
        takeForm.head = (args: { id: string | number, guardName?: string | number } | [id: string | number, guardName: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: take.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    take.form = takeForm
const ImpersonateController = { leave, take }

export default ImpersonateController