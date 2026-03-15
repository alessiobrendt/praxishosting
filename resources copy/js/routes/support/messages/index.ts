import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:240
 * @route '/support/{ticket}/messages'
 */
export const store = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/support/{ticket}/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:240
 * @route '/support/{ticket}/messages'
 */
store.url = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { ticket: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.uuid
                : args.ticket,
                }

    return store.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:240
 * @route '/support/{ticket}/messages'
 */
store.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:240
 * @route '/support/{ticket}/messages'
 */
    const storeForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SupportController::store
 * @see app/Http/Controllers/SupportController.php:240
 * @route '/support/{ticket}/messages'
 */
        storeForm.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const messages = {
    store: Object.assign(store, store),
}

export default messages