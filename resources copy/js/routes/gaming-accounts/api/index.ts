import console from './console'
import files from './files'
import backups from './backups'
import databases from './databases'
import schedules from './schedules'
const api = {
    console: Object.assign(console, console),
files: Object.assign(files, files),
backups: Object.assign(backups, backups),
databases: Object.assign(databases, databases),
schedules: Object.assign(schedules, schedules),
}

export default api