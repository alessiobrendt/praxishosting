import queueMonitor from './queue-monitor'
const namespaced = {
    queueMonitor: Object.assign(queueMonitor, queueMonitor),
}

export default namespaced