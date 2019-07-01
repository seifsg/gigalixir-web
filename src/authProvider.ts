import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
import { check, login, logout } from './api/sessions'

const logError = (reason: any) => {
    console.log(reason)
    return Promise.reject(reason)
}

export default (auth_type: any, params?: any) => {
    let result: Promise<any>
    if (auth_type === AUTH_LOGIN) {
        // called when the user attempts to log in
        const { username, password } = params;
        result = login(username, password)
    } else if (auth_type === AUTH_LOGOUT) {
        // called when the user clicks on the logout button
        result = logout()
    } else if (auth_type === AUTH_ERROR) {
        // called when the API returns an error
        const { status } = params;
        if (status === 401 || status === 403) {
            result = logout()
        } else {
            result = Promise.resolve();
        }
    } else if (auth_type === AUTH_CHECK) {
        // called when the user navigates to a new location
        result = check()
    }
    else {
        result = Promise.reject(`Unknown method: ${auth_type}`)
    }
    return result.catch(logError)
}
