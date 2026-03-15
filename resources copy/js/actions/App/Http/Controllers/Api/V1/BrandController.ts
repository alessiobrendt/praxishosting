import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\BrandController::show
 * @see app/Http/Controllers/Api/V1/BrandController.php:14
 * @route '/api/v1/brand'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/brand',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\BrandController::show
 * @see app/Http/Controllers/Api/V1/BrandController.php:14
 * @route '/api/v1/brand'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\BrandController::show
 * @see app/Http/Controllers/Api/V1/BrandController.php:14
 * @route '/api/v1/brand'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\BrandController::show
 * @see app/Http/Controllers/Api/V1/BrandController.php:14
 * @route '/api/v1/brand'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\BrandController::show
 * @see app/Http/Controllers/Api/V1/BrandController.php:14
 * @route '/api/v1/brand'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\BrandController::show
 * @see app/Http/Controllers/Api/V1/BrandController.php:14
 * @route '/api/v1/brand'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\BrandController::show
 * @see app/Http/Controllers/Api/V1/BrandController.php:14
 * @route '/api/v1/brand'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\V1\BrandController::features
 * @see app/Http/Controllers/Api/V1/BrandController.php:45
 * @route '/api/v1/brand/features'
 */
export const features = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: features.url(options),
    method: 'get',
})

features.definition = {
    methods: ["get","head"],
    url: '/api/v1/brand/features',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\BrandController::features
 * @see app/Http/Controllers/Api/V1/BrandController.php:45
 * @route '/api/v1/brand/features'
 */
features.url = (options?: RouteQueryOptions) => {
    return features.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\BrandController::features
 * @see app/Http/Controllers/Api/V1/BrandController.php:45
 * @route '/api/v1/brand/features'
 */
features.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: features.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\BrandController::features
 * @see app/Http/Controllers/Api/V1/BrandController.php:45
 * @route '/api/v1/brand/features'
 */
features.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: features.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\BrandController::features
 * @see app/Http/Controllers/Api/V1/BrandController.php:45
 * @route '/api/v1/brand/features'
 */
    const featuresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: features.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\BrandController::features
 * @see app/Http/Controllers/Api/V1/BrandController.php:45
 * @route '/api/v1/brand/features'
 */
        featuresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: features.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\BrandController::features
 * @see app/Http/Controllers/Api/V1/BrandController.php:45
 * @route '/api/v1/brand/features'
 */
        featuresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: features.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    features.form = featuresForm
/**
* @see \App\Http\Controllers\Api\V1\BrandController::contact
 * @see app/Http/Controllers/Api/V1/BrandController.php:58
 * @route '/api/v1/brand/contact'
 */
export const contact = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})

contact.definition = {
    methods: ["get","head"],
    url: '/api/v1/brand/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\BrandController::contact
 * @see app/Http/Controllers/Api/V1/BrandController.php:58
 * @route '/api/v1/brand/contact'
 */
contact.url = (options?: RouteQueryOptions) => {
    return contact.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\BrandController::contact
 * @see app/Http/Controllers/Api/V1/BrandController.php:58
 * @route '/api/v1/brand/contact'
 */
contact.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\BrandController::contact
 * @see app/Http/Controllers/Api/V1/BrandController.php:58
 * @route '/api/v1/brand/contact'
 */
contact.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contact.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\V1\BrandController::contact
 * @see app/Http/Controllers/Api/V1/BrandController.php:58
 * @route '/api/v1/brand/contact'
 */
    const contactForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contact.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\V1\BrandController::contact
 * @see app/Http/Controllers/Api/V1/BrandController.php:58
 * @route '/api/v1/brand/contact'
 */
        contactForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\V1\BrandController::contact
 * @see app/Http/Controllers/Api/V1/BrandController.php:58
 * @route '/api/v1/brand/contact'
 */
        contactForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contact.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contact.form = contactForm
const BrandController = { show, features, contact }

export default BrandController