import * as apps from './api/apps'
import * as permissions from './api/permissions'
import * as databases from './api/databases'
import getStats from './api/stats'
import * as users from './api/users'
import * as paymentMethods from './api/payment_methods'
import * as invoices from './api/invoices'
import logger from './logger'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GetListParams {}
interface GetListParamsByID extends GetListParams {
  id: string // app id
}
interface CreateParams<T> {
  data: T
}
interface CreateUserParams {
  email: string
  password: string
}
interface CreateAppParams {
  name: string
  cloud: string
  region: string
}
interface CreatePasswordParams {
  email: string
}
interface CreatePermissionParams {
  id: string // app id
  email: string
}

interface GetOneParams {
  id: string
}

interface DeletePermissionParams {
  id: string
  email: string
}

interface UpdateConfirmationParams {
  email: string
}
interface UpdatePasswordParams {
  token: string
  newPassword: string
}
interface UpdatePaymentMethodParams {
  token: string
}
interface UpdateUserParams {
  token: string
}
interface UpdateAppParams {
  replicas: number
  size: number
}
interface UpdateParams<T> {
  id: string
  data: T
  previousData: T
}
type DataProviderParams =
  | CreateParams<
      | CreateAppParams
      | CreateUserParams
      | CreatePasswordParams
      | CreatePermissionParams
    >
  | GetListParams
  | GetListParamsByID
  | GetOneParams
  | DeletePermissionParams
  | UpdateParams<
      | UpdateAppParams
      | UpdatePaymentMethodParams
      | UpdateUserParams
      | UpdatePasswordParams
      | UpdateConfirmationParams
    >

const isGetList = (
  params: DataProviderParams,
  type: string
): params is GetListParams | GetListParamsByID => type === 'GET_LIST'
const isGetListByID = (
  params: DataProviderParams,
  type: string
): params is GetListParamsByID => type === 'GET_LIST_BY_ID'
const isCreateApp = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is CreateParams<CreateAppParams> =>
  type === 'CREATE' && resource === 'apps'
const isCreateUser = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is CreateParams<CreateUserParams> =>
  type === 'CREATE' && resource === 'users'
const isCreatePassword = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is CreateParams<CreatePasswordParams> =>
  type === 'CREATE' && resource === 'password'
const isCreatePermission = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is CreateParams<CreatePermissionParams> =>
  type === 'CREATE' && resource === 'permissions'
const isGetOne = (
  params: DataProviderParams,
  type: string
): params is GetOneParams => type === 'GET_ONE'
const isDeleteOne = (
  params: DataProviderParams,
  type: string
): params is DeletePermissionParams => type === 'DELETE'
const isUpdatePassword = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is UpdateParams<UpdatePasswordParams> =>
  type === 'UPDATE' && resource === 'password'
const isUpdatePaymentMethod = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is UpdateParams<UpdatePaymentMethodParams> =>
  type === 'UPDATE' && resource === 'payment_methods'
const isUpdateUser = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is UpdateParams<UpdateUserParams> =>
  type === 'UPDATE' && resource === 'users'
const isUpdateApp = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is UpdateParams<UpdateAppParams> =>
  type === 'UPDATE' && resource === 'apps'
const isUpdateConfirmation = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is UpdateParams<UpdateConfirmationParams> =>
  type === 'UPDATE' && resource === 'confirmation'

// can I use imported CREATE and GET_LIST instead?
// const a = ['GET_LIST', 'CREATE'] as const
// type DataProviderType = typeof a[number]
type DataProviderType =
  | 'GET_LIST_BY_ID'
  | 'GET_LIST'
  | 'CREATE'
  | 'GET_ONE'
  | 'UPDATE'
  | 'DELETE'

// function foo<T extends DataProviderType>(type: T, resource: string, params: T extends 'CREATE' ? CreateParams
//     : T extends 'GET_LIST' ? GetListParams
//         : T extends 'GET_ONE' ? GetOneParams
//             : UpdateParams): Promise<{}> {
const dataProvider = <T extends DataProviderType>(
  type: T,
  resource:
    | 'apps'
    | 'permissions'
    | 'invoices'
    | 'stats'
    | 'profile'
    | 'payment_methods'
    | 'users'
    | 'password'
    | 'confirmation'
    | 'databases',
  params: DataProviderParams
): Promise<unknown> => {
  if (isGetList(params, type)) {
    if (resource === 'invoices') {
      return invoices.pdfs()
    }
    if (resource === 'apps') {
      return apps.list().catch(e => {
        logger.debug(JSON.stringify(e))
        if (e.status === 401) {
          // semantically, probably better to reject here since it's an error, but
          // this is the only way I can figure out to stop showing 401 notifications.
          // maybe try overriding the Notification component instead!
          return Promise.resolve({ data: [], total: 0 })
        }
        return Promise.reject(e)
      })
    }
  }
  if (isGetListByID(params, type)) {
    if (resource === 'databases') {
      return databases.get(params.id)
    }
  }
  if (isCreateApp(params, resource, type)) {
    const { name, cloud, region } = params.data
    return apps.create(name, cloud, region)
  }
  if (isCreateUser(params, resource, type)) {
    const { email, password } = params.data
    return users.create(email, password)
  }
  if (isCreatePermission(params, resource, type)) {
    const { email, id } = params.data
    return permissions.create(id, email)
  }
  if (isDeleteOne(params, type)) {
    return permissions.del(params.id, params.email)
  }
  if (isGetOne(params, type)) {
    if (resource === 'permissions') {
      return permissions.get(params.id)
    }
    if (resource === 'apps') {
      return apps.get(params.id)
    }
    if (resource === 'stats') {
      return getStats(params.id)
    }
    if (resource === 'profile') {
      return users.get()
    }
    if (resource === 'payment_methods') {
      return paymentMethods.get()
    }
  }
  if (isUpdatePaymentMethod(params, resource, type)) {
    return paymentMethods.update(params.data.token)
  }
  if (isUpdateUser(params, resource, type)) {
    return users.upgrade(params.data.token)
  }
  if (isUpdateApp(params, resource, type)) {
    return apps
      .scale(params.id, params.data.size, params.data.replicas)
      .then(response => {
        const { data } = response
        return {
          data: {
            id: params.id,
            size: data.size,
            replicas: data.replicas
          }
        }
      })
  }

  // resend confirmation
  // should I use type == 'RESEND' instead of 'UPDATE'?
  if (isUpdateConfirmation(params, resource, type)) {
    return users.resendConfirmation(params.data.email)
  }

  // reset password vs set password
  // should I use type == 'RESET' instead of 'CREATE'?
  if (isCreatePassword(params, resource, type)) {
    return users.resetPassword(params.data.email)
  }
  if (isUpdatePassword(params, resource, type)) {
    return users.setPassword(params.data.token, params.data.newPassword)
  }
  throw new Error(`${type} ${resource} not implemented yet`)
}

export default dataProvider
