import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DomainShopController::store
 * @see app/Http/Controllers/DomainShopController.php:130
 * @route '/domains/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/domains/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DomainShopController::store
 * @see app/Http/Controllers/DomainShopController.php:130
 * @route '/domains/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::store
 * @see app/Http/Controllers/DomainShopController.php:130
 * @route '/domains/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DomainShopController::store
 * @see app/Http/Controllers/DomainShopController.php:130
 * @route '/domains/checkout'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::store
 * @see app/Http/Controllers/DomainShopController.php:130
 * @route '/domains/checkout'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DomainShopController::redirect
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/domains/checkout/redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainShopController::redirect
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::redirect
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainShopController::redirect
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainShopController::redirect
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
    const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirect.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::redirect
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
        redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainShopController::redirect
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
        redirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirect.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirect.form = redirectForm
/**
* @see \App\Http\Controllers\DomainShopController::devComplete
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
export const devComplete = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devComplete.url(options),
    method: 'get',
})

devComplete.definition = {
    methods: ["get","head"],
    url: '/domains/checkout/dev-complete',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainShopController::devComplete
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
devComplete.url = (options?: RouteQueryOptions) => {
    return devComplete.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::devComplete
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
devComplete.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devComplete.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainShopController::devComplete
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
devComplete.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: devComplete.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainShopController::devComplete
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
    const devCompleteForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: devComplete.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::devComplete
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
        devCompleteForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: devComplete.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainShopController::devComplete
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
        devCompleteForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: devComplete.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    devComplete.form = devCompleteForm
/**
* @see \App\Http\Controllers\DomainShopController::success
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
export const success = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(options),
    method: 'get',
})

success.definition = {
    methods: ["get","head"],
    url: '/domains/checkout/success',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainShopController::success
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
success.url = (options?: RouteQueryOptions) => {
    return success.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::success
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
success.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainShopController::success
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
success.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: success.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainShopController::success
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
    const successForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: success.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::success
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
        successForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: success.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainShopController::success
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
        successForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: success.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    success.form = successForm
const checkout = {
    store: Object.assign(store, store),
redirect: Object.assign(redirect, redirect),
devComplete: Object.assign(devComplete, devComplete),
success: Object.assign(success, success),
}

export default checkout