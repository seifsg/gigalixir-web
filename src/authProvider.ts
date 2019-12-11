import { AUTH_CHECK, AUTH_LOGOUT } from 'react-admin'
import { check, login, logout, Session } from './api/sessions'
import logger from './logger'

function logError<T>(reason: T): Promise<T> {
  logger.error(JSON.stringify(reason))
  return Promise.reject(reason)
}

// copied from https://github.com/marmelab/react-admin/blob/089bae3b288aa3771799ffe82afa1c4e19bed729/packages/ra-core/src/types.ts
// how to import it?
type AuthActions =
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'AUTH_ERROR'
  | 'AUTH_CHECK'
  | 'AUTH_GET_PERMISSIONS'
interface AuthLoginParams {
  email: string
  password: string
}
interface AuthErrorParams {
  status: number
}
type AuthParams = AuthLoginParams | AuthErrorParams | {} | undefined
const isLogin = (
  params: AuthParams,
  type: AuthActions
): params is AuthLoginParams => type === 'AUTH_LOGIN'
const isError = (
  params: AuthParams,
  type: AuthActions
): params is AuthErrorParams => type === 'AUTH_ERROR'

// how to narrow return type based on params
// this says it returns { data: string }, but that's just for the tests. that's not really true when
// react-admin calls it? does it matter?
function authProvider<T extends AuthActions>(
  authType: T,
  params?: AuthParams
): Promise<{ data: string }> {
  let result: Promise<Session | {} | void>
  if (isLogin(params, authType)) {
    // called when the user attempts to log in
    const { email, password } = params

    // if there is a login error, just discard the msg since it is not a good one: "401 something"
    // this notification system is really bothering me. in this case we can not override the
    // action and remove the meta notification or onFailure section because the sideEffect/auth saga
    // itself checks for the error and dispatches the notification. I'm not sure how to hide the
    // notification here, but we can change the msg to be better than "401". i think we probably need
    // to override the Notification element at some point since this is getting really messy.
    result = login(email, password).catch(e => {
      e.message = undefined
      return Promise.reject(e)
    })
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
