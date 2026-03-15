import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::cancel
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:107
 * @route '/admin/webspace-accounts/{webspace_account}/subscription/cancel'
 */
export const cancel = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/webspace-accounts/{webspace_account}/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::cancel
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:107
 * @route '/admin/webspace-accounts/{webspace_account}/subscription/cancel'
 */
cancel.url = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webspace_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    webspace_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webspace_account: args.webspace_account,
                }

    return cancel.definition.url
            .replace('{webspace_account}', parsedArgs.webspace_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::cancel
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:107
 * @route '/admin/webspace-accounts/{webspace_account}/subscription/cancel'
 */
cancel.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::cancel
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:107
 * @route '/admin/webspace-accounts/{webspace_account}/subscription/cancel'
 */
    const cancelForm = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\WebspaceAccountController::cancel
 * @see app/Http/Controllers/Admin/WebspaceAccountController.php:107
 * @route '/admin/webspace-accounts/{webspace_account}/subscription/cancel'
 */
        cancelForm.post = (args: { webspace_account: string | number } | [webspace_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
const subscription = {
    cancel: Object.assign(cancel, cancel),
}

export default subscription