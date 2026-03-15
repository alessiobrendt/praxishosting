import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import aiTokens from './ai-tokens'
import balance from './balance'
import redeemVoucher9bbaff from './redeem-voucher'
/**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BillingController::index
 * @see app/Http/Controllers/BillingController.php:23
 * @route '/billing'
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
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
export const subscriptions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subscriptions.url(options),
    method: 'get',
})

subscriptions.definition = {
    methods: ["get","head"],
    url: '/billing/subscriptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
subscriptions.url = (options?: RouteQueryOptions) => {
    return subscriptions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
subscriptions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subscriptions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
subscriptions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: subscriptions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
    const subscriptionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: subscriptions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
        subscriptionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subscriptions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BillingController::subscriptions
 * @see app/Http/Controllers/BillingController.php:105
 * @route '/billing/subscriptions'
 */
        subscriptionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: subscriptions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    subscriptions.form = subscriptionsForm
/**
* @see \App\Http\Controllers\BillingPortalController::portal
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
export const portal = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: portal.url(options),
    method: 'get',
})

portal.definition = {
    methods: ["get","head"],
    url: '/billing/portal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BillingPortalController::portal
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
portal.url = (options?: RouteQueryOptions) => {
    return portal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BillingPortalController::portal
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
portal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: portal.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BillingPortalController::portal
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
portal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: portal.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BillingPortalController::portal
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
    const portalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: portal.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BillingPortalController::portal
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
        portalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: portal.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BillingPortalController::portal
 * @see app/Http/Controllers/BillingPortalController.php:14
 * @route '/billing/portal'
 */
        portalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: portal.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    portal.form = portalForm
/**
* @see \App\Http\Controllers\RedeemVoucherController::redeemVoucher
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
export const redeemVoucher = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redeemVoucher.url(options),
    method: 'get',
})

redeemVoucher.definition = {
    methods: ["get","head"],
    url: '/billing/redeem-voucher',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RedeemVoucherController::redeemVoucher
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
redeemVoucher.url = (options?: RouteQueryOptions) => {
    return redeemVoucher.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RedeemVoucherController::redeemVoucher
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
redeemVoucher.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redeemVoucher.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RedeemVoucherController::redeemVoucher
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
redeemVoucher.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redeemVoucher.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RedeemVoucherController::redeemVoucher
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
    const redeemVoucherForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: redeemVoucher.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RedeemVoucherController::redeemVoucher
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
        redeemVoucherForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redeemVoucher.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RedeemVoucherController::redeemVoucher
 * @see app/Http/Controllers/RedeemVoucherController.php:16
 * @route '/billing/redeem-voucher'
 */
        redeemVoucherForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: redeemVoucher.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    redeemVoucher.form = redeemVoucherForm
const billing = {
    index: Object.assign(index, index),
subscriptions: Object.assign(subscriptions, subscriptions),
portal: Object.assign(portal, portal),
aiTokens: Object.assign(aiTokens, aiTokens),
balance: Object.assign(balance, balance),
redeemVoucher: Object.assign(redeemVoucher, redeemVoucher9bbaff),
}

export default billing