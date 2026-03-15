import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:128
 * @route '/components'
 */
export const demo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: demo.url(options),
    method: 'get',
})

demo.definition = {
    methods: ["get","head"],
    url: '/components',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:128
 * @route '/components'
 */
demo.url = (options?: RouteQueryOptions) => {
    return demo.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:128
 * @route '/components'
 */
demo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: demo.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:128
 * @route '/components'
 */
demo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: demo.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:128
 * @route '/components'
 */
    const demoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: demo.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:128
 * @route '/components'
 */
        demoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: demo.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:128
 * @route '/components'
 */
        demoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: demo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    demo.form = demoForm
const components = {
    demo: Object.assign(demo, demo),
}

export default components