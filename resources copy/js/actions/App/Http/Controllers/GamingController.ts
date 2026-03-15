import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/gaming',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::index
 * @see app/Http/Controllers/GamingController.php:62
 * @route '/gaming'
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
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
export const pterodactylNests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pterodactylNests.url(options),
    method: 'get',
})

pterodactylNests.definition = {
    methods: ["get","head"],
    url: '/gaming/checkout/pterodactyl-nests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
pterodactylNests.url = (options?: RouteQueryOptions) => {
    return pterodactylNests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
pterodactylNests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pterodactylNests.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
pterodactylNests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pterodactylNests.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
    const pterodactylNestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pterodactylNests.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
        pterodactylNestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pterodactylNests.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::pterodactylNests
 * @see app/Http/Controllers/GamingController.php:136
 * @route '/gaming/checkout/pterodactyl-nests'
 */
        pterodactylNestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pterodactylNests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pterodactylNests.form = pterodactylNestsForm
/**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
export const pterodactylEggs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pterodactylEggs.url(options),
    method: 'get',
})

pterodactylEggs.definition = {
    methods: ["get","head"],
    url: '/gaming/checkout/pterodactyl-eggs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
pterodactylEggs.url = (options?: RouteQueryOptions) => {
    return pterodactylEggs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
pterodactylEggs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pterodactylEggs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
pterodactylEggs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pterodactylEggs.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
    const pterodactylEggsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pterodactylEggs.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
        pterodactylEggsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pterodactylEggs.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::pterodactylEggs
 * @see app/Http/Controllers/GamingController.php:188
 * @route '/gaming/checkout/pterodactyl-eggs'
 */
        pterodactylEggsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pterodactylEggs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pterodactylEggs.form = pterodactylEggsForm
/**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})

checkout.definition = {
    methods: ["get","head"],
    url: '/gaming/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
checkout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
checkout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkout.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkout.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
 */
        checkoutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::checkout
 * @see app/Http/Controllers/GamingController.php:88
 * @route '/gaming/checkout'
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
* @see \App\Http\Controllers\GamingController::storeCheckout
 * @see app/Http/Controllers/GamingController.php:241
 * @route '/gaming/checkout'
 */
export const storeCheckout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCheckout.url(options),
    method: 'post',
})

storeCheckout.definition = {
    methods: ["post"],
    url: '/gaming/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingController::storeCheckout
 * @see app/Http/Controllers/GamingController.php:241
 * @route '/gaming/checkout'
 */
storeCheckout.url = (options?: RouteQueryOptions) => {
    return storeCheckout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::storeCheckout
 * @see app/Http/Controllers/GamingController.php:241
 * @route '/gaming/checkout'
 */
storeCheckout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCheckout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingController::storeCheckout
 * @see app/Http/Controllers/GamingController.php:241
 * @route '/gaming/checkout'
 */
    const storeCheckoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCheckout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingController::storeCheckout
 * @see app/Http/Controllers/GamingController.php:241
 * @route '/gaming/checkout'
 */
        storeCheckoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCheckout.url(options),
            method: 'post',
        })
    
    storeCheckout.form = storeCheckoutForm
/**
* @see \App\Http\Controllers\GamingController::cloudIndex
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
export const cloudIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cloudIndex.url(options),
    method: 'get',
})

cloudIndex.definition = {
    methods: ["get","head"],
    url: '/gaming/cloud',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::cloudIndex
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
cloudIndex.url = (options?: RouteQueryOptions) => {
    return cloudIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::cloudIndex
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
cloudIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cloudIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::cloudIndex
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
cloudIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cloudIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::cloudIndex
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
    const cloudIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cloudIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::cloudIndex
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
        cloudIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cloudIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::cloudIndex
 * @see app/Http/Controllers/GamingController.php:353
 * @route '/gaming/cloud'
 */
        cloudIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cloudIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cloudIndex.form = cloudIndexForm
/**
* @see \App\Http\Controllers\GamingController::cloudCheckout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
export const cloudCheckout = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cloudCheckout.url(args, options),
    method: 'get',
})

cloudCheckout.definition = {
    methods: ["get","head"],
    url: '/gaming/cloud/checkout/{plan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\GamingController::cloudCheckout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
cloudCheckout.url = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        plan: args.plan,
                }

    return cloudCheckout.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::cloudCheckout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
cloudCheckout.get = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cloudCheckout.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\GamingController::cloudCheckout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
cloudCheckout.head = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cloudCheckout.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\GamingController::cloudCheckout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
    const cloudCheckoutForm = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cloudCheckout.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\GamingController::cloudCheckout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
        cloudCheckoutForm.get = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cloudCheckout.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\GamingController::cloudCheckout
 * @see app/Http/Controllers/GamingController.php:383
 * @route '/gaming/cloud/checkout/{plan}'
 */
        cloudCheckoutForm.head = (args: { plan: string | number } | [plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cloudCheckout.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cloudCheckout.form = cloudCheckoutForm
/**
* @see \App\Http\Controllers\GamingController::storeCloudCheckout
 * @see app/Http/Controllers/GamingController.php:445
 * @route '/gaming/cloud/checkout'
 */
export const storeCloudCheckout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCloudCheckout.url(options),
    method: 'post',
})

storeCloudCheckout.definition = {
    methods: ["post"],
    url: '/gaming/cloud/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\GamingController::storeCloudCheckout
 * @see app/Http/Controllers/GamingController.php:445
 * @route '/gaming/cloud/checkout'
 */
storeCloudCheckout.url = (options?: RouteQueryOptions) => {
    return storeCloudCheckout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\GamingController::storeCloudCheckout
 * @see app/Http/Controllers/GamingController.php:445
 * @route '/gaming/cloud/checkout'
 */
storeCloudCheckout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCloudCheckout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\GamingController::storeCloudCheckout
 * @see app/Http/Controllers/GamingController.php:445
 * @route '/gaming/cloud/checkout'
 */
    const storeCloudCheckoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeCloudCheckout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\GamingController::storeCloudCheckout
 * @see app/Http/Controllers/GamingController.php:445
 * @route '/gaming/cloud/checkout'
 */
        storeCloudCheckoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeCloudCheckout.url(options),
            method: 'post',
        })
    
    storeCloudCheckout.form = storeCloudCheckoutForm
const GamingController = { index, pterodactylNests, pterodactylEggs, checkout, storeCheckout, cloudIndex, cloudCheckout, storeCloudCheckout }

export default GamingController