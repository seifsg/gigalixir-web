import {
    // fetchUtils,
    GET_LIST,
    // GET_ONE,
    // GET_MANY,
    // GET_MANY_REFERENCE,
    // CREATE,
    // UPDATE,
    // UPDATE_MANY,
    // DELETE,
    // DELETE_MANY,
} from 'react-admin';
import * as apps from './api/apps'

export default (type: string, resource: string, params: object) => {
    if (type === GET_LIST) {
        if (resource === "apps") {
            return apps.get()
        }
    }
}
