import ShowQueueMonitorController from './ShowQueueMonitorController'
import DeleteMonitorController from './DeleteMonitorController'
import RetryMonitorController from './RetryMonitorController'
import PurgeMonitorsController from './PurgeMonitorsController'
const Controllers = {
    ShowQueueMonitorController: Object.assign(ShowQueueMonitorController, ShowQueueMonitorController),
DeleteMonitorController: Object.assign(DeleteMonitorController, DeleteMonitorController),
RetryMonitorController: Object.assign(RetryMonitorController, RetryMonitorController),
PurgeMonitorsController: Object.assign(PurgeMonitorsController, PurgeMonitorsController),
}

export default Controllers