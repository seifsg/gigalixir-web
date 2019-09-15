import * as apps from './api/apps'
import getStats from './api/stats'
import getUser from './api/users'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GetListParams {}
interface CreateParams {
  data: {
    name: string
    cloud: string
    region: string
  }
}
interface GetOneParams {
  id: string
}
interface UpdateParams<T> {
  id: string
  data: T
  previousData: T
}

type DataProviderParams<T> = CreateParams | GetListParams | GetOneParams | UpdateParams<T>

const isGetList = <T>(params: DataProviderParams<T>, type: string): params is GetListParams => type === 'GET_LIST'
const isCreate = <T>(params: DataProviderParams<T>, type: string): params is CreateParams => type === 'CREATE'
const isGetOne = <T>(params: DataProviderParams<T>, type: string): params is GetOneParams => type === 'GET_ONE'
const isUpdate = <T>(params: DataProviderParams<T>, type: string): params is UpdateParams<T> => type === 'UPDATE'

// can I use imported CREATE and GET_LIST instead?
// const a = ['GET_LIST', 'CREATE'] as const
// type DataProviderType = typeof a[number]
type DataProviderType = 'GET_LIST' | 'CREATE' | 'GET_ONE' | 'UPDATE'

// function foo<T extends DataProviderType>(type: T, resource: string, params: T extends 'CREATE' ? CreateParams
//     : T extends 'GET_LIST' ? GetListParams
//         : T extends 'GET_ONE' ? GetOneParams
//             : UpdateParams): Promise<{}> {
const dataProvider = <T extends DataProviderType, P extends { replicas: number; size: number }>(
  type: T,
  resource: 'apps' | 'stats' | 'profile',
  params: DataProviderParams<P>,
): Promise<{}> => {
  if (isGetList(params, type)) {
    if (resource === 'apps') {
      return apps.list()
    }
  }
  if (isCreate(params, type)) {
    if (resource === 'apps') {
      const { name, cloud, region } = params.data
      return apps.create(name, cloud, region)
    }
  }
  if (isGetOne(params, type)) {
    if (resource === 'apps') {
      return apps.get(params.id)
    }
    if (resource === 'stats') {
      return getStats(params.id)
    }
    if (resource === 'profile') {
      return getUser()
    }
  }
  if (isUpdate(params, type)) {
    if (resource === 'apps') {
      return apps.scale(params.id, params.data.size, params.data.replicas).then(response => {
        const { data } = response
        return {
          data: {
            id: params.id,
            size: data.size,
            replicas: data.replicas,
          },
        }
      })
    }
  }
  throw new Error(`${type} ${resource} not implemented yet`)
}

export default dataProvider
