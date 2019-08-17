import logger from './logger';
import {
// fetchUtils,
// GET_LIST,
// GET_ONE,
// GET_MANY,
// GET_MANY_REFERENCE,
// CREATE,
// UPDATE,
// UPDATE_MANY,
// DELETE,
// DELETE_MANY,
} from 'react-admin';
import * as apps from './api/apps';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GetListParams {} 
interface CreateParams {
    data: {
        name: string;
        cloud: string;
        region: string;
    };
}
interface GetOneParams {
    id: string
}

type DataProviderParams = CreateParams | GetListParams | GetOneParams

const isGetList = (params: DataProviderParams, type: string): params is GetListParams => type === 'GET_LIST'
const isCreate = (params: DataProviderParams, type: string): params is CreateParams => type === 'CREATE'
const isGetOne = (params: DataProviderParams, type: string): params is GetOneParams => type === 'GET_ONE'

// can I use imported CREATE and GET_LIST instead?
// const a = ['GET_LIST', 'CREATE'] as const
// type DataProviderType = typeof a[number]
type DataProviderType = 'GET_LIST' | 'CREATE' | 'GET_ONE' | 'UPDATE'

function foo<T extends DataProviderType>(type: T, resource: string, params: T extends 'CREATE' ? CreateParams : GetListParams): Promise<{}> {
    logger.debug(type)
    logger.debug(resource)
    logger.debug(JSON.stringify(params))
    if (isGetList(params, type)) {
        if (resource === 'apps') {
            return apps.list();
        }
    }
    if (isCreate(params, type)) {
        if (resource === 'apps') {
            const { name, cloud, region } = params.data 
            return apps.create(name, cloud, region);
        }
    }
    if (isGetOne(params, type)) {
        if (resource === 'apps') {
            return apps.get(params.id)
        }
    }
    throw new Error('not implemented yet');
}

export default foo
