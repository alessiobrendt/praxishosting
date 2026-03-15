import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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
/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::storePin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:40
 * @route '/settings/security/pin'
 */
export const storePin = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePin.url(options),
    method: 'post',
})

storePin.definition = {
    methods: ["post"],
    url: '/settings/security/pin',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::storePin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:40
 * @route '/settings/security/pin'
 */
storePin.url = (options?: RouteQueryOptions) => {
    return storePin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::storePin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:40
 * @route '/settings/security/pin'
 */
storePin.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePin.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::storePin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:40
 * @route '/settings/security/pin'
 */
    const storePinForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePin.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::storePin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:40
 * @route '/settings/security/pin'
 */
        storePinForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePin.url(options),
            method: 'post',
        })
    
    storePin.form = storePinForm
/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::updatePin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:56
 * @route '/settings/security/pin'
 */
export const updatePin = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePin.url(options),
    method: 'put',
})

updatePin.definition = {
    methods: ["put"],
    url: '/settings/security/pin',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::updatePin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:56
 * @route '/settings/security/pin'
 */
updatePin.url = (options?: RouteQueryOptions) => {
    return updatePin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::updatePin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:56
 * @route '/settings/security/pin'
 */
updatePin.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePin.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::updatePin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:56
 * @route '/settings/security/pin'
 */
    const updatePinForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePin.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::updatePin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:56
 * @route '/settings/security/pin'
 */
        updatePinForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePin.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePin.form = updatePinForm
/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::destroyPin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:72
 * @route '/settings/security/pin'
 */
export const destroyPin = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPin.url(options),
    method: 'delete',
})

destroyPin.definition = {
    methods: ["delete"],
    url: '/settings/security/pin',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::destroyPin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:72
 * @route '/settings/security/pin'
 */
destroyPin.url = (options?: RouteQueryOptions) => {
    return destroyPin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::destroyPin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:72
 * @route '/settings/security/pin'
 */
destroyPin.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPin.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::destroyPin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:72
 * @route '/settings/security/pin'
 */
    const destroyPinForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyPin.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SecuritySettingsController::destroyPin
 * @see app/Http/Controllers/Settings/SecuritySettingsController.php:72
 * @route '/settings/security/pin'
 */
        destroyPinForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyPin.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyPin.form = destroyPinForm
const SecuritySettingsController = { show, update, storePin, updatePin, destroyPin }

export default SecuritySettingsController