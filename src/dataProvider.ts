import * as apps from './api/apps';
import * as stats from './api/stats';

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
    id: string;
}
interface UpdateParams {
    id: string;
    data: any;
    previousData: any;
}

type DataProviderParams = CreateParams | GetListParams | GetOneParams | UpdateParams;

const isGetList = (params: DataProviderParams, type: string): params is GetListParams => type === 'GET_LIST';
const isCreate = (params: DataProviderParams, type: string): params is CreateParams => type === 'CREATE';
const isGetOne = (params: DataProviderParams, type: string): params is GetOneParams => type === 'GET_ONE';
const isUpdate = (params: DataProviderParams, type: string): params is UpdateParams => type === 'UPDATE';

// can I use imported CREATE and GET_LIST instead?
// const a = ['GET_LIST', 'CREATE'] as const
// type DataProviderType = typeof a[number]
type DataProviderType = 'GET_LIST' | 'CREATE' | 'GET_ONE' | 'UPDATE';

// function foo<T extends DataProviderType>(type: T, resource: string, params: T extends 'CREATE' ? CreateParams
//     : T extends 'GET_LIST' ? GetListParams
//         : T extends 'GET_ONE' ? GetOneParams
//             : UpdateParams): Promise<{}> {
const dataProvider = <T extends DataProviderType>(
    type: T,
    resource: string,
    params: DataProviderParams,
): Promise<{}> => {
    if (isGetList(params, type)) {
        if (resource === 'apps') {
            return apps.list();
        }
    }
    if (isCreate(params, type)) {
        if (resource === 'apps') {
            const { name, cloud, region } = params.data;
            return apps.create(name, cloud, region);
        }
    }
    if (isGetOne(params, type)) {
        if (resource === 'apps') {
            return apps.get(params.id);
        }
        if (resource === 'stats') {
            return stats.get(params.id);
        }
    }
    if (isUpdate(params, type)) {
        if (resource === 'apps') {
            return apps.scale(params.id, params.data.size, params.data.replicas).then(response => {
                const data = response.data;
                return {
                    data: {
                        id: params.id,
                        size: data.size,
                        replicas: data.replicas,
                    },
                };
            });
        }
    }
    throw new Error(`${type} ${resource} not implemented yet`);
};

export default dataProvider;
