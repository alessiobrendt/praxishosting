import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::show
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:18
 * @route '/settings/notifications'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/settings/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::show
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:18
 * @route '/settings/notifications'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::show
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:18
 * @route '/settings/notifications'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::show
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:18
 * @route '/settings/notifications'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::show
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:18
 * @route '/settings/notifications'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::show
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:18
 * @route '/settings/notifications'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::show
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:18
 * @route '/settings/notifications'
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
* @see \App\Http\Controllers\Settings\NotificationSettingsController::update
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:37
 * @route '/settings/notifications'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/notifications',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::update
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:37
 * @route '/settings/notifications'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::update
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:37
 * @route '/settings/notifications'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::update
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:37
 * @route '/settings/notifications'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\NotificationSettingsController::update
 * @see app/Http/Controllers/Settings/NotificationSettingsController.php:37
 * @route '/settings/notifications'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const NotificationSettingsController = { show, update }

export default NotificationSettingsController