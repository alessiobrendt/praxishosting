import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import checkoutFb28ab from './checkout'
import manage from './manage'
import shares from './shares'
import invitations from './invitations'
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
const domains = {
    index: Object.assign(index, index),
search: Object.assign(search, search),
checkAvailability: Object.assign(checkAvailability, checkAvailability),
checkout: Object.assign(checkout, checkoutFb28ab),
manage: Object.assign(manage, manage),
shares: Object.assign(shares, shares),
invitations: Object.assign(invitations, invitations),
}

export default domains