import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DomainShopController::index
 * @see app/Http/Controllers/DomainShopController.php:34
 * @route '/domains'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/domains',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainShopController::index
 * @see app/Http/Controllers/DomainShopController.php:34
 * @route '/domains'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::index
 * @see app/Http/Controllers/DomainShopController.php:34
 * @route '/domains'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainShopController::index
 * @see app/Http/Controllers/DomainShopController.php:34
 * @route '/domains'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainShopController::index
 * @see app/Http/Controllers/DomainShopController.php:34
 * @route '/domains'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::index
 * @see app/Http/Controllers/DomainShopController.php:34
 * @route '/domains'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainShopController::index
 * @see app/Http/Controllers/DomainShopController.php:34
 * @route '/domains'
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
* @see \App\Http\Controllers\DomainShopController::search
 * @see app/Http/Controllers/DomainShopController.php:51
 * @route '/domains/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/domains/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainShopController::search
 * @see app/Http/Controllers/DomainShopController.php:51
 * @route '/domains/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::search
 * @see app/Http/Controllers/DomainShopController.php:51
 * @route '/domains/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainShopController::search
 * @see app/Http/Controllers/DomainShopController.php:51
 * @route '/domains/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainShopController::search
 * @see app/Http/Controllers/DomainShopController.php:51
 * @route '/domains/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::search
 * @see app/Http/Controllers/DomainShopController.php:51
 * @route '/domains/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainShopController::search
 * @see app/Http/Controllers/DomainShopController.php:51
 * @route '/domains/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
/**
* @see \App\Http\Controllers\DomainShopController::checkAvailability
 * @see app/Http/Controllers/DomainShopController.php:58
 * @route '/domains/check-availability'
 */
export const checkAvailability = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkAvailability.url(options),
    method: 'post',
})

checkAvailability.definition = {
    methods: ["post"],
    url: '/domains/check-availability',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DomainShopController::checkAvailability
 * @see app/Http/Controllers/DomainShopController.php:58
 * @route '/domains/check-availability'
 */
checkAvailability.url = (options?: RouteQueryOptions) => {
    return checkAvailability.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::checkAvailability
 * @see app/Http/Controllers/DomainShopController.php:58
 * @route '/domains/check-availability'
 */
checkAvailability.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkAvailability.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DomainShopController::checkAvailability
 * @see app/Http/Controllers/DomainShopController.php:58
 * @route '/domains/check-availability'
 */
    const checkAvailabilityForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkAvailability.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::checkAvailability
 * @see app/Http/Controllers/DomainShopController.php:58
 * @route '/domains/check-availability'
 */
        checkAvailabilityForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkAvailability.url(options),
            method: 'post',
        })
    
    checkAvailability.form = checkAvailabilityForm
/**
* @see \App\Http\Controllers\DomainShopController::checkout
 * @see app/Http/Controllers/DomainShopController.php:95
 * @route '/domains/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})

checkout.definition = {
    methods: ["get","head"],
    url: '/domains/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainShopController::checkout
 * @see app/Http/Controllers/DomainShopController.php:95
 * @route '/domains/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::checkout
 * @see app/Http/Controllers/DomainShopController.php:95
 * @route '/domains/checkout'
 */
checkout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainShopController::checkout
 * @see app/Http/Controllers/DomainShopController.php:95
 * @route '/domains/checkout'
 */
checkout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkout.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainShopController::checkout
 * @see app/Http/Controllers/DomainShopController.php:95
 * @route '/domains/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkout.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::checkout
 * @see app/Http/Controllers/DomainShopController.php:95
 * @route '/domains/checkout'
 */
        checkoutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainShopController::checkout
 * @see app/Http/Controllers/DomainShopController.php:95
 * @route '/domains/checkout'
 */
        checkoutForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkout.form = checkoutForm
/**
* @see \App\Http\Controllers\DomainShopController::storeCheckout
 * @see app/Http/Controllers/DomainShopController.php:130
 * @route '/domains/checkout'
 */
export const storeCheckout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCheckout.url(options),
    method: 'post',
})

storeCheckout.definition = {
    methods: ["post"],
    url: '/domains/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DomainShopController::storeCheckout
 * @see app/Http/Controllers/DomainShopController.php:130
 * @route '/domains/checkout'
 */
storeCheckout.url = (options?: RouteQueryOptions) => {
    return storeCheckout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::storeCheckout
 * @see app/Http/Controllers/DomainShopController.php:130
 * @route '/domains/checkout'
 */
storeCheckout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCheckout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DomainShopController::storeCheckout
 * @see app/Http/Controllers/DomainShopController.php:130
 * @route '/domains/checkout'
 */
    const storeCheckoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCheckout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::storeCheckout
 * @see app/Http/Controllers/DomainShopController.php:130
 * @route '/domains/checkout'
 */
        storeCheckoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCheckout.url(options),
            method: 'post',
        })
    
    storeCheckout.form = storeCheckoutForm
/**
* @see \App\Http\Controllers\DomainShopController::redirectToStripe
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
export const redirectToStripe = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToStripe.url(options),
    method: 'get',
})

redirectToStripe.definition = {
    methods: ["get","head"],
    url: '/domains/checkout/redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainShopController::redirectToStripe
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
redirectToStripe.url = (options?: RouteQueryOptions) => {
    return redirectToStripe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::redirectToStripe
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
redirectToStripe.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToStripe.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainShopController::redirectToStripe
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
redirectToStripe.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToStripe.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainShopController::redirectToStripe
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
    const redirectToStripeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redirectToStripe.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::redirectToStripe
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
        redirectToStripeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirectToStripe.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainShopController::redirectToStripe
 * @see app/Http/Controllers/DomainShopController.php:294
 * @route '/domains/checkout/redirect'
 */
        redirectToStripeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redirectToStripe.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redirectToStripe.form = redirectToStripeForm
/**
* @see \App\Http\Controllers\DomainShopController::devCompleteCheckout
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
export const devCompleteCheckout = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devCompleteCheckout.url(options),
    method: 'get',
})

devCompleteCheckout.definition = {
    methods: ["get","head"],
    url: '/domains/checkout/dev-complete',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainShopController::devCompleteCheckout
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
devCompleteCheckout.url = (options?: RouteQueryOptions) => {
    return devCompleteCheckout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::devCompleteCheckout
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
devCompleteCheckout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devCompleteCheckout.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainShopController::devCompleteCheckout
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
devCompleteCheckout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: devCompleteCheckout.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainShopController::devCompleteCheckout
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
    const devCompleteCheckoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: devCompleteCheckout.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::devCompleteCheckout
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
        devCompleteCheckoutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: devCompleteCheckout.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainShopController::devCompleteCheckout
 * @see app/Http/Controllers/DomainShopController.php:302
 * @route '/domains/checkout/dev-complete'
 */
        devCompleteCheckoutForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: devCompleteCheckout.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    devCompleteCheckout.form = devCompleteCheckoutForm
/**
* @see \App\Http\Controllers\DomainShopController::checkoutSuccess
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
export const checkoutSuccess = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkoutSuccess.url(options),
    method: 'get',
})

checkoutSuccess.definition = {
    methods: ["get","head"],
    url: '/domains/checkout/success',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DomainShopController::checkoutSuccess
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
checkoutSuccess.url = (options?: RouteQueryOptions) => {
    return checkoutSuccess.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DomainShopController::checkoutSuccess
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
checkoutSuccess.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkoutSuccess.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DomainShopController::checkoutSuccess
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
checkoutSuccess.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkoutSuccess.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DomainShopController::checkoutSuccess
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
    const checkoutSuccessForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkoutSuccess.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DomainShopController::checkoutSuccess
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
        checkoutSuccessForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkoutSuccess.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DomainShopController::checkoutSuccess
 * @see app/Http/Controllers/DomainShopController.php:455
 * @route '/domains/checkout/success'
 */
        checkoutSuccessForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkoutSuccess.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkoutSuccess.form = checkoutSuccessForm
const DomainShopController = { index, search, checkAvailability, checkout, storeCheckout, redirectToStripe, devCompleteCheckout, checkoutSuccess }

export default DomainShopController