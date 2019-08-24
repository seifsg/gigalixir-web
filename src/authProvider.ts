import { AUTH_GET_PERMISSIONS, AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
import { check, login, logout } from './api/sessions'
import logger from './logger'

function logError<T>(reason: T): Promise<T> {
    logger.error(JSON.stringify(reason))
    return Promise.reject(reason)
}

export default (authType: any, params?: any) => {
    let result: Promise<any>
    if (authType === AUTH_LOGIN) {
        // called when the user attempts to log in
        const { username, password } = params;
        result = login(username, password)
    } else if (authType === AUTH_LOGOUT) {
        // called when the user clicks on the logout button
        result = logout()
    } else if (authType === AUTH_ERROR) {
        // called when the API returns an error
        const { status } = params;
        if (status === 401 || status === 403) {
            result = logout()
        } else {
            result = Promise.resolve();
        }
    } else if (authType === AUTH_CHECK) {
        // called when the user navigates to a new location
        result = check()
    } else {
        const message = `Unknown method: ${authType}`;
        result = Promise.reject(message)
    }
    return result.catch(logError)
}
