import ApiTokenController from './ApiTokenController'
import ProfileController from './ProfileController'
import NotificationSettingsController from './NotificationSettingsController'
import IntegrationController from './IntegrationController'
import PasswordController from './PasswordController'
import TwoFactorAuthenticationController from './TwoFactorAuthenticationController'
import SecuritySettingsController from './SecuritySettingsController'
const Settings = {
    ApiTokenController: Object.assign(ApiTokenController, ApiTokenController),
ProfileController: Object.assign(ProfileController, ProfileController),
NotificationSettingsController: Object.assign(NotificationSettingsController, NotificationSettingsController),
IntegrationController: Object.assign(IntegrationController, IntegrationController),
PasswordController: Object.assign(PasswordController, PasswordController),
TwoFactorAuthenticationController: Object.assign(TwoFactorAuthenticationController, TwoFactorAuthenticationController),
SecuritySettingsController: Object.assign(SecuritySettingsController, SecuritySettingsController),
}

export default Settings