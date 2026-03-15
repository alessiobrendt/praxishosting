import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::store
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:40
 * @route '/settings/security/pin'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/security/pin',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::store
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:40
 * @route '/settings/security/pin'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::store
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:40
 * @route '/settings/security/pin'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::store
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:40
 * @route '/settings/security/pin'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::store
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:40
 * @route '/settings/security/pin'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::update
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:56
 * @route '/settings/security/pin'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/security/pin',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::update
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:56
 * @route '/settings/security/pin'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::update
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:56
 * @route '/settings/security/pin'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::update
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:56
 * @route '/settings/security/pin'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::update
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:56
 * @route '/settings/security/pin'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::destroy
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:72
 * @route '/settings/security/pin'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/security/pin',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::destroy
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:72
 * @route '/settings/security/pin'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::destroy
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:72
 * @route '/settings/security/pin'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::destroy
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:72
 * @route '/settings/security/pin'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::destroy
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:72
 * @route '/settings/security/pin'
 */
        destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const pin = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default pin