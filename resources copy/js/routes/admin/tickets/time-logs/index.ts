import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TicketController::store
 * @see app/Http/Controllers/Admin/TicketController.php:327
 * @route '/admin/tickets/{ticket}/time-logs'
 */
export const store = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/tickets/{ticket}/time-logs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TicketController::store
 * @see app/Http/Controllers/Admin/TicketController.php:327
 * @route '/admin/tickets/{ticket}/time-logs'
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
* @see \App\Http\Controllers\Admin\TicketController::store
 * @see app/Http/Controllers/Admin/TicketController.php:327
 * @route '/admin/tickets/{ticket}/time-logs'
 */
store.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TicketController::store
 * @see app/Http/Controllers/Admin/TicketController.php:327
 * @route '/admin/tickets/{ticket}/time-logs'
 */
    const storeForm = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TicketController::store
 * @see app/Http/Controllers/Admin/TicketController.php:327
 * @route '/admin/tickets/{ticket}/time-logs'
 */
        storeForm.post = (args: { ticket: string | { uuid: string } } | [ticket: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const timeLogs = {
    store: Object.assign(store, store),
}

export default timeLogs