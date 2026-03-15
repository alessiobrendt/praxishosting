import AftercareWebhookController from './AftercareWebhookController'
import FirstPaymentWebhookController from './FirstPaymentWebhookController'
const Controllers = {
    AftercareWebhookController: Object.assign(AftercareWebhookController, AftercareWebhookController),
FirstPaymentWebhookController: Object.assign(FirstPaymentWebhookController, FirstPaymentWebhookController),
}

export default Controllers