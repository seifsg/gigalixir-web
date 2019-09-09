import { AUTH_CHECK, AUTH_LOGOUT } from 'react-admin'
import { check, login, logout, Session } from './api/sessions'
import logger from './logger'

function logError<T>(reason: T): Promise<T> {
  logger.error(JSON.stringify(reason))
  return Promise.reject(reason)
}

// copied from https://github.com/marmelab/react-admin/blob/089bae3b288aa3771799ffe82afa1c4e19bed729/packages/ra-core/src/types.ts
// how to import it?
type AuthActions = 'AUTH_LOGIN' | 'AUTH_LOGOUT' | 'AUTH_ERROR' | 'AUTH_CHECK' | 'AUTH_GET_PERMISSIONS'
interface AuthLoginParams {
  username: string
  password: string
}
interface AuthErrorParams {
  status: number
}
type AuthParams = AuthLoginParams | AuthErrorParams | {} | undefined
const isLogin = (params: AuthParams, type: AuthActions): params is AuthLoginParams => type === 'AUTH_LOGIN'
const isError = (params: AuthParams, type: AuthActions): params is AuthErrorParams => type === 'AUTH_ERROR'

// how to narrow return type based on params
function authProvider<T extends AuthActions>(authType: T, params?: AuthParams): Promise<Session | {} | void> {
  let result: Promise<Session | {} | void>
  if (isLogin(params, authType)) {
    // called when the user attempts to log in
    const { username, password } = params
    result = login(username, password)
  } else if (authType === AUTH_LOGOUT) {
    // called when the user clicks on the logout button
    result = logout()
  } else if (isError(params, authType)) {
    // called when the API returns an error
    const { status } = params
    if (status === 401 || status === 403) {
      result = logout()
    } else {
      result = Promise.resolve()
    }
  } else if (authType === AUTH_CHECK) {
    // called when the user navigates to a new location
    result = check()
  } else {
    const message = `Unknown method: ${authType}`
    result = Promise.reject(message)
  }
  return result.catch(logError)
}

export default authProvider
