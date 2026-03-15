import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::cancel
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:78
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
export const cancel = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::cancel
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:78
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
cancel.url = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { team_speak_server_account: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    team_speak_server_account: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        team_speak_server_account: args.team_speak_server_account,
                }

    return cancel.definition.url
            .replace('{team_speak_server_account}', parsedArgs.team_speak_server_account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::cancel
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:78
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
cancel.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::cancel
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:78
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
    const cancelForm = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\TeamSpeakAccountController::cancel
 * @see app/Http/Controllers/Admin/TeamSpeakAccountController.php:78
 * @route '/admin/teamspeak-accounts/{team_speak_server_account}/subscription/cancel'
 */
        cancelForm.post = (args: { team_speak_server_account: string | number } | [team_speak_server_account: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
const subscription = {
    cancel: Object.assign(cancel, cancel),
}

export default subscription