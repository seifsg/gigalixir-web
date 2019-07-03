import {
    // fetchUtils,
    GET_LIST,
    // GET_ONE,
    // GET_MANY,
    // GET_MANY_REFERENCE,
    CREATE,
    // UPDATE,
    // UPDATE_MANY,
    // DELETE,
    // DELETE_MANY,
} from 'react-admin';
import * as apps from './api/apps';

export default (type: string, resource: string, params: any) => {
    console.log(type, resource, params)
    if (type === GET_LIST) {
        if (resource === 'apps') {
            return apps.get();
        }
    } else if (type === CREATE) {
        if (resource === 'apps') {
            const { name, cloud, region } = params.data 
            return apps.create(name, cloud, region);
        }
    }
    throw new Error('not implemented yet');
};
