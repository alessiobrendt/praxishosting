import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import pin from './pin'
/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::show
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:20
 * @route '/settings/security'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/settings/security',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::show
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:20
 * @route '/settings/security'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::show
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:20
 * @route '/settings/security'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::show
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:20
 * @route '/settings/security'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::show
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:20
 * @route '/settings/security'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::show
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:20
 * @route '/settings/security'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::show
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:20
 * @route '/settings/security'
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
* @see \App\Http\Controllers\Settings\SecuritySettingsController::update
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:28
 * @route '/settings/security'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/security',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::update
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:28
 * @route '/settings/security'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::update
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:28
 * @route '/settings/security'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::update
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:28
 * @route '/settings/security'
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
* @see \App\Http\Controllers\Settings\SecuritySettingsController::update
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:28
 * @route '/settings/security'
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
const security = {
    show: Object.assign(show, show),
update: Object.assign(update, update),
pin: Object.assign(pin, pin),
}

export default security