import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
import axios from 'axios';

let host = "http://localhost:4000"

let logError = (reason: any) => {
    console.log(reason)
    return Promise.reject(reason)
}

let get_csrf = async (): Promise<string> => {
    const response = await axios.get(host + '/frontend/api/csrf', { withCredentials: true });
    return response.data.data;
}
let logout = async (csrf_token: string) => {
    const response = await axios.delete(host + '/frontend/api/sessions', { headers: { "X-CSRF-Token": csrf_token }, withCredentials: true });
    return response.data;
}

export default (auth_type: any, params: any) => {
    let result: Promise<any>
    if (auth_type === AUTH_LOGIN) {
        // called when the user attempts to log in
        const { username, password } = params;
        result = get_csrf()
            .then(async (csrf_token: string): Promise<{ data: any }> => {
                const response = await axios.post(host + '/frontend/api/sessions', { session: { email: username, password: password } }, { headers: { "X-CSRF-Token": csrf_token }, withCredentials: true });
                return response.data;
            })
    } else if (auth_type === AUTH_LOGOUT) {
        // called when the user clicks on the logout button
        result = get_csrf().then(logout)
    } else if (auth_type === AUTH_ERROR) {
        // called when the API returns an error
        const { status } = params;
        if (status === 401 || status === 403) {
            result = get_csrf().then(logout)
        } else {
            result = Promise.resolve();
        }
    } else if (auth_type === AUTH_CHECK) {
        // called when the user navigates to a new location
        result = axios.get(host + '/frontend/api/sessions', { withCredentials: true })
            .then(response => response.data)
    }
    else {
        result = Promise.reject(`Unknown method: ${auth_type}`)
    }
    return result.catch(logError)
}
