import * as apps from './api/apps'
import getStats from './api/stats'
import * as users from './api/users'
import { get as getPaymentMethod } from './api/payment_methods'
import logger from './logger'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GetListParams {}
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

interface GetOneParams {
  id: string
}

interface UpdateConfirmationParams {
  email: string
}
interface UpdatePasswordParams {
    token: string,
        newPassword: string
}
interface UpdateAppParams {
    replicas: number,
        size: number
}
interface UpdateParams<T> {
  id: string
  data: T
  previousData: T
}
type DataProviderParams =
    CreateParams<
      CreateAppParams
      | CreateUserParams
      | CreatePasswordParams
    >
  | GetListParams
  | GetOneParams
  | UpdateParams<
      UpdateAppParams
      | UpdatePasswordParams
      | UpdateConfirmationParams
    >

const isGetList = (
  params: DataProviderParams,
  type: string
): params is GetListParams => type === 'GET_LIST'
const isCreateApp = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is CreateParams<CreateAppParams> => type === 'CREATE' && resource === 'apps'
const isCreateUser = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is CreateParams<CreateUserParams> => type === 'CREATE' && resource === 'users'
const isCreatePassword = (
  params: DataProviderParams,
  resource: string,
  type: string
): params is CreateParams<CreatePasswordParams> => type === 'CREATE' && resource === 'password'
const isGetOne = (
  params: DataProviderParams,
  type: string
): params is GetOneParams => type === 'GET_ONE'
const isUpdatePassword = (
  params: DataProviderParams,
    resource: string,
  type: string
): params is UpdateParams<UpdatePasswordParams> => type === 'UPDATE' && resource === 'password'
const isUpdateApp = (
  params: DataProviderParams,
    resource: string,
  type: string
): params is UpdateParams<UpdateAppParams> => type === 'UPDATE' && resource === 'apps'
const isUpdateConfirmation = (
  params: DataProviderParams,
    resource: string,
  type: string
): params is UpdateParams<UpdateConfirmationParams> => type === 'UPDATE' && resource === 'confirmation'


// can I use imported CREATE and GET_LIST instead?
// const a = ['GET_LIST', 'CREATE'] as const
// type DataProviderType = typeof a[number]
type DataProviderType = 'GET_LIST' | 'CREATE' | 'GET_ONE' | 'UPDATE'

// function foo<T extends DataProviderType>(type: T, resource: string, params: T extends 'CREATE' ? CreateParams
//     : T extends 'GET_LIST' ? GetListParams
//         : T extends 'GET_ONE' ? GetOneParams
//             : UpdateParams): Promise<{}> {
const dataProvider = <
  T extends DataProviderType,
>(
  type: T,
  resource: 'apps' | 'stats' | 'profile' | 'payment_methods' | 'users' | 'password' | 'confirmation',
  params: DataProviderParams
): Promise<{}> => {
  if (isGetList(params, type)) {
    if (resource === 'apps') {
      const result = apps.list()
        return result.catch(e => {
          if (e.message === "Request failed with status code 401") {
            logger.error(JSON.stringify(e))
            // return Promise.reject(e)
            // return Promise.reject({
            //     message: "fake-message"
            // })
            // return Promise.reject("error-as-string")
            // semantically, probably better to reject here since it's an error, but
            // this is the only way I can figure out to stop showing 401 notifications.
            // maybe try overriding the Notification component instead!
            return Promise.resolve({data: [], total: 0})
          } else {
              return Promise.reject(e)
          }
        })
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
  if (isGetOne(params, type)) {
    if (resource === 'apps') {
      return apps.get(params.id)
    }
    if (resource === 'stats') {
      return getStats(params.id)
    }
    if (resource === 'profile') {
      return users.get().catch(e => {
          if (e.message === "Request failed with status code 401") {
          logger.error(JSON.stringify(e))
          return Promise.resolve({data: {id: 'profile'}})
          } else {
              return Promise.reject(e)
          }
      })
    }
    if (resource === 'payment_methods') {
      return getPaymentMethod()
    }
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
      return users.resend_confirmation(params.data.email)
  }

    // reset password vs set password
    // should I use type == 'RESET' instead of 'CREATE'?
  if (isCreatePassword(params, resource, type)) {
      return users.reset_password(params.data.email)
  }
  if (isUpdatePassword(params, resource, type)) {
      return users.set_password(params.data.token, params.data.newPassword)
  }
  throw new Error(`${type} ${resource} not implemented yet`)
}

export default dataProvider
