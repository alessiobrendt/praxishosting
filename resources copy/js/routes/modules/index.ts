import newsletter from './newsletter'
import contact from './contact'
const modules = {
    newsletter: Object.assign(newsletter, newsletter),
contact: Object.assign(contact, contact),
}

export default modules